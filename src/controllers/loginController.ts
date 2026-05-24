import { Request, Response } from "express";
import { userRepo } from "../repository/userRepo";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  try {
    const foundUser = await userRepo.getUserByEmail(email);

    if (foundUser == null) {
      res.sendStatus(401);
      return;
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      res.sendStatus(401);
      return;
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      res.status(500).json({ message: "Server configuration error" });
      return;
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          email: foundUser.email,
          role: foundUser.role,
        },
      },
      accessTokenSecret,
      { expiresIn: "30s" },
    );

    //prettier-ignore
    const refreshToken = jwt.sign(
    { email: foundUser.email }, 
    refreshTokenSecret, 
    { expiresIn: "1d" });

    await userRepo.updateUserRefreshToken(email, refreshToken);

    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default { loginUser };
