import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementTimeline } from './settlement-timeline';

describe('SettlementTimeline', () => {
  let component: SettlementTimeline;
  let fixture: ComponentFixture<SettlementTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettlementTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettlementTimeline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
