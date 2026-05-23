import { Request, Response } from "express";

function registerUser(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required." });
    return;
  }
}

export default { registerUser };
