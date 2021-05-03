import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const baseUrl = 'http://localhost:3000/contacts';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(private http: HttpClient) { }

  getAll(): any {
    return this.http.get(`${baseUrl}`, httpOptions);
  }

  create(data: any): any {
    return this.http.post(`${baseUrl}`, data, httpOptions)
  }

  update(id: any, data: any): any {
    return this.http.put(`${baseUrl}/${id}`, data, httpOptions);
  }

  delete(id: any): any {
    return this.http.delete(`${baseUrl}/${id}`, httpOptions);
  }
}
