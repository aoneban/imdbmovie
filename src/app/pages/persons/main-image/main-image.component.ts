import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-main-image',
  imports: [CommonModule],
  template: `
    <div *ngIf="personData() as p">
      <img
        *ngIf="!loadedImages.has(p.id)"
        class="w-[80%] h-[80%] bg-gray-300"
        src="/icon-bg.svg"
        alt="placeholder" />
      <img
        decoding="auto"
        class="rounded-xl transition-opacity duration-700"
        (load)="onImageLoad(personData()!.id)"
        [class.opacity-0]="!loadedImages.has(personData()!.id)"
        [src]="url + (personData()?.profile_path || '')"
        [alt]="personData()?.name || ''" />
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
