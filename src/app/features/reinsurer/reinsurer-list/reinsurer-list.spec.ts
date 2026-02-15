import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReinsurerList } from './reinsurer-list';

describe('ReinsurerList', () => {
  let component: ReinsurerList;
  let fixture: ComponentFixture<ReinsurerList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReinsurerList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReinsurerList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
