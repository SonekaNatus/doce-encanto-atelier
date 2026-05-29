import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private router = inject(Router);
  private authService = inject(AuthService);

  isLogin = signal(true);
  loading = signal(false);
  errorMsg = signal('');

  name = '';
  email = '';
  password = '';

  ngOnInit() {
    // Se já estiver logado, vai direto para /usuario
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/usuario']);
    }
  }

  toggleMode() {
    this.isLogin.set(!this.isLogin());
    this.errorMsg.set('');
    this.name = '';
    this.email = '';
    this.password = '';
  }

  isValidEmail(email: string): boolean {
    // Regex padrão de validação de email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  onSubmit() {
    this.errorMsg.set('');

    if (this.isLogin()) {
      if (!this.email || !this.password) {
        this.errorMsg.set('Preencha todos os campos.');
        return;
      }
      if (!this.isValidEmail(this.email)) {
        this.errorMsg.set('Informe um e-mail válido.');
        return;
      }
      this.loading.set(true);
      this.authService.login(this.email, this.password).subscribe({
        next: user => {
          this.loading.set(false);
          if (user) {
            this.router.navigate(['/usuario']);
          } else {
            this.errorMsg.set('E-mail ou senha incorretos.');
          }
        },
        error: () => {
          this.loading.set(false);
          this.errorMsg.set('Erro ao conectar. Verifique se o servidor está rodando.');
        }
      });
    } else {
      if (!this.name || !this.email || !this.password) {
        this.errorMsg.set('Preencha todos os campos.');
        return;
      }
      if (!this.isValidEmail(this.email)) {
        this.errorMsg.set('Informe um e-mail válido (ex: nome@exemplo.com).');
        return;
      }
      if (this.password.length < 4) {
        this.errorMsg.set('A senha deve ter no mínimo 4 caracteres.');
        return;
      }
      this.loading.set(true);
      this.authService.register(this.name, this.email, this.password).subscribe({
        next: result => {
          this.loading.set(false);
          if (result.success) {
            this.router.navigate(['/usuario']);
          } else {
            this.errorMsg.set(result.message);
          }
        },
        error: () => {
          this.loading.set(false);
          this.errorMsg.set('Erro ao conectar. Verifique se o servidor está rodando.');
        }
      });
    }
  }
}
