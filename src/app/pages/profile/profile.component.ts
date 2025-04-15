import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterCardComponent } from '@app/components/character-card/character-card.component';
import { FavoritesService } from '@app/services/favorites.service';
import { Character } from '@app/types/character';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, CharacterCardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  username: string | null = null;
  userAvatar: string | null = null;
  favoritesService = inject(FavoritesService);
  favoriteCharacters: Character[] = [];

  constructor(private authService: AuthService) {
    const authData = this.authService.getAuthData();
    this.username = authData?.username || null;
    this.userAvatar = authData?.avatar || null;
    this.loadFavorites();
  }

  private loadFavorites(): void {
    if (this.username) {
      this.favoriteCharacters = this.favoritesService.getFavorites(this.username);
    }
  }

  onFavoriteRemoved(characterId: number): void {
    if (this.username) {
      this.favoritesService.removeFavorite(this.username, characterId);
      this.loadFavorites();
    }
  }
}
