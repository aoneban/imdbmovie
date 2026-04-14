import { Component, effect, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleMovie } from '../../../../interfaces/interface';
import { RouterModule } from '@angular/router';
import { MediaTypeService } from '../../../../services/media-type.service';
import { TMDB } from '../../../../config/tmdb.config';

@Component({
  selector: 'app-title-movie',
  imports: [CommonModule, RouterModule],
  template: `
    <div [ngStyle]="{ 'background-color': 'grey' }" class="mx-auto p-6">
      <div class="w-5/6 flex gap-5 mx-auto">
        <img
          decoding="async"
          class="rounded-xl w-28 h-auto"
          [src]="url + (property()?.poster_path || '')"
          [alt]="property()?.title || ''" />
        <div class="flex flex-col justify-center">
          <h2 class="text-4xl font-bold text-white !important mb-4">
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
            class="w-fit whitespace-nowrap text-gray-200 hover:text-gray-300 font-bold px-4 py-2 rounded transition-colors duration-300 ease-in-out">
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
  mediaType?: string | null;

  constructor(private mediaTypeService: MediaTypeService) {
    effect(() => {
      this.mediaType = this.mediaTypeService.getMediaType();
    })
  }
}
