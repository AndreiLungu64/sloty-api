type Role = "user" | "admin";

//Model
type User = {
  id: number;
  email: string;
  password: string;
  role: Role;
  refresh_token: string;
  created_at: Date;
};

//Dto
export type CreateUserDTO = Omit<User, "id" | "refresh_token" | "created_at">;
export type AuthUserDTO = Omit<User, "id" | "created_at">;
export type UserResponseDTO = Omit<User, "refresh_token">;
