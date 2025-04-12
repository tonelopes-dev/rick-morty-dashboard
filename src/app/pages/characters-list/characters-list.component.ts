import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { Character } from '../../types/character';

@Component({
  selector: 'app-characters-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './characters-list.component.html',
  styleUrls: ['./characters-list.component.scss'],
})
export class CharactersListComponent implements OnInit {
  private rickMortyService = inject(RickMortyService);
  characters: Character[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadAllCharacters();
  }

  loadAllCharacters() {
    this.rickMortyService.getAllCharacters().subscribe({
      next: (allCharacters) => {
        this.characters = allCharacters;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage =
          'Failed to load characters. Please try again later.';
        this.isLoading = false;
        console.error('Error:', err);
      },
    });
  }
}
