import { NgModule }      from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './summary-report.routing'
import {summaryReportComponent} from "./summary-report.component";
import {bubbleChartComponent} from "./bubble-chart/bubble-chart.component";
import {ButtonModule,DialogModule,DropdownModule,DataTableModule,SharedModule,SpinnerModule,RadioButtonModule,GrowlModule,InputTextareaModule,FileUploadModule,CheckboxModule,PaginatorModule,CalendarModule,PanelModule} from 'primeng/primeng';
import {HttpDataService} from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { AngularEchartsModule } from 'ngx-echarts';
import {LocalStorage} from '../../../portal/workPortal/local.storage';


@NgModule({
  imports: [
    // BrowserModule,
    CommonModule,
    FormsModule,
    routing,
    ButtonModule,
    DialogModule,
    DropdownModule,
    DataTableModule,
    SharedModule,
    SpinnerModule,
    RadioButtonModule,
    GrowlModule,
    InputTextareaModule,
    FileUploadModule,
    CheckboxModule,
    PaginatorModule,
    CalendarModule,
    PanelModule,
    AngularEchartsModule
  ],
  declarations: [
    summaryReportComponent,
    bubbleChartComponent
  ],
  providers: [
    HttpDataService,
    MessageService,
    LocalStorage
  ]
})
export class summaryReportModule {}