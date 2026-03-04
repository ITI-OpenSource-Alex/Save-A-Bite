import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoCard } from './eco-card';

describe('EcoCard', () => {
  let component: EcoCard;
  let fixture: ComponentFixture<EcoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
