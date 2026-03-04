import { Component } from '@angular/core';
import { ZardInputDirective } from '@/shared/components/input/input.directive';

@Component({
  selector: 'app-navbar',
  imports: [ZardInputDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
