import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CastCredits } from '../../../interfaces/interface';
import { MediaTypeService } from '../../../services/media-type.service';

@Component({
  selector: 'app-previous',
  imports: [RouterModule],
  template: `
    <section>
      <h3 class="mb-4 text-xl font-medium">Acting</h3>
      <ul class="rounded-lg border-2 border-solid border-gray-200 p-3 sm:p-4">
        @for (item of previousReleases(); track item) {
          <li class="min-w-0">
            <a
              class="grid min-w-0 grid-cols-1 gap-1 rounded py-3 transition-colors hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-x-4"
              (click)="setType(item.media_type)"
              [routerLink]="[
                item.media_type === 'movie' ? '/movie' : '/tv',
                item.id,
              ]">
              <span class="break-words text-sm text-gray-600 sm:text-base">
                {{ item.release_date || 'Unknown' }}
              </span>
              <div class="min-w-0">
                <span class="block break-words font-bold">
                  {{ item.title || item.name || item.original_title }}
                </span>

                @if (item.character) {
                  <span
                    class="mt-1 block break-words text-sm text-gray-600 sm:text-base">
                    as {{ item.character }}
                  </span>
                } @else {
                  <span class="block min-h-6" aria-hidden="true"></span>
                }
              </div>
            </a>

            @if (
              $index < previousReleases()!.length - 1 &&
              item.release_date !== previousReleases()![$index + 1].release_date
            ) {
              <div
                class="my-3 border-b border-gray-300"
                aria-hidden="true"></div>
            }
          </li>
        } @empty {
          <li class="py-3 text-gray-600">There are no items.</li>
        }
      </ul>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
})
export class PreviousComponent {
  previousReleases = input<CastCredits[] | undefined>([]);
  constructor(private mediaTypeService: MediaTypeService) {}

  setType(type: string) {
    this.mediaTypeService.setMediaType(type);
  }
}
