import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveOrderModalComponent } from './receive-order-modal.component';

describe('ReceiveOrderModalComponent', () => {
  let component: ReceiveOrderModalComponent;
  let fixture: ComponentFixture<ReceiveOrderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveOrderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
