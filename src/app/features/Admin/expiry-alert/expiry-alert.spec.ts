import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryAlert } from './expiry-alert';

describe('ExpiryAlert', () => {
  let component: ExpiryAlert;
  let fixture: ComponentFixture<ExpiryAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiryAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiryAlert);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
