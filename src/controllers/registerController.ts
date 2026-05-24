import { Request, Response } from "express";
import { query } from "../db/db";
import bcrypt from "bcryptjs";
import { CreateUserDTO } from "../model/user";
import { userRepo } from "../repository/userRepo";

async function registerUser(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required." });
    return;
  }

  try {
    const duplicateUser = await query("SELECT * FROM user_account WHERE email = $1", [email]);
    const duplicate = duplicateUser.rowCount != 0;
    if (duplicate) {
      res.sendStatus(409);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: CreateUserDTO = {
      email: email,
      password: hashedPassword,
      role: "user",
    };

    await userRepo.createUser(newUser);
    res.status(201).json({ message: `New user was created!` });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default { registerUser };
