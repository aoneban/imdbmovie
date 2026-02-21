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
    path: 'tv/:id',
    loadComponent: () =>
      import('./pages/movie/movie.component').then(m => m.MovieComponent),
  },
  {
    path: 'persons/:id',
    loadComponent: () =>
      import('./pages/persons/persons.component').then(m => m.PersonsComponent),
  },
  {
    path: 'cast/:id',
    loadComponent: () =>
      import('./pages/movie/all-actors/all-actors.component').then(
        m => m.AllActorsComponent
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search.component').then(m => m.SearchComponent),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    data: {
      url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=',
      name: 'Popular Movies',
      type: 'movie'
    },
  },
  {
    path: 'top-rated',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    data: {
      url: 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=',
      name: 'Top Rated Movies',
      type: 'movie'
    },
  },
  {
    path: 'upcoming',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    data: {
      url: 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=',
      name: 'Upcoming Movies',
      type: 'movie'
    },
  },
  {
    path: 'now-playing',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    data: {
      url: 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=',
      name: 'Now Playing Movies',
      type: 'movie'
    },
  },
  {
    path: 'tv-top-rated',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    data: {
      url: 'https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=',
      name: 'Top Rated TV',
      type: 'tv'
    },
  },
  {
    path: 'airing-today',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    data: {
      url: 'https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=',
      name: 'Airing Today',
      type: 'tv'
    },
  },
    {
    path: 'tv-popular',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    data: {
      url: 'https://api.themoviedb.org/3/tv/popular?language=en-US&page=',
      name: 'Popular TV',
      type: 'tv'
    },
  },
      {
    path: 'on-the-air',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    data: {
      url: 'https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=',
      name: 'On TV',
      type: 'tv'
    },
  },
  {
    path: 'page-persons',
    loadComponent: () =>
      import('./pages/page-persons/page-persons.component').then(
        m => m.PagePersonsComponent
      ),
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
];
