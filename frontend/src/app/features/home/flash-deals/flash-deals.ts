import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { FlashDeals } from '@/core/services/flash-deals';
import { AsyncPipe } from '@angular/common';
import { map, tap } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-flash-deals',
  imports: [ProductCardComponent, AsyncPipe],
  templateUrl: './flash-deals.html',
})
export class FlashDealsComponent {
  private flashDealsService = inject(FlashDeals);
  private cdr = inject(ChangeDetectorRef);
  deals$ = this.flashDealsService.getFlashDeals().pipe(
    map((res) => res.products),
    tap((data) => {
      // 1. Log the data exactly when it returns
      console.log('✅ Flash Deals returned:', data);

      // 2. Force change detection manually (though AsyncPipe should handle this)
      this.cdr.detectChanges();
    }),
  );
}
