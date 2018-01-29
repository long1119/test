import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import {GrowlModule,DropdownModule,DialogModule,ButtonModule,DataTableModule,SharedModule,PaginatorModule,PanelModule, CheckboxModule} from 'primeng/primeng';
import { routing } from './investmentSummary.routing'
import {investmentSummaryComponent} from "./investmentSummary.component";
import {HttpDataService} from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GrowlModule,
        routing,
        DropdownModule,
        DialogModule,
        ButtonModule,
        DataTableModule,
        SharedModule,
        PaginatorModule,
        PanelModule,
        CheckboxModule
    ],
    declarations: [
        investmentSummaryComponent
    ],
    providers: [
        HttpDataService,
        MessageService
    ]
})
export class investmentSummaryModule {}