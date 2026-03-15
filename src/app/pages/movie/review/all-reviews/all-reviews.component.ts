import { Component } from '@angular/core';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ReviewItem, ReviewsResponse } from '../../../../interfaces/interface';
import { MediaTypeService } from '../../../../services/media-type.service';
import { ReviewComponent } from '../review.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-reviews',
  imports: [NavbarComponent, ReviewComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <section>
      <div class="w-[80%] mx-auto">
        <app-review
          *ngFor="let item of allReviews?.results"
          [review]="item"
          [allReviews]="allReviews"></app-review>
      </div>
    </section>
  `,
  styles: ``,
})
export class AllReviewsComponent {
  movieId: number | undefined;
  apiMovie = 'https://api.themoviedb.org/3/movie/';
  apiReviewEnd = '/reviews?language=en-US&page=1';
  apiUrlEnd = '?language=en-US';
  apiTv = 'https://api.themoviedb.org/3/tv/';
  allReviews: ReviewsResponse | undefined;
  type: string | null;

  constructor(
    private route: ActivatedRoute,
    private commonService: CommonService,
    private mediaTypeService: MediaTypeService
  ) {
    this.type = this.mediaTypeService.getMediaType();
  }

  ngOnInit() {
    this.movieId = Number(this.route.snapshot.params['id']);
    this.fetchReviews();
    console.log('Id:', this.movieId);
  }

  fetchReviews() {
    this.commonService
      .getCommonData(
        this.type === 'movie' ? this.apiMovie : this.apiTv,
        this.apiReviewEnd,
        Number(this.movieId)
      )
      .subscribe(
        data => {
          this.allReviews = data;
        },
        error => {
          console.error('Error fetching data: ', error);
        }
      );
  }
}
