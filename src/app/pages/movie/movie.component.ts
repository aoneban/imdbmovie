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
  Genre,
  ReviewsResponse,
  ApiResponse,
  Movie,
  CrewMember,
} from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ActorsComponent } from './actors/actors.component';
import { AsideComponent } from './aside/aside.component';
import { RatingComponent } from './rating/rating.component';
import { MediaTypeService } from '../../services/media-type.service';
import { ReviewComponent } from './review/review.component';
import { SimilarMoviesComponent } from './similar-movies/similar-movies.component';
import { TMDB } from '../../config/tmdb.config';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { HeroBlockComponent } from './hero-block/hero-block.component';

@Component({
  selector: 'movie',
  imports: [
    CommonModule,
    NavbarComponent,
    ActorsComponent,
    AsideComponent,
    RouterModule,
    ReviewComponent,
    SimilarMoviesComponent,
    HeroBlockComponent,
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
        <div>
          <!--Hero component start-->
          <app-hero-block
            [movie]="movieData()"
            [crew]="movieCrew()"
            [url]="startUrl"
            [image]="backgroundImage()"
            (loadMoreClick)="onImageLoad(movieData()!.id)"
            [images]="loadedImages()"></app-hero-block>
          <!--Hero component end-->

          <div class="w-[80%] mx-auto flex gap-[5rem]">
            <div class="w-4/5 mx-auto flex flex-col">
              <!--Actors component start-->
              <app-actors
                *ngIf="movieData() && loadedImages().has(movieData()!.id)"
                [cast]="movieCast()"
                [id]="movieId()"
                class="md:flex-row">
              </app-actors>
              <!--Actors component end-->
              <div
                class="w-[100%] flex gap-5 mx-auto mb-6 pb-8 border-b border-gray-300">
                <button
                  *ngIf="movieData() && loadedImages().has(movieData()!.id)"
                  [routerLink]="['/cast', movieAllTeam()?.id]"
                  class="w-fit whitespace-nowrap text-lg duration-300 easy font-bold underline underline-offset-2 hover:text-gray-300">
                  Full Cast & Crew
                </button>
              </div>
              <div *ngIf="movieData() && loadedImages().has(movieData()!.id)">
                <div class="flex mb-4 justify-start items-center gap-[4%]">
                  <h3 class="text-2xl font-semibold text-gray-900">Social</h3>
                  <a
                    *ngIf="dataReviewResponse()?.results?.length"
                    [routerLink]="['/all-reviews', movieData()?.id]"
                    class="duration-200 easy text-xl w-[auto] font-semibold underline underline-offset-2 hover:text-gray-500">
                    Reviews ({{ dataReviewResponse()?.results?.length }})
                  </a>

                  <span
                    *ngIf="!dataReviewResponse()?.results?.length"
                    class="text-xl w-[auto] font-semibold text-gray-400 cursor-not-allowed">
                    Reviews (0)
                  </span>
                </div>
                <!--Reviews component start-->
                @if (dataReview()) {
                  <app-review
                    [review]="dataReview()"
                    [allReviews]="dataReviewResponse()"></app-review>
                } @else {
                  <p>There are no reviews at the moment...</p>
                }
                <!--Reviews component end-->
              </div>
            </div>
            <!--Aside component start-->
            <app-aside
              *ngIf="movieData() && loadedImages().has(movieData()!.id)"
              [props]="movieData()"
              class="w-1/5 md:flex-row flex items-start mt-[3rem] relative">
            </app-aside>
            <!--Aside component end-->
          </div>
          <div *ngIf="dataReview()" class="w-[80%] mx-auto">
            <a
              [routerLink]="['/all-reviews', this.movieData()?.id]"
              class="duration-200 easy underline underline-offset-4 text-blue-400 font-bold hover:text-blue-500"
              >Read all reviews</a
            >
          </div>
          <section>
            <div class="w-[80%] mx-auto">
              <h3 class="text-2xl font-semibold text-gray-900 mt-6">Similar</h3>

              <!--Similar movies component start-->
              <app-similar-movies
                [similar]="similarMovies()"
                [url]="startUrl"></app-similar-movies>
              <!--Similar movies component end-->
            </div>
          </section>
        </div>
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
  text: string | undefined;
  movieId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id'))))
  );

  constructor(
    private movieService: MovieService,
    private mediaTypeService: MediaTypeService
  ) {
    effect(() => {
      const type = this.mediaTypeService.getMediaType();
      const apiOne = type === 'movie' ? TMDB.apiBaseMovie : TMDB.apiBaseTV;
      this.movieService
        .getDataMovie<SingleMovie>(apiOne, TMDB.apiLanguage, this.movieId()!)
        .subscribe(
          data => {
            this.movieData.set(data);
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
    const amountOfActors = 15;
    return this.movieAllTeam()?.cast.filter((_, i) => i < amountOfActors);
  });

  movieCrew = computed<CrewMember[] | undefined>(
    (): CrewMember[] | undefined => {
      const amountOfPersonal = 3;
      return this.movieAllTeam()?.crew.filter((_, i) => i < amountOfPersonal);
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
