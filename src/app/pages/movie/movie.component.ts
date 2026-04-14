import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import {
  MovieCast,
  SingleMovie,
  ImagesResponse,
  ReviewsResponse,
  ApiResponse,
  Movie,
  CrewMember,
} from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { MediaTypeService } from '../../services/media-type.service';
import { TMDB } from '../../config/tmdb.config';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { HeroBlockComponent } from './block-hero/block-hero.component';
import { MainBlockComponent } from './block-main/block-main.component';
import { ReviewBlockComponent } from './block-review/block-review.component';
import { MovieStoreService } from '../../services/movie-store.service';

@Component({
  selector: 'movie',
  imports: [
    CommonModule,
    NavbarComponent,
    RouterModule,
    HeroBlockComponent,
    MainBlockComponent,
    ReviewBlockComponent,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <app-navbar></app-navbar>
    <section>
      @if (!isLoading()) {
        <div class="preloader">
          <div class="loader"></div>
        </div>
      } @else {
        <main>
          <!--Hero block start-->
          <section>
            <app-hero-block
              [movieData]="movieData()"
              [movieCrew]="movieCrew()"
              [url]="startUrl"
              [backgroundImage]="backgroundImage()"
              (loadMoreClick)="onImageLoad(movieData()!.id)"
              [loadedImages]="loadedImages()"></app-hero-block>
          </section>
          <!--Hero block end-->

          <!--Main block start-->
          <section>
            <app-main-block
              [movieData]="movieData()"
              [movieId]="movieId()"
              [dataReview]="dataReview()"
              [movieCast]="movieCast()"
              [movieAllTeam]="movieAllTeam()"
              [loadedImages]="loadedImages()"
              [dataReviewResponse]="dataReviewResponse()"></app-main-block>
          </section>
          <!--Main block end-->

          <!--Review block start-->
          <section>
            <app-review-block
              [startUrl]="startUrl"
              [dataReview]="dataReview()"
              [movieData]="movieData()"
              [similarMovies]="similarMovies()"></app-review-block>
          </section>
          <!--Review block start-->
        </main>
      }
    </section>
  `,
  styles: ``,
})
export class MovieComponent {
  route = inject(ActivatedRoute);
  startUrl = TMDB.imageBaseUrl;
  secondUrl = TMDB.imageBigUrl;
  movieData = signal<SingleMovie | undefined>(undefined);
  similarMovies = signal<Movie[]>([]);
  movieDataImg = signal<ImagesResponse | undefined>(undefined);
  movieAllTeam = signal<MovieCast | undefined>(undefined);
  dataReviewResponse = signal<ReviewsResponse | undefined>(undefined);
  loadedImages = signal<Set<number>>(new Set());
  movieId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id'))))
  );

  constructor(
    private movieService: MovieService,
    private mediaTypeService: MediaTypeService,
    private movieStoreService: MovieStoreService
  ) {
    effect(() => {
      const type = this.mediaTypeService.getMediaType();
      const apiOne = type === 'movie' ? TMDB.apiBaseMovie : TMDB.apiBaseTV;
      this.movieService
        .getDataMovie<SingleMovie>(apiOne, TMDB.apiLanguage, this.movieId()!)
        .subscribe(
          data => {
            this.movieData.set(data);
            this.movieStoreService.movieData.set(this.movieData());
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
      this.movieService
        .getDataMovie<ReviewsResponse>(apiOne, TMDB.apiReviews, this.movieId()!)
        .subscribe(
          data => {
            this.dataReviewResponse.set(data);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
      this.movieService
        .getDataMovie<MovieCast>(apiOne, TMDB.apiCredits, this.movieId()!)
        .subscribe(
          data => {
            this.movieAllTeam.set(data);
            this.movieStoreService.movieAllTeam.set(this.movieAllTeam());
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
      this.movieService
        .getDataMovie<ApiResponse>(apiOne, TMDB.apiRecommend, this.movieId()!)
        .subscribe(
          data => {
            this.similarMovies.set(data.results);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
      this.movieService.getDataImage(apiOne, this.movieId()!).subscribe(
        data => {
          this.movieDataImg.set(data);
        },
        error => {
          console.error('Error fetching data: ', error);
        }
      );
    });
  }

  backgroundImage = computed(() => {
    const imgData = this.movieDataImg();
    if (imgData && imgData.backdrops && imgData.backdrops.length > 1) {
      return `url(${this.secondUrl}${imgData.backdrops[2].file_path})`;
    }
    return '';
  });

  movieCast = computed(() => {
    const amountOfActors = 20;
    return this.movieAllTeam()?.cast.filter((_, i) => i < amountOfActors);
  });

  movieCrew = computed<CrewMember[] | undefined>(
    (): CrewMember[] | undefined => {
      const amountOfDirection = 3;
      return this.movieAllTeam()?.crew.filter((_, i) => i < amountOfDirection);
    }
  );

  dataReview = computed(() => {
    const len = this.dataReviewResponse()?.results.length as number;
    const random = Math.floor(Math.random() * len) as number;
    return this.dataReviewResponse()?.results[random];
  });

  isLoading = computed(() => this.movieData());

  onImageLoad(id: number): void {
    this.loadedImages.update(set => new Set([...set, id]));
  }
}
