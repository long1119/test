import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';

import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

import {
    routing
} from './detailReport.routing';
import {
    DetailReport
} from './detailReport.component';
import {
    ScoreCardDetail
} from './component/scoreCardDetail/scoreCardDetail.componet';

import {
    DataTableModule,
    DialogModule,
    TabViewModule,
    GrowlModule,
    DropdownModule,
    ButtonModule,
    PaginatorModule,
    CalendarModule,
    RadioButtonModule,
    TooltipModule,
} from 'primeng/primeng';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        routing,
        DataTableModule,
        DialogModule,
        TabViewModule,
        GrowlModule,
        DropdownModule,
        ButtonModule,
        PaginatorModule,
        CalendarModule,
        RadioButtonModule,
        TooltipModule,
    ],
    declarations: [
        DetailReport,
        ScoreCardDetail
    ],
    providers: [
        MessageService,
        DataManageService,
        HttpDataService,
        DeleteComfirmService
    ]
})

export class DetailReportModule {

}