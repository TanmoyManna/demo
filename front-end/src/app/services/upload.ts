import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Upload {

  private apiUrl:string = 'http://localhost:8000/interview/api/v1/';

  constructor(private http:HttpClient){

  }

  uploadImage(endpoint:string,data:FormData):Observable<any>{
    return this.http.post(`${this.apiUrl}${endpoint}`,data).pipe(delay(2000))
  }
  
  getFiles(endpoint:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}${endpoint}`); // change the URL as needed
  }
}
