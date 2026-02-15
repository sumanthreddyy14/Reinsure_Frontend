import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsurerDetail } from './reinsurer-detail';

describe('ReinsurerDetail', () => {
  let component: ReinsurerDetail;
  let fixture: ComponentFixture<ReinsurerDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReinsurerDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReinsurerDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
