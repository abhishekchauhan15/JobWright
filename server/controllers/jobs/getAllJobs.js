import Job from "../../models/Job.js";
import StatusCodes from "http-status-codes";

const getAllJobs = async (req, res) => {
  const { status, jobType, sort, search } = req.query;

  // object that contains the queries that will be provided to mongoDB
  const queryObject = {
    createdBy: req.user.userId,
  };

  // add queries based on condition
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" }; // to search using regular-expressions NOT exact text
  }

  // NO AWAIT
  let result = Job.find(queryObject);

  // chain sort conditions
  if (sort === "latest") {
    result = result.sort("-createdAt"); // Descending
  }
  if (sort === "oldest") {
    result = result.sort("createdAt"); // Ascending
  }
  if (sort === "a-z") {
    result = result.sort("position"); // Ascending
  }
  if (sort === "z-a") {
    result = result.sort("-position"); // Descending
  }

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; // skipping 10 items each time to display the other 10 in the next page

  result = result.skip(skip).limit(limit);
  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject); // instead of using the length as length indicates 10 items here and not all jobs
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

export default getAllJobs;
