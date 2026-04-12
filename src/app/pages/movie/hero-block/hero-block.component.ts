import { Component, input, Input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RatingComponent } from '../rating/rating.component';
import { CrewMember, Genre, SingleMovie } from '../../../interfaces/interface';

@Component({
  selector: 'app-hero-block',
  imports: [RouterModule, CommonModule, RatingComponent],
  template: `
    <div class="inner__content new__index">
      <div
        [ngStyle]="{ 'background-image': image() }"
        class="background-movie">
        <div class="background-shadow"></div>
        <div class="content-movie">
          <img
            decoding="auto"
            *ngIf="!images().has(movie()!.id)"
            class="!w-[20%] !h-[200%] m-5 bg-gray-800"
            src="/placeholder.svg"
            alt="placeholder" />
          <img
            decoding="auto"
            class="main-poster transition-opacity duration-700 h-[29vw]"
            (load)="onLoad()"
            [class.hidden]="!images().has(movie()!.id)"
            [src]="url + (movie()?.poster_path || '')"
            [alt]="movie()?.title || ''" />
          <div class="text-content">
            <h1 class="text-4xl font-bold text-white-900 mb-1">
              {{ movie()?.title || movie()?.name }} ({{
                movie()?.release_date?.slice(0, 4)
                  ? movie()?.release_date?.slice(0, 4)
                  : movie()?.first_air_date?.slice(0, 4)
              }})
            </h1>
            <p class="text-gray-300 mb-3">
              {{
                movie()?.release_date
                  ? formatDate(movie()?.release_date)
                  : formatDate(movie()?.first_air_date)
              }}
              ● {{ getGenres(movie()?.genres) }} ●
              {{ minutesToTime(movie()?.runtime) }}
            </p>

            <div class="rating-block flex items-center mb-3">
              <!--Rating component start-->
              <app-rating [rat]="movie()"></app-rating>
              <!--Rating component end-->
              <div class="rating-name ml-2 mr-4 relative bottom-[5px]">
                <p>IMDB</p>
              </div>
            </div>

            <h3 class="italic text-gray-300">
              {{ movie()?.tagline }}
            </h3>

            <div>
              <a href="#" class="underline">Play trailer</a>
            </div>

            <h4 class="text-xl text-white-900 mb-2 mt-2">Overview</h4>
            <p class="w-[80%]">
              {{
                movie()?.overview
                  ? movie()?.overview
                  : 'Description will be added soon...'
              }}
            </p>
            <div class="flex mt-6 gap-20">
              @for (worker of crew; track $index) {
                <div class="direction">
                  <a
                    [routerLink]="['/persons', worker.id]"
                    class="font-bold text-md underline duration-300 easy hover:text-gray-300"
                    >{{ worker.name }}</a
                  >
                  <p>{{ worker.job }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class HeroBlockComponent {
  movie = input<SingleMovie | undefined>();
  image = input();
  @Input() crew: CrewMember[] | undefined;
  @Input() url: string | undefined;
  loadMoreClick = output<void>();
  images = input<Set<number>>(new Set());

  onLoad(): void {
    this.loadMoreClick.emit();
  }

   getGenres(item: Genre[] | undefined): string[] | string {
    if (item) {
      const genres = item.map(el => ' ' + el.name);
      return genres;
    } else {
      return 'Genres Unknown';
    }
  }

  minutesToTime(totalMinutes: number | undefined): string {
    if (totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const hh = hours.toString().padStart(2, '0');
      const mm = minutes.toString().padStart(2, '0');
      return `${hh}h ${mm}m`;
    } else {
      return 'Time unknown';
    }
  }

  formatDate(dateStr: string | undefined): string {
    if (dateStr) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } else {
      return 'Date unknown';
    }
  }
}
