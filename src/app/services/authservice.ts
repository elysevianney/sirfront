import { computed, inject, Injectable, signal, PLATFORM_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthResponse, AuthUser } from '../model/auth';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import { isPlatformBrowser } from '@angular/common';

interface JWTPayload {
  email?: string
  sub?: string
  roles?: string[]
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient)
  private readonly router = inject(Router)
  private readonly platformId = inject(PLATFORM_ID)

  private readonly _currentUser = signal<AuthUser | null>(null)
  readonly currentUser = this._currentUser.asReadonly()
  readonly userRoles = computed(() => this._currentUser()?.roles ?? [])
  readonly isAdmin = computed(() => this.userRoles().some((role) => role.toLowerCase() === 'admin'))
  readonly isLoggedIn = computed(() => this._currentUser() !== null)

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.restoreSession()
    }
  }

  private restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return
    }
    const token = sessionStorage.getItem('token')
    if (!token) {
      return
    }
    const payload = this.decodeJwt(token) as JWTPayload | null
    if (payload) {
      const user: AuthUser = {
        email: payload.email ?? payload.sub ?? '',
        roles: payload.roles ?? [],
        token,
      }
      console.log('AuthService.restoreSession user', user)
      this._currentUser.set(user)
    }
  }

  private decodeJwt(token: string): Record<string, unknown> | null {
    try {
      const base64 = token.split('.')[1]
      return JSON.parse(atob(base64))
    } catch {
      return null
    }
  }

  login(email: string, password: string): Observable<void> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {email, password}).pipe(
      map((response) => {
        const payload = this.decodeJwt(response.token) as JWTPayload | null
        const user: AuthUser = {
          email,
          roles: payload?.roles ?? [],
          token: response.token,
        }
        if (isPlatformBrowser(this.platformId)) {
          sessionStorage.setItem('token', response.token)
        }
        console.log('AuthService.login user', user)
        this._currentUser.set(user)
      }),
    )
  }

  register(nom: string, prenom: string, adresse: string, email: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/users`, {nom, prenom, adresse, email, password})
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('token')
    }
    this._currentUser.set(null)
    this.router.navigate(['/login']).then()
  }
}
