import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCessionForm } from './risk-cession-form';

describe('RiskCessionForm', () => {
  let component: RiskCessionForm;
  let fixture: ComponentFixture<RiskCessionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskCessionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskCessionForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
