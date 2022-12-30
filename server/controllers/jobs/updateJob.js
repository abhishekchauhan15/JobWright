import Job from "../../models/Job.js";
import StatusCodes from "http-status-codes";
import { BadRequestError, NotFoundError } from "../../errors/index.js";
import checkPermissions from "../../utils/checkPermissions.js";

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;

  const { company, position } = req.body;

  // Extra step for validation
  if (!company || !position) {
    throw new BadRequestError("Please Provide All Values");
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  // check permissions -> to prevent different user from modifying other users' jobs if they have their job-ID
  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true, // validate that the data exists
  });

  res.status(StatusCodes.OK).json({ updatedJob }); // for postman
};

export default updateJob;
