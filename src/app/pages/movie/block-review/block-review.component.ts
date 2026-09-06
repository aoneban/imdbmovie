import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SimilarMoviesComponent } from './similar-movies/similar-movies.component';
import { Movie, ReviewItem, SingleMovie } from '../../../interfaces/interface';

@Component({
  selector: 'app-review-block',
  imports: [CommonModule, RouterLink, SimilarMoviesComponent],
  template: `
    <div>
      <div *ngIf="dataReview()" class="w-[80%] mx-auto">
        <a
          [routerLink]="['/all-reviews', this.movieData()?.id]"
          [queryParams]="{ type: route.snapshot.url[0].path }"
          class="duration-200 easy underline underline-offset-4 text-blue-400 font-bold hover:text-blue-500"
          >Read all reviews</a
        >
      </div>
      <div class="w-[80%] mx-auto">
        <h3 class="text-2xl font-semibold text-gray-900 mt-6">Similar</h3>

        <!--Similar movies component start-->
        <app-similar-movies
          [similar]="similarMovies()"
          [url]="startUrl"></app-similar-movies>
        <!--Similar movies component end-->
      </div>
    </div>
  `,
  styles: ``,
})
export class ReviewBlockComponent {
  constructor(public route: ActivatedRoute) {}
  @Input() startUrl: string | undefined;
  dataReview = input<ReviewItem | undefined>();
  movieData = input<SingleMovie | undefined>();
  similarMovies = input<Movie[]>([]);
}
