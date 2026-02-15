import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatyForm } from './treaty-form';

describe('TreatyForm', () => {
  let component: TreatyForm;
  let fixture: ComponentFixture<TreatyForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatyForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatyForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
