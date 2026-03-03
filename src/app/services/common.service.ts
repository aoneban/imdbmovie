import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReviewsResponse } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getCommonData(apiStart: string, apiEnd: string,id: number): Observable<ReviewsResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<ReviewsResponse>(`${apiStart}${id}${apiEnd}`, {
      headers,
    });
  }
}
