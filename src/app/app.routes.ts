import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main/main.component').then(m => m.MainPageComponent),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie/movie.component').then(m => m.MovieComponent),
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];
