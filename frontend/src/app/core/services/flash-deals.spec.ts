import { TestBed } from '@angular/core/testing';

import { FlashDeals } from './flash-deals';

describe('FlashDeals', () => {
  let service: FlashDeals;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashDeals);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
