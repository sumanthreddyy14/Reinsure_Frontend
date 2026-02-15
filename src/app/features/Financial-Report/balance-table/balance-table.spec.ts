import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTable } from './balance-table';

describe('BalanceTable', () => {
  let component: BalanceTable;
  let fixture: ComponentFixture<BalanceTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
