import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CastService } from '../../services/cast.service';
import { CommonService } from '../../services/common.service';
import {
  CastMember,
  CrewMember,
  MovieCast,
  SingleMovie,
  ImagesResponse,
  Genre,
  ReviewItem,
  ReviewsResponse,
} from '../../interfaces/interface';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ActorsComponent } from './actors/actors.component';
import { AsideComponent } from './aside/aside.component';
import { RatingComponent } from './rating/rating.component';
import { MediaTypeService } from '../../services/media-type.service';
import { ReviewComponent } from './review/review.component';

@Component({
  selector: 'movie',
  imports: [
    CommonModule,
    NavbarComponent,
    ActorsComponent,
    AsideComponent,
    RatingComponent,
    RouterModule,
    ReviewComponent,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,

  template: `
    <app-navbar></app-navbar>
    <section>
      <div *ngIf="isLoading" class="preloader">
        <div class="loader"></div>
      </div>
      <div *ngIf="!isLoading" class="inner__content new__index">
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
              class="main-poster transition-opacity duration-700 h-[29vw]"
              (load)="onImageLoad(movieData()!.id)"
              [class.hidden]="!loadedImages.has(movieData()!.id)"
              [src]="startUrl + (movieData()?.poster_path || '')"
              [alt]="movieData()?.title || ''" />
            <div class="text-content">
              <h1 class="text-4xl font-bold text-white-900 mb-1">
                {{ movieData()?.title || movieData()?.name }} ({{
                  movieData()?.release_date?.slice(0, 4)
                    ? movieData()?.release_date?.slice(0, 4)
                    : movieData()?.first_air_date?.slice(0, 4)
                }})
              </h1>
              <p class="text-gray-300 mb-3">
                {{
                  movieData()?.release_date
                    ? formatDate(movieData()?.release_date)
                    : formatDate(movieData()?.first_air_date)
                }}
                ● {{ getGenres(movieData()?.genres) }} ●
                {{ minutesToTime(movieData()?.runtime) }}
              </p>

              <div class="rating-block flex items-center mb-3">
                <!--Rating component start-->
                <app-rating [rat]="movieData()"></app-rating>
                <!--Rating component end-->
                <div class="rating-name ml-2 mr-4 relative bottom-[5px]">
                  <p>IMDB</p>
                </div>
              </div>

              <h3 class="italic text-gray-300">{{ movieData()?.tagline }}</h3>

              <div>
                <a href="" class="underline">Play trailer</a>
              </div>

              <h4 class="text-xl text-white-900 mb-2 mt-2">Overview</h4>
              <p class="w-[80%]">
                {{
                  movieData()?.overview
                    ? movieData()?.overview
                    : 'Description will be added soon...'
                }}
              </p>
              <div class="flex mt-6 gap-20">
                @for (worker of movieCrew(); track $index) {
                  <div class="direction">
                    <a
                      [routerLink]="['/persons', worker.id]"
                      class="font-bold text-md underline"
                      >{{ worker.name }}</a
                    >
                    <p>{{ worker.job }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-[80%] mx-auto flex">
        <div class="w-4/5 mx-auto flex flex-col">
          <!--Actors component start-->
          <app-actors
            *ngIf="movieData() && loadedImages.has(movieData()!.id)"
            [cast]="movieCast()"
            [id]="movieId"
            class="md:flex-row">
          </app-actors>
          <!--Actors component end-->
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
            <div class="flex mb-4 justify-start items-center gap-[4%]">
              <h3 class="text-2xl font-semibold text-gray-900">Social</h3>
              <button class="text-xl w-[auto] font-semibold">
                Reviews ({{ dataReview() }})
              </button>
              <button class="text-xl w-[auto] font-semibold">
                Discussions ({{ dataReview() }})
              </button>
            </div>
            <!--Reviews component start-->
            <app-review
              [review]="dataReview()"
              [allReviews]="dataReviewResponse()"></app-review>
            <!--Reviews component end-->
          </div>
        </div>
        <app-aside
          *ngIf="movieData() && loadedImages.has(movieData()!.id)"
          [props]="movieData()"
          class="w-1/5 md:flex-row flex items-center">
        </app-aside>
      </div>
      <div class="w-[80%] mx-auto">
        <a
          [routerLink]="['/all-reviews', this.movieData()?.id]"
          class="underline underline-offset-4 text-blue-400 font-bold"
          >Read all reviews</a
        >
      </div>
    </section>
  `,
  styles: ``,
})
export class MovieComponent implements OnInit {
  apiMovie = 'https://api.themoviedb.org/3/movie/';
  apiReviewEnd = '/reviews?language=en-US&page=1';
  apiTv = 'https://api.themoviedb.org/3/tv/';
  apiUrlEnd = '?language=en-US';
  apiCastEnd = '/credits?language=en-US';
  startUrl = 'https://image.tmdb.org/t/p/w500';
  startUrl2 = 'https://image.tmdb.org/t/p/w1920/';
  isLoading = false;
  movieId: number | undefined;
  movieData = signal<SingleMovie | undefined>(undefined);
  movieDataImg = signal<ImagesResponse | undefined>(undefined);
  movieCast = signal<CastMember[] | undefined>(undefined);
  movieCrew = signal<CrewMember[] | undefined>(undefined);
  movieAllTeam = signal<MovieCast | undefined>(undefined);
  dataReviewResponse = signal<ReviewsResponse | undefined>(undefined);
  dataReview = signal<ReviewItem| undefined>(undefined);
  loadedImages = new Set<number>();
  text: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private castService: CastService,
    private mediaTypeService: MediaTypeService,
    private commonService: CommonService
  ) {}

  backgroundImage = computed(() => {
    const imgData = this.movieDataImg();
    if (imgData && imgData.backdrops && imgData.backdrops.length > 1) {
      return `url(${this.startUrl2}${imgData.backdrops[2].file_path})`;
    }
    return '';
  });

  ngOnInit(): void {
    this.isLoading = true;
    let type = this.mediaTypeService.getMediaType();
    setTimeout(() => {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.movieId = id ? Number(id) : undefined;
        if (this.movieId !== undefined && type) {
          this.fetchCast(
            type === 'movie' ? this.apiMovie : this.apiTv,
            this.apiCastEnd,
            this.movieId
          );
          this.fetchData(
            type === 'movie' ? this.apiMovie : this.apiTv,
            this.apiUrlEnd,
            this.movieId
          );
          this.fetchDataImages(
            type === 'movie' ? this.apiMovie : this.apiTv,
            this.movieId
          );
          this.fetchCommon(
            type === 'movie' ? this.apiMovie : this.apiTv,
            this.apiReviewEnd,
            this.movieId
          );
        }
      });
    }, 500);
  }

  fetchData(apiOne: string, apiTwo: string, id: number): void {
    this.movieService.getDataMovie(apiOne, apiTwo, id).subscribe(
      data => {
        this.movieData.set(data);
        this.isLoading = false;
        console.log('Movie data: ', this.movieData());
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }

  fetchDataImages(apiStart: string, id: number): void {
    this.movieService.getDataImage(apiStart, id).subscribe(
      data => {
        this.movieDataImg.set(data);
        this.isLoading = false;
        console.log('Movie dataImg: ', this.movieDataImg());
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }
  fetchCast(linkOne: string, linkTwo: string, id: number): void {
    this.castService.getDataCast(linkOne, linkTwo, id).subscribe(
      data => {
        this.movieCast.set(data.cast.filter((_, i) => i < 15));
        this.movieCrew.set(data.crew.filter((_, i) => i < 3));
        this.movieAllTeam.set(data);
        this.isLoading = false;
        console.log('Movie all team: ', this.movieAllTeam());
      },
      error => {
        console.error('Error fetching data: ', error);
        this.isLoading = false;
      }
    );
  }

  fetchCommon(linkOne: string, linkTwo: string, id: number): void {
    this.commonService.getCommonData(linkOne, linkTwo, id).subscribe(
      data => {
        this.dataReviewResponse.set(data);
        this.dataReview.set(data.results[0]);
        this.isLoading = false;
        console.log('Review response: ', this.dataReviewResponse());
        console.log('Data Review: ', this.dataReview());
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
      return 'Date unknown';
    }
  }
}
