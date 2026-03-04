import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoSection } from './eco-section';

describe('EcoSection', () => {
  let component: EcoSection;
  let fixture: ComponentFixture<EcoSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
