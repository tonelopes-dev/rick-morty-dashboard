import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Character } from '@app/types/character';
import { FavoritesService } from '@app/services/favorites.service';
import { FavoriteIconComponent } from '../favorite-icon/favorite-icon.component';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule, FavoriteIconComponent, RouterLink],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Input() showFavorite = true;
  @Output() favoriteRemoved = new EventEmitter<number>();

  constructor(private favoritesService: FavoritesService) {}

  async toggleFavorite(): Promise<void> {
    if (this.favoritesService.isFavorite(this.character.id)) {
      const confirmed = confirm(
        'Are you sure you want to remove this character from favorites?'
      );
      if (confirmed) {
        this.favoritesService.removeFavorite(this.character.id);
        this.favoriteRemoved.emit(this.character.id);
      }
    } else {
      this.favoritesService.addFavorite(this.character);
    }
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.character.id);
  }
}
