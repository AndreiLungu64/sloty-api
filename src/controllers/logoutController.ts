import { Request, Response } from "express";
import { userRepo } from "../repository/userRepo";

async function logoutUser(req: Request, res: Response) {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.sendStatus(204);
    return;
  }

  try {
    const refreshToken = cookies.jwt;
    const foundUser = await userRepo.getUserByRefreshToken(refreshToken);

    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
      res.sendStatus(204);
      return;
    }

    await userRepo.deleteUserRefreshToken(foundUser.email);
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default { logoutUser };
