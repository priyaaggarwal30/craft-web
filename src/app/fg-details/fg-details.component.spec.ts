import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FGDETAILSComponent } from './fg-details.component';

describe('FGDETAILSComponent', () => {
  let component: FGDETAILSComponent;
  let fixture: ComponentFixture<FGDETAILSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FGDETAILSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FGDETAILSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
