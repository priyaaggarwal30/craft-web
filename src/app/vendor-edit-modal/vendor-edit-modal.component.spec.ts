import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorEditModalComponent } from './vendor-edit-modal.component';

describe('VendorEditModalComponent', () => {
  let component: VendorEditModalComponent;
  let fixture: ComponentFixture<VendorEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
