import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopPersonService } from '../../services/popperson.service';
import { Person } from '../../interfaces/interface';

@Component({
  selector: 'app-page-persons',
  imports: [CommonModule, RouterModule],
  template: `
    <section>
      <div *ngIf="isLoading" class="preloader">
        <div class="loader"></div>
      </div>
      <div *ngIf="!isLoading">
        <h1 class="w-[78%] mx-auto mt-6 text-4xl font-bold text-white-900">
          Popular Persons
        </h1>
        <div class="flex w-[80%] mx-auto flex-wrap justify-center">
          @for (person of personData(); track $index) {
            <div class="relative w-[20%] mt-5">
              <div
                class="m-5 h-[100%] rounded-xl border border-gray-200 overflow-hidden">
                <img
                  *ngIf="!loadedImages.has(person.id)"
                  class="absolute inset-0 w-[80%] h-[80%] p-5 m-5 object-cover bg-gray-300"
                  src="/placeholder.svg"
                  alt="placeholder" />
                <img
                  decoding="auto"
                  class="w-[auto] transition-opacity duration-700 rounded-none"
                  [src]="
                    person.profile_path
                      ? startUrl + person.profile_path
                      : '/placeholder.svg'
                  "
                  (load)="onImageLoad(person.id)"
                  [class.opacity-0]="!loadedImages.has(person.id)"
                  alt="{{ person.name }}" />
                <h3
                  class="cursor-pointer font-bold relative top-4 left-3"
                  [routerLink]="['/persons', person.id]">
                  {{ person.name }}
                </h3>
              </div>
            </div>
          }
          <div class="mt-20 mb-10">
            <button
              (click)="loadMore()"
              class="px-1 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed">
              Load more...
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class PagePersonsComponent {
  url = 'https://api.themoviedb.org/3/person/popular?language=en-US&page=';
  startUrl = 'https://image.tmdb.org/t/p/w500';
  page = 1;
  totalPages: number = 0;
  isLoading = false;
  personData = signal<Person[] | undefined>(undefined);
  loadedImages = new Set<number>();

  constructor(private popPersonService: PopPersonService) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (this.personData !== undefined) {
      this.fetchData(this.page);
    }
  }

  fetchData(page: number): void {
    this.popPersonService.getDataPopularPerson(this.url, page).subscribe(
      data => {
        this.personData.set(data.results);
        if (data.total_pages) {
          this.totalPages = data.total_pages;
        }
        this.isLoading = false;
      },
      error => {
        console.error('Error fetching data: ', error);
      }
    );
  }

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
