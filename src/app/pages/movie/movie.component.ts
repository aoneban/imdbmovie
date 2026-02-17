import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CastService } from '../../services/cast.service';
import {
  CastMember,
  MovieCast,
  SingleMovie,
  ImagesResponse,
  Genre,
} from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ActorsComponent } from './actors/actors.component';
import { AsideComponent } from './aside/aside.component';
import { RatingComponent } from './rating/rating.component';

@Component({
  selector: 'movie',
  imports: [
    CommonModule,
    NavbarComponent,
    ActorsComponent,
    AsideComponent,
    RatingComponent,
    RouterModule,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <app-navbar></app-navbar>
    <div *ngIf="isLoading" class="preloader">
      <div class="loader"></div>
    </div>
    <section *ngIf="!isLoading" class="inner__content new__index">
      <div
        [ngStyle]="{ 'background-image': backgroundImage() }"
        class="background-movie">
        <div class="background-shadow"></div>
        <div class="content-movie">
          <img
            decoding="auto"
            *ngIf="!loadedImages.has(movieData()!.id)"
            class="!w-[20%] !h-[200%] m-5 bg-gray-800"
            src="/placeholder.svg"
            alt="placeholder" />
          <img
            decoding="auto"
            class="main-poster transition-opacity duration-700"
            (load)="onImageLoad(movieData()!.id)"
            [class.hidden]="!loadedImages.has(movieData()!.id)"
            [src]="startUrl + (movieData()?.poster_path || '')"
            [alt]="movieData()?.title || ''" />
          <div class="text-content">
            <h1 class="text-4xl font-bold text-white-900 mb-1">
              {{ movieData()?.title }} ({{
                movieData()?.release_date?.slice(0, 4)
                  ? movieData()?.release_date?.slice(0, 4)
                  : '----'
              }})
            </h1>
            <p class="text-gray-300 mb-3">
              {{ formatDate(movieData()?.release_date) }} ●
              {{ getGenres(movieData()?.genres) }} ●
              {{ minutesToTime(movieData()?.runtime) }}
            </p>
            <app-rating [rat]="movieData()"></app-rating>

            <h3 class="italic text-gray-300">{{ movieData()?.tagline }}</h3>

            <h4 class="text-xl text-white-900 mb-2 mt-2">Overview</h4>
            <p class="w-[80%]">
              {{
                movieData()?.overview
                  ? movieData()?.overview
                  : 'Description will be added soon...'
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="w-[80%] mx-auto flex">
      <div class="w-4/5 mx-auto flex flex-col">
        <app-actors
          *ngIf="movieData() && loadedImages.has(movieData()!.id)"
          [cast]="movieCast()"
          [id]="movieId"
          class="md:flex-row">
        </app-actors>
        <div
          class="w-[100%] flex gap-5 mx-auto mb-6 pb-8 border-b border-gray-300">
          <button
            *ngIf="movieData() && loadedImages.has(movieData()!.id)"
            [routerLink]="['/cast', movieAllTeam()?.id]"
            class="w-fit whitespace-nowrap">
            Full Cast & Crew
          </button>
        </div>
        <div *ngIf="movieData() && loadedImages.has(movieData()!.id)">
          <h3 class="text-2xl font-semibold text-gray-900 mb-4">Social</h3>
        </div>
      </div>
      <app-aside
        *ngIf="movieData() && loadedImages.has(movieData()!.id)"
        [props]="movieData()"
        class="w-1/5 md:flex-row flex items-center"></app-aside>
    </section>
  `,
  styles: ``,
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
  loadedImages = new Set<number>();
  text: string | undefined;

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
    }, 500);
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

  onImageLoad(id: number) {
    this.loadedImages.add(id);
  }

  getGenres(item: Genre[] | undefined) {
    if (item) {
      const genres = item.map(el => ' ' + el.name);
      return genres;
    } else {
      return 'Genres Unknown';
    }
  }

  minutesToTime(totalMinutes: number | undefined): string {
    if (totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const hh = hours.toString().padStart(2, '0');
      const mm = minutes.toString().padStart(2, '0');
      return `${hh}h ${mm}m`;
    } else {
      return 'Time unknown';
    }
  }

  formatDate(dateStr: string | undefined): string {
    if (dateStr) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } else {
      return 'Date unknown'
    }
  }
}
