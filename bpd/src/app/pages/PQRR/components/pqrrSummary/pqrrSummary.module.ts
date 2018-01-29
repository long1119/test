import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './pqrrSummary.routing'

import { PqrrSummary } from './pqrrSummary.component';
import { ButtonModule, DataTableModule, DialogModule, DropdownModule, TabViewModule, RadioButtonModule, PaginatorModule, InputTextareaModule, CalendarModule, GrowlModule, TreeTableModule, SharedModule, PanelMenuModule, FileUploadModule, ProgressBarModule, CheckboxModule, ConfirmDialogModule } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
// import {selectPictureComponent} from '../../../portal/programPortal/components/selectPicture/selectPicture.component';



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
    ProgressBarModule,
    CheckboxModule,
    ConfirmDialogModule
  ],
  declarations: [
    PqrrSummary
    // selectPictureComponent
  ]
})
export class PqrrSummaryModule {}