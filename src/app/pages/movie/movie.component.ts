import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { MovieService } from '../../services/movie.service';
import { SingleMovie, ImagesResponse } from '../../interfaces/interface';
import { CastService } from '../../services/cast.service';
import { MovieCast, CastMember } from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'movie',
  imports: [HeaderComponent, CommonModule, NavbarComponent, RouterModule],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <app-header></app-header>
    <app-navbar></app-navbar>
    <section class="inner__content new__index">
      <div
        [ngStyle]="{ 'background-image': backgroundImage() }"
        class="background-movie">
        <div class="background-shadow"></div>
        <div class="content-movie">
          <img
            decoding="async"
            class="main-poster"
            [src]="startUrl + (movieData()?.poster_path || '')"
            [alt]="movieData()?.title || ''" />
          <div class="text-content">
            <h2>Title</h2>
            <p>Description</p>
            <h3>Users marks</h3>
            <h4>Overview</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur
              necessitatibus possimus pariatur culpa! Labore, ea! Ullam velit
              illo ipsam consequatur veniam, placeat, quos quod harum architecto
              commodi quia minima distinctio!
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="average__content new__index-content">
      <div class="content-left">
        <h3 class="trending">Top Billed Cast</h3>
        <div class="movies__wrapper">
          <div class="movies__wrapper-block add">
            <div class="movies__wrapper-cart" *ngFor="let person of newCast">
              <div class="wrapper_img">
                <img
                  decoding="async"
                  [routerLink]="['/persons', person.id]"
                  class="image"
                  src="{{ startUrl + person.profile_path }}"
                  alt="{{ person.name }}" />
              </div>
              <a [routerLink]="['/persons', person.id]">
                <p>{{ person.original_name }}</p>
              </a>
              <a>
                <p>
                  {{ person.character }}
                </p>
              </a>
            </div>
            <button>Add</button>
          </div>
        </div>
      </div>
      <div class="content-right"></div>
    </section>
  `,
  styles: ``,
})
export class MovieComponent implements OnInit {
  startUrl = 'https://image.tmdb.org/t/p/w500';
  startUrl2 = 'https://image.tmdb.org/t/p/w1920';
  movieId: number | undefined;
  movieData = signal<SingleMovie | undefined>(undefined);
  movieDataImg = signal<ImagesResponse | undefined>(undefined);
  movieCast = signal<MovieCast | undefined>(undefined);
  newCast: CastMember[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private castService: CastService
  ) {}

  backgroundImage = computed(() => {
    const imgData = this.movieDataImg();
    if (imgData && imgData.backdrops && imgData.backdrops.length > 1) {
      return `url(${this.startUrl2}${imgData.backdrops[2].file_path})`;
    }
    return 'none';
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.movieId = id ? Number(id) : undefined;
      if (this.movieId !== undefined) {
        this.fetchCast(this.movieId);
        this.fetchData(this.movieId);
        this.fetchDataImages(this.movieId);
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

  fetchDataImages(id: number): void {
    this.movieService.getDataImage(id).subscribe(
      data => {
        this.movieDataImg.set(data);
        console.log('Movie images: ', this.movieDataImg());
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
        this.cutCast(this.movieCast());
        console.log('Data Cast: ', this.movieCast());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

  cutCast(item: MovieCast | undefined): void {
    if (item !== undefined) {
      this.newCast = item.cast.filter((_, ind) => ind < 10);
    }
  }
}
