import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isLoggedIn = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  logout() {
    console.log('Logout clicked');
    this.authService.logout().subscribe(
      () => {
        console.log('Logout successful');
        this.authService.removeToken();
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout error', error);
      }
    );
  }
}
