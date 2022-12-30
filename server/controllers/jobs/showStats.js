import Job from "../../models/Job.js";
import mongoose from "mongoose";
import moment from "moment";
import StatusCodes from "http-status-codes";

// Aggregation pipeline
const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } }, // all jobs for one user
    { $group: { _id: "$status", count: { $sum: 1 } } }, // group by job-count for each (job-status) field
  ]);

  // manipulating the stats structure to be more usable
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count; // Ex: (pending: 34)
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  // data for chart
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, // sort from latest to oldest
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1) // as mongoDB uses months(1-12) not (0-11)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export default showStats;
