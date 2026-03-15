import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from "@angular/router";

interface Store {
    _id: string;
    name: string;
    description: string;
    ownerId: string;
    phone: string;
    email: string;
    logoUrl: string;
    avgRating: number;
}

@Component({
  selector: 'app-restaurants',
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './restaurants.html',
  styleUrl: './restaurants.css',
})
export class Restaurants implements OnInit {

  stores$!: Observable<Store[]>;
  private http = inject(HttpClient);
  private apiURL = 'http://localhost:3000/api/stores';

  ngOnInit() {
    this.stores$ = this.http.get<Store[]>(this.apiURL);
  }

}
