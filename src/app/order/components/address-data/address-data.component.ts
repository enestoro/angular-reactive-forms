import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { BILLING_ADDRESS, SHIPPING_ADDRESS } from '../../address-type';

@Component({
  selector: 'app-address-data',
  templateUrl: './address-data.component.html',
  styleUrls: ['./address-data.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressDataComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressDataComponent),
      multi: true,
    },
  ],
})
export class AddressDataComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  @Input()
  addressType: string;
  addressData: FormGroup;
  countries = ['Germany', 'Great Britain', 'Italy', 'Poland'];
  private destroy$ = new Subject<void>();

  onTouched: () => void = () => {};
  onChange: (value: any) => void = () => {};

  get street(): AbstractControl {
    return this.addressData && this.addressData.get('street');
  }

  get houseNo(): AbstractControl {
    return this.addressData && this.addressData.get('houseNo');
  }

  get zipCode(): AbstractControl {
    return this.addressData && this.addressData.get('zipCode');
  }

  get city(): AbstractControl {
    return this.addressData && this.addressData.get('city');
  }

  get country(): AbstractControl {
    return this.addressData && this.addressData.get('country');
  }

  constructor() {}

  ngOnInit() {
    this.addressData = new FormGroup(
      {
        street: new FormControl('', {
          validators: Validators.required,
        }),
        houseNo: new FormControl('', {
          validators: [Validators.required],
        }),
        zipCode: new FormControl('', {
          validators: [Validators.required],
        }),
        city: new FormControl('', {
          validators: [Validators.required],
        }),
        country: new FormControl('', {
          validators: [Validators.required],
        }),
      },
      { updateOn: 'blur' } // RC: this is ok only if you want validation on blur, you can't make validation to "explode" on submit button click with it 
    );

    this.addressData.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val) => {
      this.onChange(val);
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.addressData.valid ? null : { invalidForm: 'personal data invalid' };
  }

  writeValue(obj: any): void {
    if (obj) {
      this.addressData.patchValue(obj, { emitEvent: false });
    } else {
      this.addressData.reset({ emitEvent: false });
    }
  }

  getAddressHeader(): string {
    const header = {
      [SHIPPING_ADDRESS]: 'Shipping Address',
      [BILLING_ADDRESS]: 'Billing Address',
    };
    return header[this.addressType] || header[SHIPPING_ADDRESS];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
