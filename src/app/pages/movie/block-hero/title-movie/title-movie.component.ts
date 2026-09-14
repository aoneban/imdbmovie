import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleMovie } from '../../../../interfaces/interface';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TMDB } from '../../../../config/tmdb.config';

@Component({
  selector: 'app-title-movie',
  imports: [CommonModule, RouterModule],
  template: `
    <div [ngStyle]="{ 'background-color': 'grey' }" class="mx-auto p-4 sm:p-6">
      <div class="w-full lg:w-5/6 flex gap-3 sm:gap-5 mx-auto">
        <img
          decoding="async"
          class="rounded-xl w-20 h-[120px] sm:w-28 sm:h-[168px] object-cover shrink-0"
          [src]="url + (property()?.poster_path || '')"
          [alt]="property()?.title || ''" />
        <div class="min-w-0 flex flex-col justify-center">
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl break-words font-bold text-white !important mb-2 sm:mb-4">
            {{ property()?.title || property()?.name }} ({{
              property()?.release_date?.slice(0, 4) ||
                property()?.first_air_date?.slice(0, 4)
            }})
          </h2>
          <a
            [routerLink]="[
              mediaType === 'movie' ? '/movie' : '/tv',
              property()?.id,
            ]"
            class="w-fit max-w-full min-h-11 inline-flex items-center text-gray-200 hover:text-gray-300 font-bold px-2 sm:px-4 py-2 rounded transition-colors duration-300 ease-in-out">
            &#8592; Back to main
          </a>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class TitleMovieComponent {
  property = input<SingleMovie | undefined>();
  url = TMDB.imageBaseUrl;
  constructor(private route: ActivatedRoute) {}
  get mediaType(): string {
    return this.route.snapshot.queryParamMap.get('type') === 'tv'
      ? 'tv'
      : 'movie';
  }
}
