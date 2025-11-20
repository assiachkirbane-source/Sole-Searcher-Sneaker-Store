import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser();

  if (currentUser && currentUser.role === 'ADMIN') {
    return true;
  } else {
    // Redirect to the home page if not an admin
    router.navigate(['/']);
    return false;
  }
};
