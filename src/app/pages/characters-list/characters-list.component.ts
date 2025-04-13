import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { Character } from '../../types/character';
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent implements OnInit, OnDestroy {
  private rickMortyService = inject(RickMortyService);
  private searchService = inject(SearchService);
  private _unsubscribe$ = new Subject<void>();

  characters: Character[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  searchTerm: string = '';
  page: number = 1;
  totalPages: number | null = null;

  ngOnInit() {
    this.loadAllCharacters();
    this.listenerSearchTerm();
    this.searchService.getSearchTerm();
  }

  listenerSearchTerm() {
    this.searchService
      .getSearchTerm()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((term) => {
        if (term.length > 3) {
          this.searchTerm = term;
          this.filterCharacters(term);
        } else {
          this.searchTerm = '';
        }
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  loadAllCharacters() {
    this.rickMortyService.getCharacters(this.page).subscribe({
      next: (apiResponse) => {
        this.characters = [...this.characters, ...apiResponse.results];
        this.totalPages = apiResponse.info.pages;
        this.page = this.totalPages > this.page ? this.page + 1 : this.page;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load characters. Please try again later.';
        this.isLoading = false;
        console.error('Error:', err);
      },
    });
  }

  filterCharacters(term: string) {
    this.rickMortyService.getCharactersByName(term).subscribe({
      next: (apiResponse) => {
        this.characters = apiResponse.results;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load characters. Please try again later.';
        this.isLoading = false;
        console.error('Error:', err);
      },
    });
  }

  onScroll() {
    if (this.totalPages === this.page || this.searchTerm) return;
    this.loadAllCharacters();
  }
}
