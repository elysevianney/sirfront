export interface AuthResponse {
  token: string
}

export interface AuthUser {
  id?: number
  email: string
  roles: string[]
  token: string
}
