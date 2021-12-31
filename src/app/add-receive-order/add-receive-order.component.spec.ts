import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReceiveOrderComponent } from './add-receive-order.component';

describe('AddReceiveOrderComponent', () => {
  let component: AddReceiveOrderComponent;
  let fixture: ComponentFixture<AddReceiveOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReceiveOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReceiveOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
