type Role = "user" | "admin";

//Model
type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: Role;
  refreshToken: string;
  created_at: Date;
};

//Dto
export type CreateUserDTO = Omit<User, "id" | "created_at">;
export type UserResponseDTO = Omit<User, "password" | "refresh_token">;
