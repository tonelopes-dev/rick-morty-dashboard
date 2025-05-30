import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { environment } from 'environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    const video = this.bgVideo.nativeElement;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch((error: Error) => {
        document.addEventListener('click', () => video.play(), { once: true });
      });
    }
  }
  apiUrl: string = environment.apiUrl;
  username: string = '';
  password: string = '';
  selectedAvatar: string = `${this.apiUrl}/character/avatar/1.jpeg`;
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage = null;

    if (!this.username.trim()) {
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
