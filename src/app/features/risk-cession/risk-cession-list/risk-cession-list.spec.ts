import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCessionList } from './risk-cession-list';

describe('RiskCessionList', () => {
  let component: RiskCessionList;
  let fixture: ComponentFixture<RiskCessionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskCessionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskCessionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
