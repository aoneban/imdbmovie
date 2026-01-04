import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { VideoResponse } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class TrailerMovieService {
  private apiUrlStartMovie = 'https://api.themoviedb.org/3/movie/';
  private apiUrlStartSeries = 'https://api.themoviedb.org/3/tv/';
  private apiUrlEnd = '/videos?language=en-US';

  constructor(private http: HttpClient) {}

  getTrailersVideo(id: number): Observable<VideoResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<VideoResponse>(
      `${this.apiUrlStartMovie}${id}${this.apiUrlEnd}`,
      { headers }
    );
  }

  getTrailersSeries(id: number): Observable<VideoResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<VideoResponse>(
      `${this.apiUrlStartSeries}${id}${this.apiUrlEnd}`,
      { headers }
    );
  }
}
