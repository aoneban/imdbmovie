import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActorsComponent } from './actors/actors.component';
import { ReviewComponent } from '../block-review/review/review.component';
import { AsideComponent } from './aside/aside.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CastMember,
  MovieCast,
  ReviewItem,
  ReviewsResponse,
  SingleMovie,
} from '../../../interfaces/interface';

@Component({
  selector: 'app-main-block',
  imports: [
    CommonModule,
    ActorsComponent,
    ReviewComponent,
    AsideComponent,
    RouterModule,
  ],
  template: `
    <div
      class="mx-auto grid max-w-screen-xl grid-cols-1 gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-8 lg:px-8">
      <div class="min-w-0 flex flex-col">
        <!--Actors component start-->
        <app-actors
          *ngIf="movieData() && loadedImages().has(movieData()!.id)"
          [movieCast]="movieCast()"
          [movieId]="movieId()"
          class="block min-w-0">
        </app-actors>
        <!--Actors component end-->
        <div
          class="w-[100%] flex gap-5 mx-auto mb-6 pb-8 border-b border-gray-300">
          <button
            *ngIf="movieData() && loadedImages().has(movieData()!.id)"
            [routerLink]="['/cast', movieAllTeam()?.id]"
            [queryParams]="{ type: mediaType }"
            class="w-fit whitespace-nowrap text-lg duration-300 easy font-bold underline underline-offset-2 hover:text-gray-300">
            Full Cast & Crew
          </button>
        </div>
        <div *ngIf="movieData() && loadedImages().has(movieData()!.id)">
          <div
            class="flex flex-wrap mb-4 justify-start items-center gap-x-4 gap-y-2">
            <h3 class="text-2xl font-semibold text-gray-900">Social</h3>
            <a
              *ngIf="dataReviewResponse()?.results?.length"
              [routerLink]="['/all-reviews', movieAllTeam()?.id]"
              [queryParams]="{ type: mediaType }"
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
        class="block min-w-0 relative [overflow-wrap:anywhere]">
      </app-aside>
      <!--Aside component end-->
    </div>
  `,
  styles: ``,
})
export class MainBlockComponent {
  constructor(private route: ActivatedRoute) {}

  get mediaType(): string {
    return this.route.snapshot.url[0].path;
  }
  movieData = input<SingleMovie | undefined>();
  movieId = input<number | undefined>();
  dataReview = input<ReviewItem | undefined>();
  movieCast = input<CastMember[] | undefined>();
  movieAllTeam = input<MovieCast | undefined>();
  loadedImages = input<Set<number>>(new Set());
  dataReviewResponse = input<ReviewsResponse | undefined>();
}
