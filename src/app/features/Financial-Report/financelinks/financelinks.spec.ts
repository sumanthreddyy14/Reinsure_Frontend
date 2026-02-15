import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Financelinks } from './financelinks';

describe('Financelinks', () => {
  let component: Financelinks;
  let fixture: ComponentFixture<Financelinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Financelinks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Financelinks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
