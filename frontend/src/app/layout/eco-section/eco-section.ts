import { EcoCard, EcoStat } from '@/features/home/eco-cards/eco-card/eco-card';
import { Component } from '@angular/core';
@Component({
  selector: 'app-eco-section',
  imports: [EcoCard],
  templateUrl: './eco-section.html',
  styleUrl: './eco-section.css',
})
export class EcoSection {
  ecoStats: EcoStat[] = [
    {
      icon: 'fa-solid fa-leaf',
      iconColor: 'text-green-600',
      value: '2,400 kg',
      label: 'Food Saved This Month',
    },
    {
      icon: 'fa-solid fa-arrow-trend-down',
      iconColor: 'text-orange-400',
      value: '$48,000',
      label: 'Saved by Customers',
    },
    {
      icon: 'fa-solid fa-users',
      iconColor: 'text-emerald-600',
      value: '5,200+',
      label: 'Active Users',
    },
  ];
}
