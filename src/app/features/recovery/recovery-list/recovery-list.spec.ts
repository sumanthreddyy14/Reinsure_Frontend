import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryList } from './recovery-list';

describe('RecoveryList', () => {
  let component: RecoveryList;
  let fixture: ComponentFixture<RecoveryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoveryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoveryList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
