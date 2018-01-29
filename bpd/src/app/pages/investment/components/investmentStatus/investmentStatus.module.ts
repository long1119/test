import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import {GrowlModule,DropdownModule,ButtonModule,DialogModule,ChartModule,PaginatorModule,PanelModule,DataTableModule,CheckboxModule} from 'primeng/primeng';
import { routing } from './investmentStatus.routing'
import {investmentStatusComponent} from "./investmentStatus.component";
import {HttpDataService} from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { AngularEchartsModule } from 'ngx-echarts';
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
        PaginatorModule,
        PanelModule,
        DataTableModule,
        AngularEchartsModule,
        CheckboxModule
    ],
    declarations: [
        investmentStatusComponent
    ],
    providers: [
        HttpDataService,
        MessageService
    ]
})
export class investmentStatusModule {}