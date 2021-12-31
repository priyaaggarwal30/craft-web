import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishGoodStockListComponent } from './finish-good-stock-list.component';

describe('FinishGoodStockListComponent', () => {
  let component: FinishGoodStockListComponent;
  let fixture: ComponentFixture<FinishGoodStockListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishGoodStockListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishGoodStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
