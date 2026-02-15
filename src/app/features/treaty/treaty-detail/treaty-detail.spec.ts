import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatyDetail } from './treaty-detail';

describe('TreatyDetail', () => {
  let component: TreatyDetail;
  let fixture: ComponentFixture<TreatyDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatyDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatyDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
