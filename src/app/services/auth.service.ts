import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap, of, switchMap } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  adm: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  currentUser = signal<User | null>(this.loadFromStorage());

  private loadFromStorage(): User | null {
    try {
      const raw = localStorage.getItem('doce_user');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  private saveToStorage(user: User | null) {
    if (user) localStorage.setItem('doce_user', JSON.stringify(user));
    else localStorage.removeItem('doce_user');
  }

  // Busca só por email e compara senha no cliente — evita problemas com
  // o json-server beta que pode fazer match parcial em query strings
  login(email: string, password: string): Observable<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map(users => {
        const found = users.find(
          u => u.email.trim().toLowerCase() === normalizedEmail && u.password === password
        );
        return found ?? null;
      }),
      tap(user => {
        this.currentUser.set(user);
        this.saveToStorage(user);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      switchMap(users => {
        const exists = users.find(u => u.email.trim().toLowerCase() === normalizedEmail);
        if (exists) {
          return of({ success: false, message: 'Este e-mail já está cadastrado.' });
        }
        const newUser = { name: name.trim(), email: normalizedEmail, password, adm: false };
        return this.http.post<User>(`${this.apiUrl}/users`, newUser).pipe(
          tap(user => {
            this.currentUser.set(user);
            this.saveToStorage(user);
          }),
          map(user => ({ success: true, message: '', user }))
        );
      })
    );
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, data).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.saveToStorage(user);
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    this.saveToStorage(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
