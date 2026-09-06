import { Component, computed, inject } from '@angular/core';
import { NavbarComponent } from '../../../../main/shared/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import {
  ReviewsResponse,
  SingleMovie,
} from '../../../../../interfaces/interface';
import { ReviewComponent } from '../review.component';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../../../services/movie.service';
import { TitleMovieComponent } from '../../../block-hero/title-movie/title-movie.component';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  catchError,
  combineLatest,
  forkJoin,
  of,
  startWith,
  switchMap,
} from 'rxjs';
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
  private movieService = inject(MovieService);
  private data = toSignal(
    combineLatest([this.route.paramMap, this.route.queryParamMap]).pipe(
      switchMap(([params, query]) => {
        const api =
          query.get('type') === 'tv' ? TMDB.apiBaseTV : TMDB.apiBaseMovie;
        const id = Number(params.get('id'));
        return forkJoin({
          movie: this.movieService.getDataMovie<SingleMovie>(
            api,
            TMDB.apiLanguage,
            id
          ),
          reviews: this.movieService.getDataMovie<ReviewsResponse>(
            api,
            TMDB.apiReviews,
            id
          ),
        }).pipe(
          catchError(error => {
            console.error('Error fetching data: ', error);
            return of(undefined);
          }),
          startWith(undefined)
        );
      })
    )
  );
  allReviews = computed(() => this.data()?.reviews);
  movieData = computed(() => this.data()?.movie);
  isLoading = computed(() => this.movieData());
}
