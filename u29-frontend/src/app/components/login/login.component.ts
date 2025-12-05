import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // For *ngIf

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  updateUsername(event: any) { this.username = event.target.value; }
  updatePassword(event: any) { this.password = event.target.value; }

  onSubmit(event: Event) {
    event.preventDefault();
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Invalid Credentials';
      }
    });
  }
}
