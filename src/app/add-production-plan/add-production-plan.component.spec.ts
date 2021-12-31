import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductionPlanComponent } from './add-production-plan.component';

describe('AddProductionPlanComponent', () => {
  let component: AddProductionPlanComponent;
  let fixture: ComponentFixture<AddProductionPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductionPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductionPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
