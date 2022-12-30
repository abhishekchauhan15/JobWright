import Job from "../../models/Job.js";
import  StatusCodes  from "http-status-codes";
import  {NotFoundError}  from "../../errors/index.js";
import checkPermissions from "../../utils/checkPermissions.js";

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  // check permissions -> to prevent different user from deleting other users' jobs if they have their job-ID
  checkPermissions(req.user, job.createdBy);

  await job.remove();
  res.status(StatusCodes.OK).json({ msg: "success! Job Removed" }); // for postman
};

export default deleteJob;
