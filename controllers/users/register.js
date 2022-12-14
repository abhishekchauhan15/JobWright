import User from "../../models/user.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../errors/index.js";

// here we're  replacing try-catch with "express-async-errors" Package which passes error to the errorHandler
const register = async (req, res) => {
  const { name, email, password } = req.body;
  // creating custom error messages:
  if (!name || !email || !password) {
    throw new BadRequestError("Please Provide all values");
  }
  // checking for existed email
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  // sending everything but the password
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
    },
    token,
    location: user.location,
  });
};

export default register;
