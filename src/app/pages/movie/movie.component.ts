import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MovieService } from '../../services/movie.service';
import { SingleMovie } from '../../interfaces/interface';
import { CastService } from '../../services/cast.service';
import { MovieCast } from '../../interfaces/interface';

@Component({
  selector: 'movie',
  imports: [HeaderComponent],
  template: `
    <app-header></app-header>
    ./movie.component.html-works {{ movieId }}'
  `,
  styles: ``,
})
export class MovieComponent implements OnInit {
  movieId: number | undefined;
  movieData: SingleMovie | undefined;
  movieCast: MovieCast | undefined;

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
        this.movieData = data;
        console.log('Movie data: ', this.movieData);
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
  fetchCast(id: number): void {
    this.castService.getDataCast(id).subscribe(
      data => {
        this.movieCast = data;
        console.log('Data Cast: ', this.movieCast);
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}
