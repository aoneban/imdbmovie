import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiResponsePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-persons',
  imports: [RouterModule, CommonModule],
  template: `
    <ul class="space-y-4">
      @for (person of personResponse()?.results; track person.id) {
        <li>
          <div
            class="flex items-start gap-3 overflow-hidden rounded-[10px] border border-gray-300 sm:gap-4">
            <div
              class="relative aspect-[2/3] w-20 shrink-0 overflow-hidden bg-gray-100 sm:w-28">
              <div
                *ngIf="!person.profile_path || !loadedImages().has(person.id)"
                class="absolute inset-0 flex items-center justify-center p-3">
                <img
                  class="h-auto w-full max-w-12"
                  src="/placeholder.svg"
                  alt=""
                  aria-hidden="true" />
              </div>
              @if (person.profile_path) {
                <img
                  decoding="async"
                  class="absolute inset-0 h-full w-full object-cover"
                  (load)="onLoad(person.id)"
                  [class.opacity-0]="!loadedImages().has(person.id)"
                  [src]="startUrl + person.profile_path"
                  [alt]="person.name || ''" />
              }
            </div>

            <div
              class="min-w-0 flex-1 break-words py-3 pr-3 text-sm leading-relaxed sm:py-4 sm:pr-4 sm:text-base">
              <div>
                <a
                  [routerLink]="['/persons', person.id]"
                  class="text-base font-bold leading-snug tracking-tight text-gray-800 sm:text-xl">
                  {{ person.name }}
                </a>
                <p class="my-1">{{ person.known_for_department }}</p>
                @for (item of person.known_for; track item.id) {
                  <a
                    [routerLink]="[
                      item.media_type === 'movie' ? '/movie' : '/tv',
                      item.id,
                    ]"
                    (click)="setType(item.media_type)"
                    >{{ item.name || item.title }} +
                  </a>
                }
              </div>
            </div>
          </div>
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class PersonsComponent {
  personResponse = input<ApiResponsePerson | undefined>(undefined);
  loadedImages = input<Set<number>>(new Set());
  loadMoreClick = output<number>();
  loadSetType = output<string>();
  startUrl = 'https://image.tmdb.org/t/p/w200';

  onLoad(id: number) {
    this.loadMoreClick.emit(id);
  }

  setType(item: string) {
    this.loadSetType.emit(item);
  }
}
