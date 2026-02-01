import { Component, Input } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-biography',
  imports: [CommonModule, SlicePipe],
  template: `
    <div class="relative">
      <div
        class="transition-all duration-500 ease-in-out overflow-hidden relative"
        [class.max-h-28]="!show"
        [class.max-h-[1000px]]="show">
        <p class="text-base text-gray-800 leading-relaxed mt-2 whitespace-pre-line">
          {{
            show ? data?.biography : (data?.biography | slice: 0 : 400) + '...'
          }}
        </p>
        <div
          *ngIf="!show"
          class="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
      <button
        *ngIf="data && data.biography && data.biography.length > 400"
        (click)="toggleShow()"
        class="text-indigo-600 hover:underline mt-1 float-right">
        {{ show ? 'Read less' : 'Read more...' }}
      </button>
    </div>
  `,
  styles: ``,
})
export class BiographyComponent {
  @Input() data: SinglePerson | undefined;
  @Input() show: boolean | undefined;

  toggleShow() {
    this.show = !this.show;
  }
}
