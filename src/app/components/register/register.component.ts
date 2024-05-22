import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
    };
    this.authService.register(data).subscribe(
      (response) => {
        this.router.navigate(['/login']);
      },
      (error) => {
        if (error.status === 401) {
          this.errorMessage =
            'This email is already registered. Please use a different email.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
        console.error('Registration error', error);
      }
    );
  }
}
