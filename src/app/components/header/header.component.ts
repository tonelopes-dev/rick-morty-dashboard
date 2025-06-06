import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private searchService = inject(SearchService);
  private _unsubscribe$ = new Subject<void>();

  searchTerm: string = '';
  ngOnInit() {
    this.searchService
      .getSearchTerm()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((term) => {
        this.searchTerm = term;
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

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
