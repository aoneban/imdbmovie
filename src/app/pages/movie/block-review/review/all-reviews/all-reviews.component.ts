import { Component, computed, effect, inject, signal } from '@angular/core';
import { NavbarComponent } from '../../../../main/shared/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { ReviewsResponse } from '../../../../../interfaces/interface';
import { MediaTypeService } from '../../../../../services/media-type.service';
import { ReviewComponent } from '../review.component';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../../services/movie.service';
import { TitleMovieComponent } from '../../../block-hero/title-movie/title-movie.component';
import { MovieStoreService } from '../../../../../services/movie-store.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TMDB } from '../../../../../config/tmdb.config';

@Component({
  selector: 'app-all-reviews',
  imports: [
    NavbarComponent,
    ReviewComponent,
    CommonModule,
    TitleMovieComponent,
  ],
  template: `
    <section>
      <div>
        <div *ngIf="!isLoading()" class="preloader">
          <div class="loader"></div>
        </div>
        <div *ngIf="isLoading()">
          <app-navbar></app-navbar>
          <app-title-movie [property]="movieData()"></app-title-movie>
          <section class="mt-[2rem]">
            <div class="w-[80%] mx-auto">
              <app-review
                *ngFor="let item of allReviews()?.results"
                [review]="item"
                [allReviews]="allReviews()"></app-review>
            </div>
          </section>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class AllReviewsComponent {
  route = inject(ActivatedRoute);
  movieStoreService = inject(MovieStoreService);
  allReviews = signal<ReviewsResponse | undefined>(undefined);
  movieId = toSignal(
    this.route.paramMap.pipe(map(params => Number(params.get('id'))))
  );

  constructor(
    private mediaTypeService: MediaTypeService,
    private movieService: MovieService
  ) {
    effect(() => {
      const type = this.mediaTypeService.mediaType();
      const apiOne = type === 'movie' ? TMDB.apiBaseMovie : TMDB.apiBaseTV;
      this.movieService
        .getDataMovie<ReviewsResponse>(
          apiOne,
          TMDB.apiReviews,
          this.movieId() as number
        )
        .subscribe(
          data => {
            this.allReviews.set(data);
          },
          error => {
            console.error('Error fetching data: ', error);
          }
        );
    });
  }

  isLoading = computed(() => this.movieData());
  movieData = this.movieStoreService.movieData;
}
