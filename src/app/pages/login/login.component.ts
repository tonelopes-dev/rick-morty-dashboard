import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  selectedAvatar: string = 'https://rickandmortyapi.com/api/character/avatar/1.jpeg';
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage = null;

    if (!this.username) {
      this.errorMessage = 'Username é obrigatório';
      return;
    }

    if (!this.selectedAvatar) {
      this.errorMessage = 'Por favor selecione um avatar';
      return;
    }

    this.authService.login(this.username, this.selectedAvatar);
  }
}
