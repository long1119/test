import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './documentManagement.routing'

import { DocumentManagement } from './documentManagement.component';
import { ButtonModule, DataTableModule, DialogModule, DropdownModule, TabViewModule, RadioButtonModule, PaginatorModule, InputTextareaModule, CalendarModule, GrowlModule, TreeTableModule, SharedModule, PanelMenuModule, FileUploadModule, DataGridModule, TreeModule, CheckboxModule, ConfirmDialogModule } from 'primeng/primeng';
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
    TreeTableModule,
    SharedModule,
    PanelMenuModule,
    FileUploadModule,
    DataGridModule,
    TreeModule,
    CheckboxModule,
    ConfirmDialogModule,
    PagesModule
  ],
  declarations: [
    DocumentManagement
  ]
})
export class DocumentManagementModule {}