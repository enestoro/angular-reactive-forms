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
    /* RC: the thing below is somehow mix-up of different concepts. From what i see in the docs, this should be used to introduce a new custom validator directive: https://blog.thoughtram.io/angular/2016/03/14/custom-validators-in-angular-2.html
    It indeed works but there are some things i do not like:
    1. you end up with a control which is a validator at the same time, sounds not clean, isn't it?
    2. you have to implement 'validate' function, which takes AbstractControl as an argument, which you even do not use, imho this is a signal that you are using Validator interface in a wrong spot
    3. I would rather do it other way to keep things "cleaner" and make it more re-usable:
      - i would remove Validator interface from this class and from address data
      - if you want to tell the parent form that the value of this inner-form is invalid, just implement imperative ValidatorFn, and connect it in the parent form for this control (https://alligator.io/angular/reactive-forms-custom-validator/)

    */
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
          validators: [Validators.required, Validators.email] // RC: you are missing error message for email validation
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
