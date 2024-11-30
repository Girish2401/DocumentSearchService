import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private api_url: string = "http://localhost:3000"

  constructor(private http: HttpClient) { }

  getAllFiles(searchValue = '') {
    let params = new HttpParams();
    params = params.set('q', searchValue)
    return this.http.get(`${this.api_url}/api/search`, { params });
  }
}