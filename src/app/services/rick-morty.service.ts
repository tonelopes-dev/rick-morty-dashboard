import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../types/common';
import { Character } from '../types/character';
import { Episode, EpisodeApiResponse } from '../types/episode';
import { expand, EMPTY, reduce, map, Observable } from 'rxjs';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class RickMortyService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Characters
  getCharacters(page: number) {
    return this.http.get<ApiResponse<Character>>(
      `${this.apiUrl}/character?page=${page}`
    );
  }

  getCharactersByName(name: string) {
    return this.http.get<ApiResponse<Character>>(
      `${this.apiUrl}/character?name=${name}`
    );
  }

  getCharacter(id: number) {
    return this.http.get<Character>(`${this.apiUrl}/character/${id}`);
  }

  // Episodes
  getEpisodes(page: number): Observable<EpisodeApiResponse> {
    return this.http.get<EpisodeApiResponse>(
      `${this.apiUrl}/episode?page=${page}`
    );
  }


  getEpisode(id: number) {
    return this.http.get<Episode>(`${this.apiUrl}/episode/${id}`);
  }
}
