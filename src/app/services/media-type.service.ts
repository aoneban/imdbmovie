import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaTypeService {
  private mediaTypeSubject = new BehaviorSubject<string | null>(null);

  mediaType$ = this.mediaTypeSubject.asObservable();

  setMediaType(type: string) {
    localStorage.setItem('media_type', type); 
    this.mediaTypeSubject.next(type); 
  }

  getMediaType(): string | null {
    return localStorage.getItem('media_type');
  }
}
