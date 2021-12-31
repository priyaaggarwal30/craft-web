import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrderWebComponent } from './add-order-web.component';

describe('AddOrderWebComponent', () => {
  let component: AddOrderWebComponent;
  let fixture: ComponentFixture<AddOrderWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
