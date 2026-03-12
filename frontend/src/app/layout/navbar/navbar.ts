import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ZardInputDirective } from '@/shared/components/input/input.directive';

@Component({
  selector: 'app-navbar',
  imports: [ZardInputDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch(term: string) {
    const search = term.trim();
    this.router.navigate(['/browse'], {
      queryParams: search ? { search } : {},
    });
  }
}
