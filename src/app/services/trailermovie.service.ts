import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VideoResponse } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class TrailerMovieService {
  private apiUrlStart = 'https://api.themoviedb.org/3/movie/';
  private apiUrlEnd = '/videos?language=en-US';

  constructor(private http: HttpClient) {}

  getTrailersVideo(id: number): Observable<VideoResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<VideoResponse>(
      `${this.apiUrlStart}${id}${this.apiUrlEnd}`,
      { headers }
    );
  }
}
