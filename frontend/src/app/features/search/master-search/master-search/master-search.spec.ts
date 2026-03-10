import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSearch } from './master-search';

describe('MasterSearch', () => {
  let component: MasterSearch;
  let fixture: ComponentFixture<MasterSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(MasterSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
