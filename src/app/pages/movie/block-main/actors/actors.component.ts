import { Component, input, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CastMember } from '../../../../interfaces/interface';
import { CommonModule } from '@angular/common';
import { TMDB } from '../../../../config/tmdb.config';

@Component({
  selector: 'app-actors',
  imports: [RouterModule, CommonModule],
  template: `
    <section class="average__content new__index-content">
      <h3 class="trending mb-[1rem]">Top Billed Cast</h3>
      <div class="movies__wrapper">
        <div class="movies__wrapper-block gap-[15px]">
          @if (!movieCast() || movieCast()?.length === 0) {
            <div class="text-black text-xl italic m-12 p-10">
              No cast information available yet...
            </div>
          } @else {
            @for (person of movieCast(); track $index) {
              @if(person.profile_path) {
                <div
                  class="movies__wrapper-cart rounded-lg overflow-hidden border border-gray-200 shadow-sm shadow-gray-300">
                  <div class="rounded-none w-auto min-h-[230px]">
                    <img
                      decoding="auto"
                      [routerLink]="['/persons', person.id]"
                      class="image h-[auto] rounded-none pb-4"
                      [ngClass]="{
                        'absolute mt-[50px]': !person?.profile_path,
                      }"
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
          }
          <div class="flex justify-center h-full items-center">
            @if (movieCast() !== undefined && movieCast()!.length > 0) {
              <button
                [routerLink]="['/cast', movieId()]"
                class="w-fit whitespace-nowrap text-md font-bold duration-200 ease hover:underline hover:underline-offset-2 hover:text-gray-500">
                View more &#10230;
              </button>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class ActorsComponent {
  startUrl = TMDB.imageBaseUrl;
  movieCast = input<CastMember[] | undefined>();
  movieId = input<number | undefined>();
}
