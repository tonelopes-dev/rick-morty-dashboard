import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { Character } from '../../types/character';
import { SearchService } from '../../services/search.service';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { HeaderComponent } from '@app/components/header/header.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent implements OnInit, OnDestroy {
  private rickMortyService = inject(RickMortyService);
  private searchService = inject(SearchService);
  private _unsubscribe$ = new Subject<void>();

  @ViewChild('scrollContainerCharacters', { static: true })
  scrollContainer!: ElementRef;

  characters: Character[] = [];
  totalCharacters: number | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  searchTerm: string = '';
  page: number = 1;
  totalPages: number | null = null;

  ngOnInit() {
    this.loadMoreCharacters();
    this.listenerSearchTerm();
    this.initScrollListener();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  listenerSearchTerm() {
    this.searchService
      .getSearchTerm()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((term) => {
        if (term.length > 3) {
          this.searchTerm = term;
          this.filterCharacters(term);
        } else if (term.length === 0) {
          this.searchTerm = '';
          this.resetCharacters();
        }
      });
  }

  filterCharacters(term: string) {
    this.isLoading = true;
    this.rickMortyService.getCharactersByName(term).subscribe({
      next: (apiResponse) => {
        this.characters = apiResponse.results;
        this.totalCharacters = apiResponse.info.count;
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.characters = [];
          this.totalCharacters = 0;
          this.errorMessage = `No characters found for: "${term}"`;
        } else {
          this.errorMessage =
            'Failed to load characters. Please try again later.';
        }
        this.isLoading = false;
        console.error('Error:', err);
      },
    });
  }

  initScrollListener() {
    fromEvent(this.scrollContainer.nativeElement, 'scroll')
      .pipe(debounceTime(200), takeUntil(this._unsubscribe$))
      .subscribe(() => {
        const container = this.scrollContainer.nativeElement;
        const bottom = container.scrollTop + container.clientHeight;
        const height = container.scrollHeight;

        if (bottom >= height - 50) {
          this.loadMoreCharacters();
        }
      });
  }

  resetCharacters() {
    this.page = 1;
    this.characters = [];
    this.errorMessage = null;
    this.loadMoreCharacters();
  }

  loadMoreCharacters() {
    this.isLoading = true;
    this.rickMortyService.getCharacters(this.page + 1).subscribe({
      next: (apiResponse) => {
        this.characters = [...this.characters, ...apiResponse.results];
        this.totalPages = apiResponse.info.pages;
        this.page++;
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
}
