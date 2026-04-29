import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryCard, Category } from '@/features/home/category-cards/category-card/category-card';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-categories-section',
  imports: [CategoryCard, RouterLink, AsyncPipe],
  templateUrl: './categories-section.html',
  styleUrl: './categories-section.css',
})
export class CategoriesSection implements OnInit {
  private http = inject(HttpClient);
  categories$!: Observable<Category[]>;

  ngOnInit() {
    this.categories$ = this.http
      .get<Category[]>('http://localhost:3000/api/category/list')
      .pipe(tap((res) => console.log(res)));
  }
}
