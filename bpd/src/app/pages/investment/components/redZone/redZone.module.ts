import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './redZone.routing'

import { RedZone } from './redZone.component';
import { ButtonModule, DataTableModule, DialogModule, DropdownModule, TabViewModule, RadioButtonModule, PaginatorModule, InputTextareaModule, CalendarModule, GrowlModule, TreeTableModule, SharedModule, PanelMenuModule, FileUploadModule, ChartModule, DataGridModule, ConfirmDialogModule } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';

import { AngularEchartsModule } from 'ngx-echarts';



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
    TreeTableModule,
    SharedModule,
    PanelMenuModule,
    FileUploadModule,
    ChartModule,
    DataGridModule,
    ConfirmDialogModule,
    AngularEchartsModule
  ],
  declarations: [
    RedZone
  ]
})
export class RedZoneModule {}