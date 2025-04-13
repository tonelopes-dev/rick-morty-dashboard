// header.component.ts
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  private searchService = inject(SearchService);
  searchTerm = '';

  isListPage(): boolean {
    return (
      this.router.url.includes('/characters') ||
      this.router.url.includes('/episodes')
    );
  }

  onSearch(inputValue: string) {
    this.searchService.setSearchTerm(inputValue);
  }
}
