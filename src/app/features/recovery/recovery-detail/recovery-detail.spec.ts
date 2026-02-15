import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryDetail } from './recovery-detail';

describe('RecoveryDetail', () => {
  let component: RecoveryDetail;
  let fixture: ComponentFixture<RecoveryDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
