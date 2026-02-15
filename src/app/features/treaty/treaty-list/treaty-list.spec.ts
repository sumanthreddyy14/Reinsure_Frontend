import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatyList } from './treaty-list';

describe('TreatyList', () => {
  let component: TreatyList;
  let fixture: ComponentFixture<TreatyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatyList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
