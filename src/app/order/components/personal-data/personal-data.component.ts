import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EmailsValidationErrorStateMatcher } from '../../validation/validation';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonalDataComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PersonalDataComponent),
      multi: true
    }
  ]
})
export class PersonalDataComponent implements OnInit, OnDestroy, ControlValueAccessor, Validator {
  personalData: FormGroup;
  emailsValidationErrorStateMatcher = new EmailsValidationErrorStateMatcher();
  private destroy$ = new Subject<void>();

  onTouched: () => void = () => {};
  onChange: (value: any) => void = () => {};

  get firstName(): AbstractControl {
    return this.personalData && this.personalData.get('firstName');
  }

  get surname(): AbstractControl {
    return this.personalData && this.personalData.get('surname');
  }

  get email(): AbstractControl {
    return this.personalData && this.personalData.get('email');
  }

  get repeatEmail(): AbstractControl {
    return this.personalData && this.personalData.get('repeatEmail');
  }

  constructor() {}

  ngOnInit() {
    this.personalData = new FormGroup(
      {
        firstName: new FormControl('', {
          validators: Validators.required
        }),
        surname: new FormControl('', {
          validators: [Validators.required]
        }),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email]
        }),
        repeatEmail: new FormControl('', {
          validators: [Validators.required, Validators.email]
        })
      },
      { validators: [this.checkEmails], updateOn: 'blur' }
    );

    this.personalData.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(val => {
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
    return this.personalData.valid ? null : { invalidForm: 'personal data invalid' };
  }

  writeValue(obj: any): void {
    if (obj) {
      this.personalData.patchValue(obj, { emitEvent: false });
    } else {
      this.personalData.reset({ emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

  private checkEmails(formGroup: FormGroup) {
    const email = formGroup.get('email').value;
    const repeatEmail = formGroup.get('repeatEmail').value;
    return email !== repeatEmail ? { sameEmails: true } : null;
  }
}
