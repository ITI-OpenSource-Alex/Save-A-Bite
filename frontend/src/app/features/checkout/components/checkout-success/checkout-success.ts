import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '@/core/services/cart.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.css'
})
export class CheckoutSuccessComponent implements OnInit {
  private router = inject(Router);
  private cartService = inject(CartService);

  ngOnInit() {
this.cartService.clearCart();

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 4000);
  }
}