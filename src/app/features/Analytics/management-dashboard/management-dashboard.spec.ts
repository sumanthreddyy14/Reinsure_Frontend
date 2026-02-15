import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementDashboard } from './management-dashboard';

describe('ManagementDashboard', () => {
  let component: ManagementDashboard;
  let fixture: ComponentFixture<ManagementDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
