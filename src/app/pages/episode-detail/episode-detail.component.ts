import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RickMortyService } from '@app/services/rick-morty.service';
import { Character, CharacterAvatar } from '@app/types/character';
import { Episode } from '@app/types/episode';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.scss',
})
export class EpisodeDetailComponent {
  episode!: Episode;
  characters: Character[] = [];

  constructor(
    private route: ActivatedRoute,
    private rickMortyService: RickMortyService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.rickMortyService.getEpisode(+id).subscribe((ep) => {
          this.episode = ep;
        });
      }
    });
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
