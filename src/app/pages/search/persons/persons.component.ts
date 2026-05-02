import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiResponsePerson } from '../../../interfaces/interface';

@Component({
  selector: 'app-persons',
  imports: [RouterModule, CommonModule],
  template: `
    <ul>
      @for (person of personResponse()?.results; track person.id) {
        <li>
          <div
            class="full relative min-h-[150px] flex gap-[15px] m-[20px] border border-gray-300 rounded-[10px] overflow-hidden">
            <div class="basis-[11%] bg-red-200">
              <div
                *ngIf="!loadedImages().has(person.id)"
                class="absolute w-[8%] top-[35px] left-[10px] pb-12 z-10">
                <img src="/placeholder.svg" alt="placeholder" />
              </div>
              <img
                decoding="async"
                class="w-[100%] h-[100%]"
                (load)="onLoad(person.id)"
                [class.opacity-0]="!loadedImages().has(person.id)"
                [src]="startUrl + (person.profile_path || '')"
                [alt]="person.name || ''" />
            </div>

            <div class="basis-[92%] pt-2 pb-2">
              <div>
                <a [routerLink]="['/persons', person.id]" class="text-xl font-bold tracking-tight text-gray-800">
                  {{ person.name }}
                </a>
                <p>{{ person.known_for_department }}</p>
                @for (item of person.known_for; track item.id) {
                  <a
                    [routerLink]="[
                      item.media_type === 'movie' ? '/movie' : '/tv',
                      item.id,
                    ]"
                    (click)="setType(item.media_type)"
                    >{{ item.name || item.title }} + </a
                  >
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
