import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieSearchResponse } from '../../../interfaces/interface';
import { TruncateWordsPipe } from '../../../../pipes/truncate-words.pipe';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, RouterModule, TruncateWordsPipe],
  template: `
    <ul>
      @for (movie of movieResponse()?.results; track movie.id) {
        <li>
          <div
            class="full relative min-h-[150px] flex gap-[15px] m-[20px] border border-gray-300 rounded-[10px] overflow-hidden">
            <div class="basis-[11%] bg-red-200">
              <div
                *ngIf="!loadedImages().has(movie.id)"
                class="absolute w-[8%] top-[35px] left-[10px] pb-12 z-10 animate-pulse">
                <img src="/placeholder.svg" alt="placeholder" />
              </div>
              <img
                decoding="async"
                class="w-[100%] h-[100%]"
                (load)="onLoad(movie.id)"
                [class.opacity-0]="!loadedImages().has(movie.id)"
                [src]="startUrl + (movie.poster_path || '')"
                [alt]="movie?.title || movie.name || ''" />
            </div>

            <div class="basis-[92%] pt-2 pb-2">
              <a [routerLink]="['/movie', movie.id]" (click)="setType()">
                <h3 class="text-xl font-bold tracking-tight text-gray-800">
                  {{ movie.title || movie.name }}
                </h3>
              </a>
              <p class="italic text-[13px] text-gray-400">
                {{ movie.release_date }}
              </p>
              <p>{{ movie.overview | truncateWords: 50 }}</p>
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
