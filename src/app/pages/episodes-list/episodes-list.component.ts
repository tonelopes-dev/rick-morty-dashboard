// src/app/pages/episodes-list/episodes-list.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { Episode } from '../../types/episode';
import { CharacterAvatar } from '@app/types/character';

@Component({
  selector: 'app-episodes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './episodes-list.component.html',
  styleUrls: ['./episodes-list.component.scss'],
})
export class EpisodesListComponent implements OnInit {
  private rickMortyService = inject(RickMortyService);
  episodes: Episode[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadAllEpisodes();
  }

  loadAllEpisodes() {
    this.rickMortyService.getAllEpisodes().subscribe({
      next: (allEpisodes) => {
        this.episodes = allEpisodes;
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
        name: `Character #${id}`, // Adicione nome se quiser tooltips
      };
    });
  }

  private extractCharacterId(url: string): number {
    const matches = url.match(/\/(\d+)$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }
}
