import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-main-image',
  imports: [CommonModule],
  host: { class: 'block min-w-0' },
  template: `
    <div
      *ngIf="personData() as p"
      class="relative mx-auto aspect-[2/3] w-full max-w-[20rem] overflow-hidden rounded-xl bg-gray-300">
      <img
        *ngIf="!loadedImages.has(p.id)"
        class="absolute inset-0 h-full w-full object-contain p-6"
        src="/icon-bg.svg"
        alt="" />
      <img
        decoding="auto"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        (load)="onImageLoad(p.id)"
        [class.opacity-0]="!loadedImages.has(p.id)"
        [src]="p.profile_path ? url + p.profile_path : '/placeholder.svg'"
        [alt]="p.name || ''" />
    </div>
  `,
  styles: ``,
})
export class MainImageComponent {
  personData = input<SinglePerson | null>(null);
  @Input() url: string | undefined;
  loadedImages = new Set<number>();

  onImageLoad(id: number): void {
    this.loadedImages.add(id);
  }
}
