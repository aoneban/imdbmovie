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
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'movie',
  imports: [
    HeaderComponent,
    FooterComponent,
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
    <div *ngIf="isLoading" class="preloader">
      <div class="loader"></div>
      <p>Loading...</p>
    </div>
    <section *ngIf="!isLoading" class="inner__content new__index">
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
            <h1 class="text-4xl font-bold text-white-900 mb-4">
              {{ movieData()?.title }} ({{
                movieData()?.release_date?.slice(0, 4)
              }})
            </h1>
            <h3 class="italic text-gray-300">{{ movieData()?.tagline }}</h3>
            <h4 class="text-xl text-white-900 mb-2 mt-2">Overview</h4>
            <p class="w-[80%]">
              {{ movieData()?.overview }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="w-[80%] mx-auto flex">
      <div class="w-4/5 mx-auto flex flex-col">
        <app-actors [cast]="movieCast()" [id]="movieId" class="md:flex-row">
        </app-actors>
        <div
          class="w-[100%] flex gap-5 mx-auto mb-6 pb-8 border-b border-gray-300">
          <button
            [routerLink]="['/cast', movieAllTeam()?.id]"
            class="w-fit whitespace-nowrap">
            Full Cast & Crew
          </button>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Social</h3>
        </div>
      </div>
      <app-aside
        [props]="movieData()"
        class="w-1/5 md:flex-row flex items-center"></app-aside>
    </section>
    <app-footer></app-footer>
  `,
  styles: `
    .preloader {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      padding-bottom: 150px;
    }

    .loader {
      width: 150px;
      aspect-ratio: 1;
      display: grid;
      border: 4px solid #0000;
      border-radius: 150%;
      border-right-color: #8225b0;
      animation: l15 2s infinite linear;
    }
    .loader::before {
      content: '';
      grid-area: 1/1;
      margin: 2px;
      border: inherit;
      border-radius: 100%;
      border-right-color: rgb(231, 102, 177);
      animation: l15 2s infinite;
    }
    .loader::after {
      content: '';
      grid-area: 1/1;
      margin: 2px;
      border: inherit;
      border-radius: 100%;
      border-right-color: rgb(174, 25, 191);
      animation: l15 2s infinite;
    }
    .loader::after {
      margin: 8px;
      animation-duration: 3s;
    }
    @keyframes l15 {
      100% {
        transform: rotate(1turn);
      }
    }

    header,
    main,
    footer {
      display: none;
    }
  `,
})
export class MovieComponent implements OnInit {
  isLoading = false;
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
    this.isLoading = true;
    setTimeout(() => {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.movieId = id ? Number(id) : undefined;
        if (this.movieId !== undefined) {
          this.fetchCast(this.movieId);
          this.fetchData(this.movieId);
          this.fetchDataImages(this.movieId);
        }
      });
    }, 1000);
  }

  fetchData(id: number): void {
    this.movieService.getDataMovie(id).subscribe(
      data => {
        this.movieData.set(data);
        console.log('Movie data: ', this.movieData());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }

  fetchDataImages(id: number): void {
    this.movieService.getDataImage(id).subscribe(
      data => {
        this.movieDataImg.set(data);
        console.log('Movie images: ', this.movieDataImg());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }
  fetchCast(id: number): void {
    this.castService.getDataCast(id).subscribe(
      data => {
        this.movieCast.set(data.cast.filter((_, i) => i < 15));
        this.movieAllTeam.set(data);
        console.log('Data Cast: ', this.movieAllTeam());
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }
}
