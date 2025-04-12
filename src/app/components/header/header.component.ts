// header.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  searchTerm = '';

  isListPage(): boolean {
    return this.router.url.includes('/characters') ||
           this.router.url.includes('/episodes');
  }

  onSearch() {
    // Implementaremos a lógica de busca posteriormente
  }
}
