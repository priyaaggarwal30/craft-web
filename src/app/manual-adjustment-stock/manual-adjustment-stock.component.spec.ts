import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualAdjustmentStockComponent } from './manual-adjustment-stock.component';

describe('ManualAdjustmentStockComponent', () => {
  let component: ManualAdjustmentStockComponent;
  let fixture: ComponentFixture<ManualAdjustmentStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualAdjustmentStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualAdjustmentStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
