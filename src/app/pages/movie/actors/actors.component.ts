import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CastMember } from '../../../interfaces/interface';
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
            <div class="movies__wrapper-cart" *ngFor="let person of cast">
              <div class="wrapper_img">
                <img
                  decoding="async"
                  [routerLink]="['/persons', person.id]"
                  class="image"
                  src="{{ startUrl + person.profile_path }}"
                  alt="{{ person.name }}" />
              </div>
              <a [routerLink]="['/persons', person.id]">
                <p>{{ person.original_name }}</p>
              </a>
              <a>
                <p>
                  {{ person.character }}
                </p>
              </a>
            </div>
            <button>View more -></button>
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
      margin-left: 1vw;
      margin-top: 8rem;
      margin-bottom: 1rem;
    }

    .add {
      gap: 15px;
    }

    .movies__wrapper-cart {
      border: 1px solid lightgrey;
      padding: 10px;
    }
  `,
})
export class ActorsComponent {
  startUrl = 'https://image.tmdb.org/t/p/w500';
  @Input() cast: CastMember[] | undefined;
}
