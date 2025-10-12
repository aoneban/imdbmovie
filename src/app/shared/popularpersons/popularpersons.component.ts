import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { PopPersonService } from '../../services/popperson.service';
import { Person } from '../../interfaces/interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-popularpersons',
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <div class="switcher-wrapper flex max-w-screen-xl mx-auto mt-4">
      <h3 class="trending">Most popular celebrities</h3>
    </div>
    <section class="movies__main bg-none">
      <div class="movies__wrapper">
        <div
          class="movies__wrapper-block add"
          [@listAnimation]="newData().length">
          <div
            class="movies__wrapper-cart"
            *ngFor="let person of newData()"
            [@fadeAnimation]>
            <div class="wrapper_img">
              <img
                decoding="async"
                [routerLink]="['/persons', person.id]"
                class="image"
                src="{{ startUrl + person.profile_path }}"
                alt="{{ person.name }}" />
            </div>
            <a [routerLink]="['/persons', person.id]">
              <p>{{ person.name }}</p>
            </a>
            <a>
              <p>
                {{
                  person.known_for[0].name !== undefined
                    ? person.known_for[0].name
                    : person.known_for[0].title
                }}
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>`,
  styleUrls: ['../../../styles.scss'],
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
export class PopularPersonsComponent implements OnInit {
  newData = signal<Person[]>([]);
  startUrl = 'https://image.tmdb.org/t/p/w500/';
  apiUrl = 'https://api.themoviedb.org/3/person/popular?language=en-US&page=1';

  constructor(private popPersonService: PopPersonService) {}

  ngOnInit(): void {
    this.popPersonService.getDataPopularPerson(this.apiUrl).subscribe(data => {
      this.newData.set(data.results);
    });
  }
}
