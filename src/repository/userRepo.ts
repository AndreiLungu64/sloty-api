import { create } from "node:domain";
import { query } from "../db/db";
import { CreateUserDTO, UserResponseDTO } from "../model/user";

async function getAllUsers(): Promise<UserResponseDTO[]> {
  const result = await query("SELECT * FROM user_account ORDER BY id ASC");
  return result.rows;
}

async function getUserById(id: string): Promise<UserResponseDTO | null> {
  const result = await query("SELECT * FROM user_account WHERE id = $1", [id]);
  return result.rowCount ? result.rows[0] : null;
}

async function createUser(user: CreateUserDTO): Promise<UserResponseDTO> {
  const result = await query("INSERT INTO user_account (email, password, role) VALUES ($1, $2, $3) RETURNING *", [user.email, user.password, user.role]);
  return result.rows[0];
}

export const userRepo = {
  getAllUsers,
  getUserById,
  createUser,
};
