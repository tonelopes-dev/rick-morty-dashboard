import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { Episode } from '../../types/episode';
import { CharacterAvatar } from '@app/types/character';
import { SearchService } from '../../services/search.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-episodes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.scss'],
})
export class EpisodesListComponent implements OnInit, OnDestroy {
  private rickMortyService = inject(RickMortyService);
  private searchService = inject(SearchService);
  private _unsubscribe$ = new Subject<void>();

  episodes: Episode[] = [];
  filteredEpisodes: Episode[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  page: number = 1;
  totalPages: number | null = null;

  ngOnInit() {
    this.loadAllEpisodes();

    this.searchService
      .getSearchTerm()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((term) => {
        this.filterEpisodes(term);
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  loadAllEpisodes() {
    this.rickMortyService.getEpisodes(this.page).subscribe({
      next: (allEpisodes) => {
        this.episodes = [...this.episodes, ...allEpisodes.results];
        this.filteredEpisodes = [...this.episodes]; // já mostra todos
        this.totalPages = allEpisodes.info.pages;
        this.page = this.totalPages > this.page ? this.page + 1 : this.page;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load episodes';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  filterEpisodes(term: string) {
    if (!term) {
      this.filteredEpisodes = [...this.episodes];
      return;
    }

    this.filteredEpisodes = this.episodes.filter((episode) =>
      episode.name.toLowerCase().includes(term.toLowerCase())
    );
  }

  getCharacterAvatars(episode: Episode): CharacterAvatar[] {
    return episode.characters.slice(0, 5).map((characterUrl) => {
      const id = this.extractCharacterId(characterUrl);
      return {
        id,
        image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
        name: `Character #${id}`,
      };
    });
  }

  private extractCharacterId(url: string): number {
    const matches = url.match(/\/(\d+)$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }
}
