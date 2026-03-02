import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { HeroSlider } from './layout/hero-slider/hero-slider';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, HeroSlider],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('gawafa_store');
}
