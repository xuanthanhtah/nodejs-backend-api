export interface UserResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  accessToken: string;
  refreshToken: string;
}
