import { Request, Response } from "express";
import { userRepo } from "../repository/userRepo";
import jwt, { JwtPayload } from "jsonwebtoken";

async function refreshToken(req: Request, res: Response) {
  const cookies = req.cookies;
  if (cookies?.jwt) {
    res.sendStatus(401);
    return;
  }

  const refreshToken = cookies.jwt;
  const foundUser = await userRepo.getUserByRefreshToken(refreshToken);
  if (foundUser == null) {
    res.sendStatus(403);
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    res.status(500).json({ message: "Server configuration error" });
  }

  jwt.verify(refreshToken, refreshTokenSecret!, (err: jwt.VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) {
      res.sendStatus(403); //forbidden
      return;
    }

    const decodedUEmail = (decoded as JwtPayload).email;
    if (foundUser.email !== decodedUEmail) {
      res.sendStatus(403); //forbidden
      return;
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.email,
          roles: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: "30s" },
    );

    res.json({ accessToken });
  });
}
