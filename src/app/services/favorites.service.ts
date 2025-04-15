import { Injectable } from '@angular/core';
import { Character } from '../types/character';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = environment.storageKey;

  getFavorites(): Character[] {
    const favorites = localStorage.getItem(this.STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(character: Character): void {
    const favorites = this.getFavorites();
    if (!favorites.some((fav) => fav.id === character.id)) {
      favorites.push(character);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    }
  }

  removeFavorite(characterId: number): void {
    const favorites = this.getFavorites().filter(
      (fav) => fav.id !== characterId
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  }

  isFavorite(characterId: number): boolean {
    return this.getFavorites().some((fav) => fav.id === characterId);
  }
}
