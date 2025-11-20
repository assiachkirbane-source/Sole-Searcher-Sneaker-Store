import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  mode = input.required<'login' | 'register'>();
  close = output<void>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  closeModal() {
    this.close.emit();
  }

  switchToRegister() {
    this.mode.set('register');
    this.errorMessage.set(null);
    this.loginForm.reset();
  }
  
  switchToLogin() {
    this.mode.set('login');
    this.errorMessage.set(null);
    this.registerForm.reset();
  }

  async onLoginSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.errorMessage.set(null);
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);
      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(error.message);
    }
  }

  async onRegisterSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.errorMessage.set(null);
    const { email, password } = this.registerForm.value;

    try {
      await this.authService.register(email!, password!);
      this.closeModal();
    } catch (error: any) {
      this.errorMessage.set(error.message);
    }
  }
}
