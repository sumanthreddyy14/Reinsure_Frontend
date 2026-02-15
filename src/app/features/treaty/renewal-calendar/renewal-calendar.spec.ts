import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalCalendar } from './renewal-calendar';

describe('RenewalCalendar', () => {
  let component: RenewalCalendar;
  let fixture: ComponentFixture<RenewalCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenewalCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalCalendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
