import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdminComponent } from './admin/admin.component';
import { authGuard } from './auth.guard';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'admin', 
    component: AdminComponent,
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' } // Redirect any other path to home
];
