import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveOrderListComponent } from './receive-order-list.component';

describe('ReceiveOrderListComponent', () => {
  let component: ReceiveOrderListComponent;
  let fixture: ComponentFixture<ReceiveOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
