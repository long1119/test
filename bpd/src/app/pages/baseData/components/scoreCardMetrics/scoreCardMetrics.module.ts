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
} from './scoreCardMetrics.routing';
import {
    ScoreCardMetrics
} from './scoreCardMetrics.component';
import {
    UserSelectModule
} from '../../../publicComponent/userSelect/userSelect.module';

import {
    DataTableModule,
    DialogModule,
    TabViewModule,
    GrowlModule,
    DropdownModule,
    ButtonModule,
    PaginatorModule,
    CalendarModule,
    CheckboxModule
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
        CheckboxModule,
        UserSelectModule
    ],
    declarations: [
        ScoreCardMetrics
    ],
    providers: [
        MessageService,
        DataManageService,
        HttpDataService,
        DeleteComfirmService
    ]
})

export class ScoreCardMetricsModule {

}