import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReviewItem } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewDataService {
  private contentSubject = new BehaviorSubject<ReviewItem | null>(null);
  content$ = this.contentSubject.asObservable();

  setContent(data: ReviewItem) {
    this.contentSubject.next(data);
  }

  getContent(): ReviewItem | null {
    return this.contentSubject.value;
  }
}
