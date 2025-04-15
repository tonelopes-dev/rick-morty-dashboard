import { Component } from '@angular/core';
import { Episode } from '@app/types/episode';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CharacterAvatar } from '@app/types/character';
import { RickMortyService } from '@app/services/rick-morty.service';

import { environment } from 'environment';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './episode-detail.component.html',
  styleUrl: './episode-detail.component.scss',
})
export class EpisodeDetailComponent {
  episode!: Episode;
  characters: CharacterAvatar[] = [];

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
          this.characters = this.getCharacterAvatars(ep);
        });
      }
    });
  }

  getCharacterAvatars(episode: Episode): CharacterAvatar[] {
    return episode.characters.map((characterUrl) => {
      const id = this.extractCharacterId(characterUrl);
      return {
        id,
        image: `${environment.apiUrl}/character/avatar/${id}.jpeg`,
        name: characterUrl,
      };
    });
  }
  private extractCharacterId(url: string): number {
    const matches = url.match(/\/(\d+)$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }
}
