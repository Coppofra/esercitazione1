import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GradesService, Grade } from './grades.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App implements OnInit {
  protected readonly title = signal('frontend-view');
  grades: Grade[] = [];
  filteredGrades: Grade[] = [];
  searchName: string = '';

  constructor(private gradesService: GradesService) { }

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.gradesService.getGrades().subscribe(
      (data: Grade[]) => {
        this.grades = data;
        this.filterGrades();
      },
      (error) => console.error('Errore nel caricamento dei voti:', error)
    );
  }

  filterGrades() {
    if (this.searchName.trim() === '') {
      this.filteredGrades = this.grades;
    } else {
      this.filteredGrades = this.grades.filter(grade =>
        grade.student_name.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }
  }

  getGradeColor(grade: number): string {
    return grade < 6 ? 'red' : 'green';
  }
}
