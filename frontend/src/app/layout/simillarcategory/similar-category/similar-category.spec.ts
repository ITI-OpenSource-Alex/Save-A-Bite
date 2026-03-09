import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarCategory } from './similar-category';

describe('SimilarCategory', () => {
  let component: SimilarCategory;
  let fixture: ComponentFixture<SimilarCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimilarCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimilarCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
