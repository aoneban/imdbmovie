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
  {
    path: 'persons/:id',
    loadComponent: () =>
      import('./pages/persons/persons.component').then(m => m.PersonsComponent),
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];
