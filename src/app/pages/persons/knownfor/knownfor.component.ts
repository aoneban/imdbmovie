import { Component, input, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CastCredits } from '../../../interfaces/interface';
import { MediaTypeService } from '../../../services/media-type.service';

@Component({
  selector: 'app-knownfor',
  imports: [RouterModule, CommonModule],
  template: `
    <h4 class="mb-4 text-xl font-semibold text-gray-800">Known for</h4>
    <ul
      class="flex w-full min-w-0 snap-x snap-proximity gap-4 overflow-x-auto p-1 pb-4 sm:gap-5"
      aria-label="Known for">
      <li
        class="w-32 min-w-0 shrink-0 snap-start sm:w-36 lg:w-40"
        *ngFor="let movie of cast()">
        <a
          class="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          [routerLink]="[
            movie.media_type === 'movie' ? '/movie' : '/tv',
            movie.id,
          ]"
          (click)="setType(movie.media_type)">
          <div class="aspect-[2/3] overflow-hidden rounded-xl bg-gray-200">
            <img
              class="block h-full w-full object-cover"
              [src]="
                movie.poster_path ? url + movie.poster_path : '/placeholder.svg'
              "
              alt="{{ movie.title || movie.name }}" />
          </div>
          <p
            class="break-words pt-3 text-sm font-medium transition-colors duration-200 group-hover:text-gray-500 group-hover:underline group-hover:underline-offset-2">
            {{ movie.title || movie.name }}
          </p>
        </a>
      </li>
    </ul>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
})
export class KnownForComponent {
  cast = input<CastCredits[] | undefined>([]);
  @Input() url: string | undefined;

  constructor(private mediaTypeService: MediaTypeService) {}

  setType(type: string): void {
    this.mediaTypeService.setMediaType(type);
  }
}
