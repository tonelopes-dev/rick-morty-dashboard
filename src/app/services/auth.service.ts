import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_KEY = environment.authKey;

  constructor(private router: Router) {}

  login(username: string, avatar: string): void {
    const authData = { username, avatar, timestamp: new Date().getTime() };
    sessionStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
    this.router.navigate(['/characters']);
  }

  logout(): void {
    sessionStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/login']);
  }

  getAuthData(): {
    username: string;
    avatar: string;
    timestamp: number;
  } | null {
    const authData = sessionStorage.getItem(this.AUTH_KEY);
    if (!authData) return null;
    return JSON.parse(authData);
  }

  isAuthenticated(): boolean {
    const authData = sessionStorage.getItem(this.AUTH_KEY);
    if (!authData) return false;

    try {
      const { timestamp } = JSON.parse(authData);
      // Token expira após 8 horas
      return new Date().getTime() - timestamp < 8 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }
}
