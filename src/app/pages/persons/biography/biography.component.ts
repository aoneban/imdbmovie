import { Component, input, Input } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-biography',
  imports: [CommonModule, SlicePipe],
  template: `
    <div class="min-w-0">
      <h4 class="mb-4 text-xl font-semibold text-gray-900">Biography</h4>
      @if (personData()?.biography; as biography) {
        <p
          class="whitespace-pre-line break-words text-base leading-relaxed text-gray-800">
          {{
            show || biography.length <= 400
              ? biography
              : (biography | slice: 0 : 400) + '...'
          }}
        </p>
        @if (biography.length > 400) {
          <div class="mt-2 flex justify-end">
            <button
              type="button"
              [attr.aria-expanded]="!!show"
              (click)="toggleShow()"
              class="min-h-11 w-auto px-2 py-2 text-base font-bold text-blue-500 underline underline-offset-4 transition-colors hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
              {{ show ? 'Read less' : 'Read more...' }}
            </button>
          </div>
        }
      } @else {
        <p class="italic">Information is being filled in...</p>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
})
export class BiographyComponent {
  personData = input<SinglePerson | null>(null);
  @Input() show: boolean | undefined;

  toggleShow() {
    this.show = !this.show;
  }
}
