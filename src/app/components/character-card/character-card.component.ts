import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from '@app/types/character';
import { FavoritesService } from '@app/services/favorites.service';
import { FavoriteIconComponent } from '../favorite-icon/favorite-icon.component';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [ FavoriteIconComponent, RouterLink],
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Input() showFavorite = true;
  @Output() favoriteRemoved = new EventEmitter<number>();

  private authService = inject(AuthService);
  private favoritesService = inject(FavoritesService);

  async toggleFavorite(): Promise<void> {
    const username = this.authService.getAuthData()?.username;
    if (!username) return;

    if (this.favoritesService.isFavorite(username, this.character.id)) {
      const confirmed = confirm(
        'Are you sure you want to remove this character from favorites?'
      );
      if (confirmed) {
        this.favoritesService.removeFavorite(username, this.character.id);
        this.favoriteRemoved.emit(this.character.id);
      }
    } else {
      this.favoritesService.addFavorite(username, this.character);
    }
  }

  isFavorite(): boolean {
    const username = this.authService.getAuthData()?.username;
    return username ? this.favoritesService.isFavorite(username, this.character.id) : false;
  }
}
