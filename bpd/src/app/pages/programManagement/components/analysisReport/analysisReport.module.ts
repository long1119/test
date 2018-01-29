import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './analysisReport.routing'

import { AnalysisReport } from './analysisReport.component';
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
    AnalysisReport
  ]
})
export class AnalysisReportModule {}