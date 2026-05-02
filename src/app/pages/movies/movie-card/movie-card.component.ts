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
    <div class="flex w-[80%] mx-auto flex-wrap justify-center">
      @for (movie of movieData(); track movie.id) {
        <div class="relative w-[20%] mt-5">
          <div
            class="m-5 h-[100%] rounded-xl border border-gray-200 overflow-hidden">
            <img
              decoding="async"
              *ngIf="!loadedImages().has(movie.id)"
              class="absolute inset-0 w-[85%] h-[80%] p-5 m-5 object-cover bg-gray-200 animate-pulse"
              src="/placeholder.svg"
              alt="placeholder" />

            <img
              decoding="auto"
              class="w-[auto] transition-opacity duration-700 rounded-none"
              [src]="
                movie?.poster_path
                  ? startUrl + movie.poster_path
                  : '/placeholder.svg'
              "
              (load)="onImageLoad(movie.id)"
              [class.opacity-0]="!loadedImages().has(movie.id)"
              alt="{{ movie.name }}" />

            <!--Rating component start-->
            <app-rating
              [rat]="movie"
              class="absolute top-[6%] left-[10%]"></app-rating>
            <!--Rating component end -->

            <h3
              class="cursor-pointer font-bold relative top-4 left-3"
              (click)="setType(type())"
              [routerLink]="[type() === 'movie' ? '/movie' : '/tv', movie.id]">
              {{ movie.title || movie.name }}
            </h3>

            <p class="relative top-4 left-3 italic text-[14px] text-gray-400">
              {{ getDate(movie) }}
            </p>
          </div>
        </div>
      }
      <div class="mt-20 mb-10">
        <button
          (click)="loadMore()"
          class="w-[15vw] px-1 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
          Load more...
        </button>
      </div>
    </div>
  `,
  styles: ``,
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
