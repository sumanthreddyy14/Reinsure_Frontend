import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryForm } from './recovery-form';

describe('RecoveryForm', () => {
  let component: RecoveryForm;
  let fixture: ComponentFixture<RecoveryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
