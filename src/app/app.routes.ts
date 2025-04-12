import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'characters',
    loadComponent: () =>
      import('./pages/characters-list/characters-list.component').then(
        (m) => m.CharactersListComponent
      ),
  },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./pages/episodes-list/episodes-list.component').then(
        (m) => m.EpisodesListComponent
      ),
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./pages/detail/detail.component').then((m) => m.DetailComponent),
  },
  { path: '', redirectTo: '/characters', pathMatch: 'full' },
];
