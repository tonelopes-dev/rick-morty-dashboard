import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../types/common';
import { Character } from '../types/character';
import { Episode } from '../types/episode';
import { expand, EMPTY, reduce } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  // Métodos para Characters
  getAllCharacters() {
    return this.http
      .get<ApiResponse<Character>>(`${this.apiUrl}/character`)
      .pipe(
        expand((res) =>
          res.info.next
            ? this.http.get<ApiResponse<Character>>(res.info.next)
            : EMPTY
        ),
        reduce((acc, res) => acc.concat(res.results), [] as Character[])
      );
  }

  getCharacter(id: number) {
    return this.http.get<Character>(`${this.apiUrl}/character/${id}`);
  }

  // rick-morty.service.ts
  getMultipleCharacters(ids: number[]) {
    return this.http.get<Character[]>(
      `${this.apiUrl}/character/${ids.join(',')}`
    );
  }

  // Métodos para Episodes
  getEpisodes(page: number = 1) {
    return this.http.get<ApiResponse<Episode>>(
      `${this.apiUrl}/episode?page=${page}`
    );
  }

  getAllEpisodes() {
    return this.http.get<ApiResponse<Episode>>(`${this.apiUrl}/episode`).pipe(
      expand((res) =>
        res.info.next
          ? this.http.get<ApiResponse<Episode>>(res.info.next)
          : EMPTY
      ),
      reduce((acc, res) => acc.concat(res.results), [] as Episode[])
    );
  }

  getEpisode(id: number) {
    return this.http.get<Episode>(`${this.apiUrl}/episode/${id}`);
  }
}
