import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDataComponent } from './address-data.component';

describe('AddressDataComponent', () => {
  let component: AddressDataComponent;
  let fixture: ComponentFixture<AddressDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressDataComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
