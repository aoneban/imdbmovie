import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MediaTypeService {
  mediaType = signal<string | null>(null);

  setMediaType(type: string | null) {
    this.mediaType.set(type);
  }
}
