import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpires,
    }
  );
};

export default generateToken;