import {
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    authService.logout();
    alert('Sua sessão expirou. Por favor, faça login novamente.');
    router.navigate(['/login']);
    return throwError(() => new Error('Sessão expirada'));
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
