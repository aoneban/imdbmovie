import { Injectable, signal } from '@angular/core';
import { MovieCast, SingleMovie } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class MovieStoreService {
  movieData = signal<SingleMovie | undefined>(undefined);
  movieAllTeam = signal<MovieCast | undefined>(undefined);
}
