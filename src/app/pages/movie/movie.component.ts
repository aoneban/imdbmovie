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
import { CastService } from '../../services/cast.service';
import {
  CastMember,
  MovieCast,
  SingleMovie,
  ImagesResponse,
} from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ActorsComponent } from './actors/actors.component';
import { AsideComponent } from './aside/aside.component';

@Component({
  selector: 'movie',
  imports: [
    HeaderComponent,
    CommonModule,
    NavbarComponent,
    ActorsComponent,
    AsideComponent,
    RouterModule,
  ],

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
            <h2>
              {{ movieData()?.title }} ({{
                movieData()?.release_date?.slice(0, 4)
              }})
            </h2>
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
    <section class="add__content">
      <app-actors [cast]="movieCast()" class="actors"></app-actors>
      <app-aside [props]="movieData()"></app-aside>
    </section>
    <section>
      <button [routerLink]="['/cast', movieAllTeam()?.id]">
        Full Cast & Crew
      </button>
    </section>
  `,
  styles: `
    .add__content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1280px;
      margin: 0 auto;
    }
    .actors {
      flex: 70%;
    }
    .aside {
      flex: 30%;
    }
  `,
})
export class MovieComponent implements OnInit {
  startUrl = 'https://image.tmdb.org/t/p/w500';
  startUrl2 = 'https://image.tmdb.org/t/p/w1920';
  movieId: number | undefined;
  movieData = signal<SingleMovie | undefined>(undefined);
  movieDataImg = signal<ImagesResponse | undefined>(undefined);
  movieCast = signal<CastMember[] | undefined>(undefined);
  movieAllTeam = signal<MovieCast | undefined>(undefined);

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
        this.movieCast.set(data.cast.filter((_, i) => i < 15));
        this.movieAllTeam.set(data);
        console.log('Data Cast: ', this.movieAllTeam());
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}
