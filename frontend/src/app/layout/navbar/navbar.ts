import { Component } from '@angular/core';
import { ZardInputDirective } from '@/shared/components/input/input.directive';
import { LucideAngularModule, Bell, ShoppingCart } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  imports: [ZardInputDirective, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen = false;
  protected readonly bellIcon = Bell;
  protected readonly shoppingCartIcon = ShoppingCart;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
