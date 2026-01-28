import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Grade {
  id: number;
  student_name: string;
  subject: string;
  grade: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private apiUrl = 'http://localhost:5000/grades';

  constructor(private http: HttpClient) { }

  getGrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(this.apiUrl);
  }
}
