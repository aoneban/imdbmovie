import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieSearchResponse } from '../../../interfaces/interface';
import { TruncateWordsPipe } from '../../../../pipes/truncate-words.pipe';

@Component({
  selector: 'app-tv',
  imports: [TruncateWordsPipe, CommonModule, RouterModule],
  template: `
    <ul>
      @for (movie of tvResponse()?.results; track movie.id) {
        <li>
          <div
            class="full relative min-h-[150px] flex gap-[15px] m-[20px] border border-gray-300 rounded-[10px] overflow-hidden">
            <div class="basis-[11%] bg-red-200">
              <div
                *ngIf="!loadedImages().has(movie.id)"
                class="absolute w-[8%] top-[35px] left-[10px] pb-12 z-10">
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
              <a [routerLink]="['/tv', movie.id]" (click)="setType('tv')">
                <h3 class="text-xl font-bold tracking-tight text-gray-800">
                  {{ movie.title || movie.name }}
                </h3>
              </a>
              <p class="italic text-[13px] text-gray-400">
                {{ movie.release_date || movie.first_air_date }}
              </p>
              <p>{{ movie.overview || 'The description for this series is not ready yet, but it will be added shortly. We’re currently working on preparing accurate and engaging content. Thank you for your patience!' | truncateWords: 50}}</p>
            </div>
          </div>
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class TvComponent {
  tvResponse = input<MovieSearchResponse | undefined>(undefined);
  loadedImages = input<Set<number>>(new Set());
  loadMoreClick = output<number>();
  loadSetType = output<string>();
  startUrl = 'https://image.tmdb.org/t/p/w200';

  onLoad(id: number) {
    this.loadMoreClick.emit(id);
  }

  setType(v: string) {
    this.loadSetType.emit(v);
  }
}
