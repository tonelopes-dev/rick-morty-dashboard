import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { Episode } from '../../types/episode';
import { CharacterAvatar } from '@app/types/character';
import { SearchService } from '../../services/search.service';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { HeaderComponent } from '@app/components/header/header.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';

@Component({
  selector: 'app-episodes-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    NgbTooltipModule,
  ],
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.scss'],
})
export class EpisodesListComponent implements OnInit, OnDestroy {
  private rickMortyService = inject(RickMortyService);
  private searchService = inject(SearchService);
  private _unsubscribe$ = new Subject<void>();

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  episodes: Episode[] = [];
  filteredEpisodes: Episode[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  searchTerm: string = '';
  page: number = 1;
  totalPages: number | null = null;

  ngOnInit() {
    this.loadMoreEpisodes();
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
          this.searchTerm = term;
          this.errorMessage = null;
          this.filterEpisodes(term);
        } else if (term.length === 0) {
          this.searchTerm = '';
          this.resetEpisodes();
          this.errorMessage = null;
        }
      });
  }

  filterEpisodes(term: string) {
    this.isLoading = true;
    this.rickMortyService.getEpisodeByName(term).subscribe({
      next: (apiResponse) => {
        this.episodes = apiResponse.results;
        this.totalPages = apiResponse.info.pages;
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.episodes = [];
          this.totalPages = 0;
          this.errorMessage = `No episodes found for: "${term}"`;
        } else {
          this.errorMessage =
            'Failed to load episodes. Please try again later.';
        }
        this.isLoading = false;
        console.error('Error:', err);
      },
    });
  }

  initScrollListener() {
    fromEvent(this.scrollContainer.nativeElement, 'scroll')
      .pipe(debounceTime(50), takeUntil(this._unsubscribe$))
      .subscribe(() => {
        const container = this.scrollContainer.nativeElement;
        const bottom = container.scrollTop + container.clientHeight;
        const height = container.scrollHeight;

        console.log(bottom, height, this.isLoading, this.totalPages, this.page);
        if (
          bottom >= height - 100 &&
          !this.isLoading &&
          this.totalPages !== null &&
          this.page <= this.totalPages
        ) {
          this.loadMoreEpisodes();
        }
      });
  }

  loadMoreEpisodes() {
    this.isLoading = true;

    if (this.totalPages !== null && this.page > this.totalPages) return;

    this.isLoading = false;

    this.rickMortyService.getEpisodes(this.page).subscribe({
      next: (apiResponse) => {
        this.episodes = [...this.episodes, ...apiResponse.results];
        this.totalPages = apiResponse.info.pages;
        this.page++;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load episodes';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  getCharacterAvatars(episode: Episode): CharacterAvatar[] {
    return episode.characters.slice(0, 5).map((characterUrl) => {
      const id = this.extractCharacterId(characterUrl);
      return {
        id,
        image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
        name: `Character ${id}`,
      };
    });
  }

  resetEpisodes() {
    this.page = 1;
    this.episodes = [];
    this.errorMessage = null;
    this.loadMoreEpisodes();
  }

  private extractCharacterId(url: string): number {
    const matches = url.match(/\/(\d+)$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }
}
