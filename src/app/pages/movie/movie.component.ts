import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MovieService } from '../../services/movie.service';
import { SingleMovie } from '../../interfaces/interface';
import { CastService } from '../../services/cast.service';
import { MovieCast } from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'movie',
  imports: [HeaderComponent, CommonModule, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header></app-header>
    <app-navbar></app-navbar>
    <section class="inner__content new__index">
      <div
        [ngStyle]="{
          'background-image':
            'url(' + startUrl + movieData()?.poster_path + ')',
        }"
        class="background-movie"></div>
    </section>
    <!-- <img
      decoding="async"
      class="image"
      [src]="startUrl + (movieData()?.poster_path || '')"
      [alt]="movieData()?.title || ''" /> -->
  `,
  styles: ``,
})
export class MovieComponent implements OnInit {
  startUrl = 'https://image.tmdb.org/t/p/w500/';
  movieId: number | undefined;
  movieData = signal<SingleMovie | undefined>(undefined);
  movieCast = signal<MovieCast | undefined>(undefined);

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private castService: CastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.movieId = id ? Number(id) : undefined;
      if (this.movieId !== undefined) {
        this.fetchCast(this.movieId);
        this.fetchData(this.movieId);
      }
    });
  }

  fetchData(id: number): void {
    this.movieService.getDataMovie(id).subscribe(
      data => {
        this.movieData.set(data);
        console.log('Movie data: ', this.movieData());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
  fetchCast(id: number): void {
    this.castService.getDataCast(id).subscribe(
      data => {
        this.movieCast.set(data);
        console.log('Data Cast: ', this.movieCast());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}
