import { Component } from '@angular/core';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  username: string | null = null;
  userAvatar: string | null = null;

  constructor(private authService: AuthService) {
    const authData = this.authService.getAuthData();
    this.username = authData?.username || null;
    this.userAvatar = authData?.avatar || null;
  }
}
