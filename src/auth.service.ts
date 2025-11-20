import { Injectable, signal, effect } from '@angular/core';

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

// In a real app, this would be stored securely on a server.
interface StoredUser extends User {
  passwordHash: string; // We'll store the password directly for this simulation
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userStorageKey = 'sole-searcher-users';
  private readonly sessionKey = 'sole-searcher-session';

  currentUser = signal<User | null>(null);
  private users = signal<StoredUser[]>([]);

  constructor() {
    if (this.isLocalStorageAvailable()) {
      this.loadUsersFromStorage();
      this.loadSessionFromStorage();
    }
    
    // Persist current user to localStorage to keep them logged in
    effect(() => {
      if (this.isLocalStorageAvailable()) {
        try {
          const user = this.currentUser();
          if (user) {
            localStorage.setItem(this.sessionKey, JSON.stringify(user));
          } else {
            localStorage.removeItem(this.sessionKey);
          }
        } catch (e) {
          console.error('Error writing session to localStorage', e);
        }
      }
    });
  }
  
  private isLocalStorageAvailable(): boolean {
      return typeof window !== 'undefined' && window.localStorage != null;
  }

  private loadUsersFromStorage() {
    try {
      const storedUsers = localStorage.getItem(this.userStorageKey);
      this.users.set(storedUsers ? JSON.parse(storedUsers) : []);
    } catch (e) {
      console.error('Error reading users from localStorage', e);
      this.users.set([]);
    }
  }

  private loadSessionFromStorage() {
    try {
      const storedSession = localStorage.getItem(this.sessionKey);
      this.currentUser.set(storedSession ? JSON.parse(storedSession) : null);
    } catch (e) {
      console.error('Error reading session from localStorage', e);
      this.currentUser.set(null);
    }
  }

  private saveUsersToStorage() {
     if (this.isLocalStorageAvailable()) {
        try {
          localStorage.setItem(this.userStorageKey, JSON.stringify(this.users()));
        } catch (e) {
          console.error('Error writing users to localStorage', e);
        }
      }
  }

  async register(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => { // Simulate network delay
        const existingUser = this.users().find(u => u.email === email);
        if (existingUser) {
          reject(new Error('An account with this email already exists.'));
          return;
        }

        const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const role = email.toLowerCase() === 'admin@solesearcher.com' ? 'ADMIN' : 'USER';
        const newUser: StoredUser = { id, email, passwordHash: password, role }; // In real app, hash password
        this.users.update(users => [...users, newUser]);
        this.saveUsersToStorage();
        
        const sessionUser: User = { id, email, role };
        this.currentUser.set(sessionUser);
        resolve(sessionUser);
      }, 500);
    });
  }

  async login(email: string, password: string): Promise<User> {
     return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            const user = this.users().find(u => u.email === email);
            if (!user || user.passwordHash !== password) { // In real app, compare hashed passwords
                reject(new Error('Invalid email or password.'));
                return;
            }
            
            const role = email.toLowerCase() === 'admin@solesearcher.com' ? 'ADMIN' : 'USER';
            const sessionUser: User = { id: user.id, email: user.email, role: user.role };
            this.currentUser.set(sessionUser);
            resolve(sessionUser);
        }, 500);
     });
  }

  logout() {
    this.currentUser.set(null);
  }
}