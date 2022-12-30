import User from "../../models/user.js";
import  StatusCodes  from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../../errors/index.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please Provide all values");
  }

  const user = await User.findOne({ email }).select("+password"); // here we ask database to provide the user with password which we specified above that it's unselected

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  console.log(user);

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  user.password = undefined; // so that it won't be sent in the response

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

export default login;
