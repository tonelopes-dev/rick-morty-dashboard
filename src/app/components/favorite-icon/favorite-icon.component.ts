import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-favorite-icon',
  standalone: true,
  templateUrl: './favorite-icon.component.html',
  styleUrls: ['./favorite-icon.component.scss']
})
export class FavoriteIconComponent {
  @Input() isFavorite: boolean = false;
}
