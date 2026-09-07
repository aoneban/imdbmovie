import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Movie } from '../../../../interfaces/interface';

@Component({
  selector: 'app-similar-movies',
  imports: [RouterModule],
  template: `
    <div class="blur-right w-full min-w-0">
      <div
        class="scroll-container overflow-x-auto new-block mt-5 mb-2 flex max-w-[100%] gap-4 justify-start">
        @for (item of similar; track item.id) {
          <li
            class="list-none w-[230px] max-w-full shrink-0 [overflow-wrap:anywhere]">
            <img
              decoding="async"
              [routerLink]="[
                (item.media_type || route.snapshot.url[0].path) === 'movie'
                  ? '/movie'
                  : '/tv',
                item.id,
              ]"
              class="cursor-pointer transition-opacity duration-700 rounded-lg relative w-full aspect-video object-cover"
              [src]="
                item.backdrop_path
                  ? url + item.backdrop_path
                  : '/placeholder.svg'
              "
              alt="{{ item.title }}" />
            <p
              class="text-sm pt-3 pb-3 pl-3 cursor-pointer font-medium hover:text-gray-400 easy duration-300 hover:underline hover:underline-offset-1"
              [routerLink]="[
                (item.media_type || route.snapshot.url[0].path) === 'movie'
                  ? '/movie'
                  : '/tv',
                item.id,
              ]">
              {{ item.title || item.name }}
            </p>
          </li>
        } @empty {
          <li>There are no items.</li>
        }
      </div>
    </div>
  `,
  styles: `
    .blur-right {
      position: relative;
      overflow: hidden;
    }

    .blur-right::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 60px;
      height: 100%;
      background: linear-gradient(
        to left,
        rgba(255, 255, 255, 0.9),
        transparent
      );
      pointer-events: none;
    }

    .scroll-container::-webkit-scrollbar-button {
      display: none;
      width: 0;
      height: 0;
    }

    .scroll-container::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    .scroll-container::-webkit-scrollbar-button:horizontal:start {
      display: none;
    }

    .scroll-container::-webkit-scrollbar-button:horizontal:end {
      display: none;
    }

    .scroll-container::-webkit-scrollbar {
      height: 8px;
    }
  `,
})
export class SimilarMoviesComponent {
  constructor(public route: ActivatedRoute) {}
  @Input() similar: Movie[] | undefined;
  @Input() url: string | undefined;
}
