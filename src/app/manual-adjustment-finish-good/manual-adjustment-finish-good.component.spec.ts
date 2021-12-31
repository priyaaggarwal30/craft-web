import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAdjustmentFinishGoodComponent } from './manual-adjustment-finish-good.component';

describe('ManualAdjustmentFinishGoodComponent', () => {
  let component: ManualAdjustmentFinishGoodComponent;
  let fixture: ComponentFixture<ManualAdjustmentFinishGoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualAdjustmentFinishGoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualAdjustmentFinishGoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
