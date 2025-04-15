import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Character } from '../../types/character';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { RickMortyService } from '../../services/rick-morty.service';
import { HeaderComponent } from '@app/components/header/header.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { CharacterCardComponent } from '@app/components/character-card/character-card.component';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    CharacterCardComponent,
  ],
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
  isLoading = false;
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
        this.searchTerm = term;
        if (term.length > 3) {
          this.errorMessage = null;
          this.filterCharacters(term);
        } else if (term.length === 0) {
          this.resetCharacters();
        } else {
          this.searchTerm = '';
        }
      });
  }

  filterCharacters(term: string) {
    this.isLoading = true;
    this.page = 1; // Resetar para primeira página ao pesquisar
    this.rickMortyService.getCharactersByName(term).subscribe({
      next: (apiResponse) => {
        console.log('API Response - filter:', apiResponse);
        this.characters = apiResponse.results;
        this.totalCharacters = apiResponse.results.length; // Usar apenas os resultados da pesquisa
        this.totalPages = 1; // Pesquisa retorna todos de uma vez
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.characters = [];
          this.totalCharacters = 0;
          this.totalPages = 0;
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
    if (!this.scrollContainer?.nativeElement) return;

    fromEvent(this.scrollContainer.nativeElement, 'scroll')
      .pipe(debounceTime(100), takeUntil(this._unsubscribe$))
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
    this.totalCharacters = null;
    this.totalPages = null;
    this.errorMessage = null;
    this.loadMoreCharacters();
  }

  loadMoreCharacters() {
    if (
      this.isLoading ||
      this.searchTerm.length > 3 ||
      (this.totalPages !== null && this.page >= this.totalPages)
    ) {
      return;
    }

    this.isLoading = true;
    this.rickMortyService.getCharacters(this.page).subscribe({
      next: (apiResponse) => {
        console.log('API Response - loadMore:', apiResponse);
        this.characters = [...this.characters, ...apiResponse.results];
        this.totalCharacters = apiResponse.info.count;
        this.totalPages = apiResponse.info.pages;

        // Só incrementa se não tiver atingido o total de páginas
        if (this.page < apiResponse.info.pages) {
          this.page++;
        }

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
