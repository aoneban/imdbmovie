import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReviewItem,
  ReviewsResponse,
} from '../../../interfaces/interface';
import { RouterModule } from '@angular/router';
import { ReviewDataService } from '../../../services/review-data.service';

@Component({
  selector: 'app-review',
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="review" class="mt-4 p-6 border border-gray-300 rounded-[10px]">
      <div class="flex">
        <img
          decoding="auto"
          [src]="getAvatar(item)"
          class="w-11 h-11 rounded-full"
          alt="{{ review[item]?.author }}" />

        <div class="ml-4 mb-4 mt-[-5px]">
          <a
            [routerLink]="['/single-review', all?.id, review[item]?.id]"
            (click)="sendReview(review[item])"
            class="font-bold text-gray-800 text-xl underline underline-offset-2"
            >A review by {{ review[item]?.author }}</a
          >
          <p class="text-sm text-gray-600">
            Rating {{ review[item]?.author_details?.rating }}/10 Written by
            {{ review[item]?.author }} on
            {{ review[item]?.created_at?.slice(0, 10) }}
          </p>
        </div>
      </div>

      <p class="whitespace-pre-line">
        {{ reviewContent() }}
        <ng-container *ngIf="isTruncated">
          <a
            [href]="review[0]?.url"
            target="_blank"
            class="text-blue-400 underline ml-1">
            Read more...
          </a>
        </ng-container>
      </p>
    </div>
  `,
  styles: ``,
})
export class ReviewComponent {
  startUrl = 'https://image.tmdb.org/t/p/w200';
  @Input() review!: ReviewItem[] | undefined;
  @Input() all!: ReviewsResponse | undefined;
  maxLength: number = 300;
  item: number = 0;

  constructor(private reviewDataService: ReviewDataService) {}

  ngOnInit(): void {
    this.item = this.randomReview();
  }

  reviewContent() {
    const text = this.review?.[this.item]?.content ?? '';
    return text.length > this.maxLength
      ? text.slice(0, this.maxLength) + '...'
      : text;
  }

  get isTruncated() {
    const text = this.review?.[this.item]?.content ?? '';
    return text.length > this.maxLength;
  }

  randomReview(): number {
    let len = this.review?.length;

    if (len) {
      return Math.floor(Math.random() * len);
    }
    return 0;
  }

  sendReview(item: ReviewItem): void {
    if (item) {
      this.reviewDataService.setContent(item);
    }
  }

  getAvatar(item: number) {
    const path = this.review?.[item]?.author_details?.avatar_path;

    if (!path) {
      return './placeholder.svg';
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
      created_at: reviewItem?.created_at
    });
  }
}
