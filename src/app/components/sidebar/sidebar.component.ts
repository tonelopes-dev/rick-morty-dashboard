import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/services/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  username: string = '';
  avatar: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const authData = this.authService.getAuthData();
    if (authData) {
      this.username = authData.username;
      this.avatar = authData.avatar;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
