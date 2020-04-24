import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BILLING_ADDRESS } from '../../address-type';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { personalDataValid } from '../../validators/validators';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  orderData: FormGroup;
  billingAddressHeader = BILLING_ADDRESS;
  shouldAddBillingAddress;

  constructor() {}

  ngOnInit() {
    this.orderData = new FormGroup({
      personalData: new FormControl(''),
      addressData: new FormControl(''),
      isShippingAddressBillingAddress: new FormControl(false),
    });
  }

  onCheckboxChange(change: MatCheckboxChange) {
    this.shouldAddBillingAddress = change.checked;
    if (this.shouldAddBillingAddress) {
      this.addBillingAddress();
    } else {
      this.removeBillingAddress();
    }
  }

  order(): void {
    console.log(this.orderData.getRawValue());
  }

  private addBillingAddress() {
    this.orderData.addControl('billingAddressData', new FormControl());
  }

  private removeBillingAddress() {
    this.orderData.removeControl('billingAddressData');
  }
}
