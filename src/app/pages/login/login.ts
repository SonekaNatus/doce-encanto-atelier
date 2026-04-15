import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isLogin = signal(true);

  constructor(private router: Router) {}

  toggleMode() {
    this.isLogin.set(!this.isLogin());
  }

  onSubmit(event: Event) {
    event.preventDefault();
    // Simulate login or register request
    setTimeout(() => {
      this.router.navigate(['/success']);
    }, 600);
  }
}
