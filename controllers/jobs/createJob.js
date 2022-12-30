import Job from "../../models/Job.js";
import StatusCodes from "http-status-codes";
import {BadRequestError} from "../../errors/index.js";

const createJob = async (req, res) => {
  const { position, company } = req.body;

  // only check if these 2 inputs exist as the other inputs are (select) so by default they will exist
  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export default createJob;
