import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import {GrowlModule,DropdownModule,ButtonModule,DialogModule,ChartModule,DataTableModule,SharedModule,PaginatorModule,CheckboxModule} from 'primeng/primeng';
import { routing } from './closeReport.routing'
import {closeReportComponent} from "./closeReport.component";
import {HttpDataService} from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import {LocalStorage} from "../../../portal/workPortal/local.storage";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GrowlModule,
        routing,
        DropdownModule,
        ButtonModule,
        DialogModule,
        ChartModule,
        DataTableModule,
        SharedModule,
        PaginatorModule,
        CheckboxModule
    ],
    declarations: [
        closeReportComponent
    ],
    providers: [
        HttpDataService,
        MessageService,
        LocalStorage
    ]
})
export class closeReportModule {}