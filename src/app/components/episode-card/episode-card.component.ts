import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Episode } from '@app/types/episode';
import { Character } from '@app/types/character';

@Component({
  selector: 'app-episode-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './episode-card.component.html',
  styleUrls: ['./episode-card.component.scss']
})
export class EpisodeCardComponent {
  @Input() episode!: Episode;

  getCharacterAvatars(episode: Episode): Character[] {
    // Mock implementation - in a real app this would fetch character data
    return episode.characters.slice(0, 5).map(url => {
      const id = parseInt(url.split('/').pop() || '1');
      return {
        id,
        name: `Character ${id}`,
        image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`
      } as Character;
    });
  }
}
