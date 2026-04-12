import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CastMember } from '../../../../interfaces/interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actors',
  imports: [RouterModule, CommonModule],
  template: `
    <section class="average__content new__index-content">
      <div class="content-left">
        <h3 class="trending">Top Billed Cast</h3>
        <div class="movies__wrapper">
          <div class="movies__wrapper-block add">
            @if (!cast || cast.length === 0) {
              <div class="text-black text-xl italic m-12 p-10">
                No cast information available yet...
              </div>
            } @else {
              @for (person of cast; track $index) {
                <div class="movies__wrapper-cart rounded-lg overflow-hidden">
                  <div class="wrapper_img">
                    <img
                      decoding="auto"
                      [routerLink]="['/persons', person.id]"
                      class="image !h-[200px] rounded-none pb-4"
                      [src]="
                        person?.profile_path
                          ? startUrl + person.profile_path
                          : '/icon-bg.svg'
                      "
                      alt="{{ person.name }}" />
                  </div>
                  <a [routerLink]="['/persons', person.id]">
                    <p>
                      <b
                        class="pl-2 duration-300 ease hover:text-gray-500 hover:underline hover:underline-offset-2"
                        >{{ person.name }}</b
                      >
                    </p>
                  </a>
                  <p class="pl-2 pb-2 text-sm text-gray-700">
                    {{ person.character ? person.character : 'unknown' }}
                  </p>
                </div>
              }
            }
            <div class="flex justify-center h-full items-center">
              @if (cast !== undefined && cast.length > 0) {
                <button
                  [routerLink]="['/cast', movieId]"
                  class="w-fit whitespace-nowrap text-md font-bold duration-200 ease hover:underline hover:underline-offset-2 hover:text-gray-500">
                  View more &#10230;
                </button>
              }
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
export class ActorsComponent {
  startUrl = 'https://image.tmdb.org/t/p/w500';
  @Input() cast: CastMember[] | undefined;
  @Input() movieId: number | undefined;

  ngOnInit() {
    console.log('cast', this.cast);
  }
}
