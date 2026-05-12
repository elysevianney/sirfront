export interface Environment {
  /**
   * L'environnement est-il en production ?
   */
  production: boolean

  /**
   * L'URL de l'API
   */
  apiUrl: string
}

export const environment: Environment = {
  production: false,
  apiUrl: '/api'
}