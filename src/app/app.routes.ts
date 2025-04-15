import { Routes } from '@angular/router';
import { CharacterDetailComponent } from './pages/character-detail/character-detail.component';
import { EpisodeDetailComponent } from './pages/episode-detail/episode-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./pages/characters-list/characters-list.component').then(
        (m) => m.CharactersListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'episodes',
    loadComponent: () =>
      import('./pages/episodes-list/episodes-list.component').then(
        (m) => m.EpisodesListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'character/:id',
    component: CharacterDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'episode/:id',
    component: EpisodeDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/characters',
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '/characters' },
];
