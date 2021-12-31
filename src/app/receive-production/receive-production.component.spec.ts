import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveProductionComponent } from './receive-production.component';

describe('ReceiveProductionComponent', () => {
  let component: ReceiveProductionComponent;
  let fixture: ComponentFixture<ReceiveProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
