import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RatingComponent } from '../../movie/block-hero/rating/rating.component';
import { MediaTypeService } from '../../../services/media-type.service';
import { Movie } from '../../../interfaces/interface';
import { getReleaseDate } from '../../../helpers/getReleaseDate';
import { TMDB } from '../../../config/tmdb.config';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterModule, RatingComponent],
  template: `
    <div
      class="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      @for (movie of movieData(); track movie.id) {
        <div
          class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200">
          <div class="relative aspect-[2/3] w-full bg-gray-200">
            <img
              decoding="async"
              *ngIf="!loadedImages().has(movie.id)"
              class="absolute inset-0 h-full w-full animate-pulse object-cover"
              src="/placeholder.svg"
              alt=""
              aria-hidden="true" />

            <img
              decoding="auto"
              class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              [src]="
                movie?.poster_path
                  ? startUrl + movie.poster_path
                  : '/placeholder.svg'
              "
              (load)="onImageLoad(movie.id)"
              [class.opacity-0]="!loadedImages().has(movie.id)"
              alt="{{ movie.title || movie.name }}" />

            <!--Rating component start-->
            <div class="absolute left-2 top-2">
              <app-rating [rat]="movie"></app-rating>
            </div>
            <!--Rating component end -->
          </div>

          <div class="flex-1 space-y-2 p-3 sm:p-4">
            <h3 class="break-words font-bold leading-snug">
              <a
                (click)="setType(type())"
                [routerLink]="[
                  type() === 'movie' ? '/movie' : '/tv',
                  movie.id,
                ]">
                {{ movie.title || movie.name }}
              </a>
            </h3>

            <p class="text-sm italic text-gray-400">
              {{ getDate(movie) }}
            </p>
          </div>
        </div>
      }
    </div>
    <div class="mb-10 mt-8 flex justify-center">
      <button
        type="button"
        (click)="loadMore()"
        class="min-h-11 w-full rounded bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto sm:min-w-48">
        Load more...
      </button>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
})
export class MovieCardComponent {
  movieData = input.required<Movie[]>();
  type = input.required<string>();
  loadedImages = signal<Set<number>>(new Set());
  startUrl = TMDB.imageBaseUrl;
  loadMoreClick = output<void>();

  constructor(private mediaTypeService: MediaTypeService) {}

  loadMore(): void {
    this.loadMoreClick.emit();
  }

  setType(type: string): void {
    this.mediaTypeService.setMediaType(type);
  }

  onImageLoad(id: number): void {
    this.loadedImages.update(set => new Set([...set, id]));
  }

  getDate(movie: Movie): string {
    const newDate = getReleaseDate(movie);
    return newDate;
  }
}
