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
import { Episode } from '../../types/episode';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';
import { RickMortyService } from '../../services/rick-morty.service';
import { HeaderComponent } from '@app/components/header/header.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { EpisodeCardComponent } from '@app/components/episode-card/episode-card.component';
import { environment } from 'environment';

@Component({
  selector: 'app-episodes-list',
  standalone: true,
  imports: [RouterModule, HeaderComponent, SidebarComponent, CommonModule, EpisodeCardComponent],
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.scss'],
})
export class EpisodesListComponent implements OnInit, OnDestroy {
  private rickMortyService = inject(RickMortyService);
  private searchService = inject(SearchService);
  private _unsubscribe$ = new Subject<void>();

  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef;

  episodes: Episode[] = [];
  totalEpisodes: number | null = null;
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
          this.errorMessage = null;
          this.filterEpisodes(term);
        } else if (term.length === 0) {
          this.resetEpisodes();
        } else {
          this.searchTerm = '';
        }
      });
  }

  filterEpisodes(term: string) {
    this.isLoading = true;
    this.rickMortyService.getEpisodesByName(term).subscribe({
      next: (apiResponse) => {
        this.episodes = apiResponse.results;
        this.totalEpisodes = apiResponse.info.count;
        this.totalPages = apiResponse.info.pages;
        this.errorMessage = null;
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.episodes = [];
          this.totalEpisodes = 0;
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
    if (!this.scrollContainer?.nativeElement) return;

    fromEvent(this.scrollContainer.nativeElement, 'scroll')
      .pipe(debounceTime(100), takeUntil(this._unsubscribe$))
      .subscribe(() => {
        const container = this.scrollContainer.nativeElement;
        const bottom = container.scrollTop + container.clientHeight;
        const height = container.scrollHeight;

        if (bottom >= height - 50) {
          this.loadMoreEpisodes();
        }
      });
  }

  resetEpisodes() {
    this.page = 1;
    this.episodes = [];
    this.totalEpisodes = null;
    this.totalPages = null;
    this.errorMessage = null;
    this.loadMoreEpisodes();
  }

  loadMoreEpisodes() {
    if (
      this.isLoading ||
      this.searchTerm.length > 3 ||
      (this.totalPages !== null && this.page > this.totalPages)
    ) {
      return;
    }

    this.isLoading = true;
    this.rickMortyService.getEpisodes(this.page).subscribe({
      next: (apiResponse) => {
        this.episodes = [...this.episodes, ...apiResponse.results];
        this.totalEpisodes = apiResponse.info.count;
        this.totalPages = apiResponse.info.pages;
        this.page++;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load episodes. Please try again later.';
        this.isLoading = false;
        console.error('Error:', err);
      },
    });
  }
}
