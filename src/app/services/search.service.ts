import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieSearchResponse } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) { }

  getDataMovie(linkOne: string, linkTwo: string, text: string, page: number): Observable<MovieSearchResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<MovieSearchResponse>(
      `${linkOne}${text}${linkTwo}${page}`,
      { headers }
    );
  }
}
