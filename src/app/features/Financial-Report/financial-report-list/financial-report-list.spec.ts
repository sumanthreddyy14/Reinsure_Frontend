import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialReportList } from './financial-report-list';

describe('FinancialReportList', () => {
  let component: FinancialReportList;
  let fixture: ComponentFixture<FinancialReportList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialReportList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialReportList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
