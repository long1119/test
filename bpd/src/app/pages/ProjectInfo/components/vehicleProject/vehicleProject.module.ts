import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './vehicleProject.routing'

import { VehicleProject } from './vehicleProject.component';
import { ButtonModule, DataTableModule, DialogModule, DropdownModule, TabViewModule, RadioButtonModule, PaginatorModule, InputTextareaModule, CalendarModule, GrowlModule, ConfirmDialogModule, CheckboxModule } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';

import { PagesModule } from '../../../pages.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ButtonModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    TabViewModule,
    RadioButtonModule,
    PaginatorModule,
    InputTextareaModule,
    CalendarModule,
    GrowlModule,
    PagesModule,
    ConfirmDialogModule,
    CheckboxModule
  ],
  declarations: [
    VehicleProject
  ]
})
export class VehicleProjectModule {}