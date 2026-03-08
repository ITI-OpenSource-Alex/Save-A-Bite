import { Component, input } from '@angular/core';
export interface EcoStat {
  icon: string;
  value: string;
  label: string;
  iconColor: string;
}
@Component({
  selector: 'app-eco-card',
  imports: [],
  templateUrl: './eco-card.html',
  styleUrl: './eco-card.css',
})
export class EcoCard {
  stat = input.required<EcoStat>();
}
