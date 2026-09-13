import { Component, computed, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopPersonService } from '../../services/popperson.service';
import { Person } from '../../interfaces/interface';
import { TMDB } from '../../config/tmdb.config';

@Component({
  selector: 'app-page-persons',
  imports: [CommonModule, RouterModule],
  template: `
    <section>
      <div *ngIf="!isLoading()" class="preloader">
        <div class="loader"></div>
      </div>
      <div
        *ngIf="isLoading()"
        class="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:w-[90%] sm:px-6 lg:w-[80%] lg:px-8">
        <h1 class="mb-6 break-words text-2xl font-bold sm:text-3xl lg:text-4xl">
          Popular Persons
        </h1>
        <div
          class="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          @for (person of personData(); track person.id) {
            <div
              class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200">
              <div class="relative aspect-[2/3] w-full bg-gray-300">
                <img
                  decoding="async"
                  *ngIf="!loadedImages.has(person.id)"
                  class="absolute inset-0 h-full w-full animate-pulse object-cover"
                  src="/placeholder.svg"
                  alt=""
                  aria-hidden="true" />
                <img
                  decoding="auto"
                  class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                  [src]="
                    person.profile_path
                      ? startUrl + person.profile_path
                      : '/placeholder.svg'
                  "
                  (load)="onImageLoad(person.id)"
                  [class.opacity-0]="!loadedImages.has(person.id)"
                  alt="{{ person.name }}" />
              </div>
              <h3 class="break-words p-3 font-bold leading-snug sm:p-4">
                <a [routerLink]="['/persons', person.id]">
                  {{ person.name }}
                </a>
              </h3>
            </div>
          }
        </div>
        <div class="mb-10 mt-8 flex justify-center">
          <button
            type="button"
            (click)="loadMore()"
            class="min-h-11 w-full rounded bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto sm:min-w-48">
            Load more...
          </button>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
})
export class PagePersonsComponent {
  url = TMDB.urlPerson;
  startUrl = TMDB.imageBaseUrl;
  page = 1;
  totalPages = 0;
  personData = signal<Person[] | undefined>(undefined);
  loadedImages = new Set<number>();

  constructor(private popPersonService: PopPersonService) {
    effect(() => {
      this.popPersonService.getDataPopularPerson(this.url, this.page).subscribe(
        data => {
          this.personData.set(data.results);
          if (data.total_pages) {
            this.totalPages = data.total_pages;
          }
        },
        error => {
          console.error('Error fetching data: ', error);
        }
      );
    });
  }

  isLoading = computed(() => this.personData());

  onImageLoad(id: number) {
    this.loadedImages.add(id);
  }

  goTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadMore() {
    this.page += 1;
    this.popPersonService.getDataPopularPerson(this.url, this.page).subscribe(
      data => {
        this.personData.update(prev => [...(prev ?? []), ...data.results]);
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }
}
