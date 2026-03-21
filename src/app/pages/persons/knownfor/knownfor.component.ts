import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CastCredits } from '../../../interfaces/interface';
import { MediaTypeService } from '../../../services/media-type.service';

@Component({
  selector: 'app-knownfor',
  imports: [RouterModule, CommonModule],
  template: `
    <h4 class="text-xl font-semibold text-gray-800 mt-6 mb-6">Known for</h4>
    <div class="movies__wrapper">
      <div class="movies__wrapper-block">
        <div class="movies__wrapper-cart" *ngFor="let movie of cast">
          <div class="h-[220px]">
            <img
              [routerLink]="[
                movie.media_type === 'movie' ? '/movie' : '/tv',
                movie.id,
              ]"
              class="image"
              (click)="setType(movie.media_type)"
              [src]="
                movie.poster_path ? url + movie.poster_path : '/placeholder.svg'
              "
              src="{{ url + movie.poster_path }}"
              alt="{{ movie.title }}" />
          </div>
          <a
            [routerLink]="[
              movie.media_type === 'movie' ? '/movie' : '/tv',
              movie.id,
            ]"
            (click)="setType(movie.media_type)">
            <p class="font-normal pt-3 pl-3 text-sm">
              {{ movie.title || movie.name }}
            </p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class KnownForComponent {
  @Input() cast: CastCredits[] | undefined = [];
  @Input() url: string | undefined;

  constructor(private mediaTypeService: MediaTypeService) {}

  setType(type: string): void {
    this.mediaTypeService.setMediaType(type);
  }
}
