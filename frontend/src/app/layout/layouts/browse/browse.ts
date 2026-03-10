import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MasterSearch } from '@/features/search/master-search/master-search/master-search';
@Component({
  selector: 'app-browse',
  imports: [MasterSearch, RouterOutlet],
  templateUrl: './browse.html',
  styleUrl: './browse.css',
})
export class Browse {}
