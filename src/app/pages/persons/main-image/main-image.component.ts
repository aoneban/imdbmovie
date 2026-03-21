import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SinglePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-main-image',
  imports: [CommonModule],
  template: `
    <div *ngIf="data as p">
      <img
        *ngIf="!loadedImages.has(p.id)"
        class="w-[80%] h-[80%] bg-gray-300"
        src="/icon-bg.svg"
        alt="placeholder" />
      <img
        decoding="auto"
        class="rounded-xl transition-opacity duration-700"
        (load)="onImageLoad(data!.id)"
        [class.opacity-0]="!loadedImages.has(data.id)"
        [src]="url + (data.profile_path || '')"
        [alt]="data.name || ''" />
    </div>
  `,
  styles: ``,
})
export class MainImageComponent {
  @Input() data: SinglePerson | undefined;
  @Input() url: string | undefined;
  loadedImages = new Set<number>();

  onImageLoad(id: number): void {
    this.loadedImages.add(id);
  }
}
