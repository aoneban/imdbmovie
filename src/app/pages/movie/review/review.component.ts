import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewItem, ReviewsResponse } from '../../../interfaces/interface';
import { RouterModule } from '@angular/router';
import { ReviewDataService } from '../../../services/review-data.service';

@Component({
  selector: 'app-review',
  imports: [CommonModule, RouterModule],
  template: `
    <section>
      <div
        *ngIf="review"
        class="mt-4 mb-4 p-6 border border-gray-300 rounded-[10px]">
        <div class="flex">
          <img
            decoding="auto"
            [src]="getAvatar(item)"
            class="w-11 h-11 rounded-full"
            alt="{{ review.author }}" />

          <div class="ml-4 mb-4 mt-[-5px]">
            <a
              [routerLink]="['/single-review', allReviews?.id, review.id]"
              (click)="sendReview(review)"
              class="duration-200 easy font-bold text-gray-800 text-xl underline underline-offset-2 hover:text-gray-500"
              >A review by {{ review.author }}</a
            >
            <p class="text-sm text-gray-600">
              @if (review.author_details.rating) {
                <span>Rating {{ review.author_details.rating }}/10 </span>
              }
              Written by
              {{ review.author }} on
              {{ review.created_at.slice(0, 10) }}
            </p>
          </div>
        </div>

        <p class="whitespace-pre-line">
          {{ reviewContent() }}
          <ng-container *ngIf="isTruncated">
            <a
              [routerLink]="['/single-review', allReviews?.id, review.id]"
              (click)="sendReview(review)"
              class="duration-200 easy underline underline-offset-4 text-blue-400 font-bold hover:text-blue-500">
              Read more
            </a>
          </ng-container>
        </p>
      </div>
    </section>
  `,
  styles: ``,
})
export class ReviewComponent {
  startUrl = 'https://image.tmdb.org/t/p/w200';
  @Input() review!: ReviewItem | undefined;
  @Input() allReviews!: ReviewsResponse | undefined;
  maxLength: number = 300;
  item: number = 0;

  constructor(private reviewDataService: ReviewDataService) {}

  ngOnInit(): void {}

  reviewContent() {
    const text = this.review?.content ?? '';
    return text.length > this.maxLength
      ? text.slice(0, this.maxLength) + '...'
      : text;
  }

  get isTruncated() {
    const text = this.review?.content ?? '';
    return text.length > this.maxLength;
  }

  sendReview(item: ReviewItem): void {
    if (item) {
      this.reviewDataService.setContent(item);
    }
  }

  getAvatar(item: number) {
    const path = this.review?.author_details?.avatar_path;

    if (!path) {
      return './user_icon.png';
    }
    if (path.startsWith('/https')) {
      return path.slice(1);
    }
    return this.startUrl + path;
  }

  saveReviewData(reviewItem: ReviewItem) {
    this.reviewDataService.setContent({
      content: reviewItem?.content,
      author: reviewItem?.author,
      id: reviewItem?.id,
      updated_at: reviewItem?.updated_at,
      url: reviewItem?.url,
      author_details: reviewItem?.author_details,
      created_at: reviewItem?.created_at,
    });
  }
}
