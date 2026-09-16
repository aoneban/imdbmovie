import {
  Component,
  ChangeDetectionStrategy,
  signal,
  effect,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { PopPersonService } from '../../../../services/popperson.service';
import { Person } from '../../../../interfaces/interface';
import { RouterModule } from '@angular/router';
import { TMDB } from '../../../../config/tmdb.config';

@Component({
  selector: 'app-popularpersons',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="persons-section">
      <h3 class="persons-heading">Most popular celebrities</h3>
      <div class="persons-content movies__wrapper">
        <div class="persons-carousel" [@listAnimation]="newData().length">
          <article
            class="persons-card"
            *ngFor="let person of newData()"
            [@fadeAnimation]>
            <a class="persons-portrait" [routerLink]="['/persons', person.id]">
              <img
                decoding="async"
                [src]="
                  person.profile_path
                    ? startUrl + person.profile_path
                    : '/icon-bg.svg'
                "
                [alt]="person.name" />
            </a>
            <a class="persons-name" [routerLink]="['/persons', person.id]">
              {{ person.name }}
            </a>
            <p class="persons-credit" *ngIf="person.known_for.length">
              {{ person.known_for[0].name || person.known_for[0].title }}
            </p>
          </article>
        </div>
      </div>
    </section>
  `,
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms 1000ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms 1000ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PopularPersonsComponent {
  newData = signal<Person[]>([]);
  startUrl = TMDB.imageBaseUrl;

  constructor(private popPersonService: PopPersonService) {
    effect(() => {
      this.popPersonService
        .getDataPopularPerson(TMDB.urlPerson)
        .subscribe(data => {
          this.newData.set(data.results);
        });
    });
  }
}
