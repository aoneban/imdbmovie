import { Component, input, Input } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-biography',
  imports: [CommonModule, SlicePipe],
  template: `
    <div class="relative">
      <h4 class="text-xl font-semibold text-gray-900 mt-6">Biography</h4>
      @if(personData()?.biography) {
        <div
          class="transition-all duration-500 ease-in-out overflow-hidden relative"
          [class.max-h-28]="!show"
          [class.max-h-[1000px]]="show">
          <p
            class="text-base text-gray-800 leading-relaxed mt-2 whitespace-pre-line">
            {{
              show
                ? personData()?.biography
                : (personData()?.biography | slice: 0 : 400) + '...'
            }}
          </p>
          <div
            *ngIf="!show"
            class="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        </div>
        <button
          *ngIf="personData() && personData()?.biography && personData()?.biography!.length > 400"
          (click)="toggleShow()"
          class="float-right duration-200 easy underline underline-offset-4 text-blue-400 font-bold hover:text-blue-500">
          {{ show ? 'Read less' : 'Read more...' }}
        </button>
      } @else {
       <p class="mt-4 mb-4 italic"> Information is being filled in...</p>
      }
    </div>
  `,
  styles: ``,
})
export class BiographyComponent {
  personData = input<SinglePerson | null>(null);
  @Input() show: boolean | undefined;

  toggleShow() {
    this.show = !this.show;
  }
}
