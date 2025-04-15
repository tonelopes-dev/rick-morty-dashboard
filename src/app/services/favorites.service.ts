import { Injectable } from '@angular/core';
import { Character } from '../types/character';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = environment.storageKey;

  getFavorites(username: string): Character[] {
    const key = `${this.STORAGE_KEY}_${username}`;
    const favorites = localStorage.getItem(key);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(username: string, character: Character): void {
    const favorites = this.getFavorites(username);
    if (!favorites.some((fav) => fav.id === character.id)) {
      favorites.push(character);
      const key = `${this.STORAGE_KEY}_${username}`;
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }

  removeFavorite(username: string, characterId: number): void {
    const favorites = this.getFavorites(username).filter(
      (fav) => fav.id !== characterId
    );
    const key = `${this.STORAGE_KEY}_${username}`;
    localStorage.setItem(key, JSON.stringify(favorites));
  }

  isFavorite(username: string, characterId: number): boolean {
    return this.getFavorites(username).some((fav) => fav.id === characterId);
  }
}
