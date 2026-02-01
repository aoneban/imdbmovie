import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CastMember } from '../../../interfaces/interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tv-actors',
  imports: [RouterModule, CommonModule],
  template: `
    <section class="average__content new__index-content">
      <div class="content-left">
        <h3 class="trending">Top Billed Cast</h3>
        <div class="movies__wrapper">
          <div class="movies__wrapper-block add">
            <div class="movies__wrapper-cart rounded-lg overflow-hidden" *ngFor="let person of cast">
              <div class="wrapper_img">
                <img
                  decoding="auto"
                  [routerLink]="['/persons', person.id]"
                  class="image rounded-none"
                  src="{{ startUrl + person.profile_path }}"
                  alt="{{ person.name }}" />
              </div>
              <a [routerLink]="['/persons', person.id]">
                <p>
                  <b class="pl-2">{{ person.name }}</b>
                </p>
              </a>
              <a>
                <p class="p-2">
                  {{ person.character }}
                </p>
              </a>
            </div>
            <div class="flex justify-center h-full items-center">
              <button
                [routerLink]="['/tv-cast', id]"
                class="w-fit whitespace-nowrap">
                View more &#10230;
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right"></div>
    </section>
  `,
  styles: `
    .wrapper_img {
      border-radius: 0;
      width: auto;
      height: auto;
    }
    .trending {
      margin-top: 8rem;
      margin-bottom: 1rem;
    }

    .add {
      gap: 15px;
    }

    .movies__wrapper-cart {
      border: 1px solid lightgrey;
    }
  `,
})
export class TvActorsComponent {
  startUrl = 'https://image.tmdb.org/t/p/w500';
  @Input() cast: CastMember[] | undefined;
  @Input() id: number | undefined;
}
