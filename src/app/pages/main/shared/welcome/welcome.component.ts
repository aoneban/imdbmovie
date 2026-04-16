import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrendingService } from '../../../../services/trending.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TMDB } from '../../../../config/tmdb.config';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="inner__content new__index">
      <div
        [ngStyle]="{ 'background-image': 'url(' + imgUrl + ')' }"
        class="background">
        <div class="greetings">
          <h2 class="welcome">Welcome</h2>
          <p class="motto">
            Millions of movies, TV shows and people to discover. Explore now.
          </p>
          <div class="search-container">
            <input
              type="text"
              placeholder="Search for a movie, TV show, person..."
              class="search-input"
              [(ngModel)]="userInput"
              (keyup.enter)="searchButton.click()" />
            <button
              #searchButton
              class="search-button"
              [routerLink]="['/search']"
              [queryParams]="{ query: userInput }">
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class WelcomeComponent implements OnInit {
  apiUrl1 = TMDB.apiTrends;
  startUrl = TMDB.imageMiddleUrl;
  imgUrl = '';
  userInput: string | undefined;

  constructor(private trendingService: TrendingService) {}

  ngOnInit() {
    this.trendingService.getTrendingDataMovies(this.apiUrl1).subscribe(
      data => {
        const random = this.getRandomNumber();
        this.imgUrl = this.startUrl + data.results[random].backdrop_path;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getRandomNumber() {
    return Math.floor(Math.random() * 20);
  }
}
