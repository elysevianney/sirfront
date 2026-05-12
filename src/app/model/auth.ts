export interface AuthResponse {
  token: string
}

export interface AuthUser {
  email: string
  roles: string[]
  token: string
}