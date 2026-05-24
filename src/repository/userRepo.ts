import { create } from "node:domain";
import { query } from "../db/db";
import { AuthUserDTO, CreateUserDTO, UserResponseDTO } from "../model/user";

async function getAllUsers(): Promise<UserResponseDTO[] | null> {
  const result = await query("SELECT * FROM user_account ORDER BY id ASC");
  return result.rows;
}

async function getUserById(id: string): Promise<UserResponseDTO | null> {
  const result = await query("SELECT * FROM user_account WHERE id = $1", [id]);
  return result.rowCount ? result.rows[0] : null;
}

async function getUserByEmail(email: string): Promise<UserResponseDTO | null> {
  const result = await query("SELECT * FROM user_account WHERE email = $1", [email]);
  return result.rowCount ? result.rows[0] : null;
}

async function getUserByRefreshToken(refreshToken: string): Promise<UserResponseDTO | null> {
  const result = await query("SELECT * FROM user_account WHERE refresh_token = $1", [refreshToken]);
  return result.rowCount ? result.rows[0] : null;
}

async function updateUserRefreshToken(email: string, refreshToken: string): Promise<UserResponseDTO | null> {
  const result = await query("UPDATE user_account SET refresh_token = $1 WHERE email = $2", [refreshToken, email]);
  return result.rowCount ? result.rows[0] : null;
}

async function createUser(user: CreateUserDTO): Promise<AuthUserDTO> {
  const result = await query("INSERT INTO user_account (email, password, role) VALUES ($1, $2, $3) RETURNING *", [user.email, user.password, user.role]);
  return result.rows[0];
}

export const userRepo = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByRefreshToken,
  updateUserRefreshToken,
  createUser,
};
