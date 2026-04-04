import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CastCredits } from '../../../interfaces/interface';
import { MediaTypeService } from '../../../services/media-type.service';

@Component({
  selector: 'app-previous',
  imports: [RouterModule],
  template: `
    <!-- Start acting component -->
    <div>
      <h3 class="font-medium text-xl mb-3">Acting</h3>
      <div class="border-2 p-3 border-solid rounded-lg">
        @for (item of release; track $index) {
          <li
            class="list-none pt-3 cursor-pointer"
            (click)="setType(item.media_type)"
            [routerLink]="[
              item.media_type === 'movie' ? '/movie' : '/tv',
              item.id,
            ]">
            <span class="ml-[2%]">{{ item.release_date || 'Unknown' }}</span>
            <span
              class="ml-[3%] font-bold hover:text-gray-400 duration-300 ease-in-out">
              {{ item.title || item.name || item.original_title }}
            </span>

            @if (item.character) {
              <span class="block ml-[9%] text-gray-600"
                >as {{ item.character }}</span
              >
            } @else {
              <span class="block ml-[9%] h-[1.5rem]"></span>
            }
          </li>

          @if (
            $index < release!.length - 1 &&
            item.release_date !== release![$index + 1].release_date
          ) {
            <div class="w-full border-b border-gray-300 my-4"></div>
          }
        } @empty {
          <li>There are no items.</li>
        }
      </div>
    </div>
    <!-- End acting component -->
  `,
  styles: ``,
})
export class PreviousComponent {
  @Input() release: CastCredits[] | undefined = [];
  constructor(private mediaTypeService: MediaTypeService) {}

  setType(type: string){
    this.mediaTypeService.setMediaType(type)
  }

}
