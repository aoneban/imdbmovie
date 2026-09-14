import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieSearchResponse } from '../../../interfaces/interface';
import { TruncateWordsPipe } from '../../../../pipes/truncate-words.pipe';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, RouterModule, TruncateWordsPipe],
  template: `
    <ul class="space-y-4">
      @for (movie of movieResponse()?.results; track movie.id) {
        <li>
          <div
            class="flex items-start gap-3 overflow-hidden rounded-[10px] border border-gray-300 sm:gap-4">
            <div
              class="relative aspect-[2/3] w-20 shrink-0 overflow-hidden bg-gray-100 sm:w-28">
              <div
                *ngIf="!movie.poster_path || !loadedImages().has(movie.id)"
                class="absolute inset-0 flex items-center justify-center p-3">
                <img
                  class="h-auto w-full max-w-12"
                  src="/placeholder.svg"
                  alt=""
                  aria-hidden="true" />
              </div>
              @if (movie.poster_path) {
                <img
                  decoding="async"
                  class="absolute inset-0 h-full w-full object-cover"
                  (load)="onLoad(movie.id)"
                  [class.opacity-0]="!loadedImages().has(movie.id)"
                  [src]="startUrl + movie.poster_path"
                  [alt]="movie.title || movie.name || ''" />
              }
            </div>

            <div class="min-w-0 flex-1 break-words py-3 pr-3 sm:py-4 sm:pr-4">
              <a [routerLink]="['/movie', movie.id]" (click)="setType()">
                <h3
                  class="text-base font-bold leading-snug tracking-tight text-gray-800 sm:text-xl">
                  {{ movie.title || movie.name }}
                </h3>
              </a>
              <p class="italic text-[13px] text-gray-400">
                {{ movie.release_date }}
              </p>
              <p class="mt-2 text-sm leading-relaxed sm:text-base">
                {{ movie.overview | truncateWords: 50 }}
              </p>
            </div>
          </div>
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class MoviesComponent {
  movieResponse = input<MovieSearchResponse | undefined>(undefined);
  loadedImages = input<Set<number>>(new Set());
  loadMoreClick = output<number>();
  loadSetType = output<void>();
  startUrl = 'https://image.tmdb.org/t/p/w200';

  onLoad(id: number) {
    this.loadMoreClick.emit(id);
  }

  setType() {
    this.loadSetType.emit();
  }
}
