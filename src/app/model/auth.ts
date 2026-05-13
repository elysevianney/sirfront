export interface AuthResponse {
  token: string
}

export interface AuthUser {
  id?: number
  nom?: string
  prenom?: string
  email: string
  roles: string[]
  token: string
}
