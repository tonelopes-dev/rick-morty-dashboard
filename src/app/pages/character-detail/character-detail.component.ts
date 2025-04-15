import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RickMortyService } from '@app/services/rick-morty.service';
import { Character } from '@app/types/character';
import { Location } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [],
  templateUrl: './character-detail.component.html',
  styleUrl: './character-detail.component.scss',
})
export class CharacterDetailComponent {
  character!: Character;

  constructor(
    private route: ActivatedRoute,
    private rickMortyService: RickMortyService,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.rickMortyService.getCharacter(+id).subscribe((char) => {
          this.character = char;
        });
      }
    });
  }
  goBack() {
    this.location.back();
  }
}
