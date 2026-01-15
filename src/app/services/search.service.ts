import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieSearchResponse } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl1 = 'https://api.themoviedb.org/3/search/movie?query=';
  private apiUrl2 = '&include_adult=false&language=en-US&page=';

  constructor(private http: HttpClient) { }

  getDataMovie(text: string, page: number): Observable<MovieSearchResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<MovieSearchResponse>(
      `${this.apiUrl1}${text}${this.apiUrl2}${page}`,
      { headers }
    );
  }
}
