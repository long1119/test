import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './crdnTracking.routing'

import { CrdnTracking } from './crdnTracking.component';
import { ButtonModule, DataTableModule, DialogModule, DropdownModule, TabViewModule, RadioButtonModule, PaginatorModule, InputTextareaModule, CalendarModule, GrowlModule, TreeTableModule, SharedModule, PanelMenuModule, FileUploadModule } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';



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
    FileUploadModule
    
  ],
  declarations: [
    CrdnTracking
  ]
})
export class CrdnTrackingModule {}