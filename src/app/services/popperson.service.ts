import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponsePerson } from '../interfaces/interface';

@Injectable({
  providedIn: 'root',
})
export class PopPersonService {
  constructor(private http: HttpClient) {}

  getDataPopularPerson(apiUrl: string): Observable<ApiResponsePerson> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${environment.apiKey}`,
      Accept: 'application/json',
    });
    return this.http.get<ApiResponsePerson>(apiUrl, { headers });
  }
}
