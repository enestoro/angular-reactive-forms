import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFormComponent } from './pages/order-form/order-form.component';
import { PersonalDataComponent } from './components/personal-data/personal-data.component';
import { AddressDataComponent } from './components/address-data/address-data.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [OrderFormComponent, PersonalDataComponent, AddressDataComponent],
  imports: [CommonModule, MaterialModule],
  exports: [OrderFormComponent],
})
export class OrderModule {}
