import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransactionDetailComponent } from './stock-transaction-detail.component';

describe('StockTransactionDetailComponent', () => {
  let component: StockTransactionDetailComponent;
  let fixture: ComponentFixture<StockTransactionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransactionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransactionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
