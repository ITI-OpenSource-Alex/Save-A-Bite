import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashDeals } from './flash-deals';

describe('FlashDeals', () => {
  let component: FlashDeals;
  let fixture: ComponentFixture<FlashDeals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashDeals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashDeals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
