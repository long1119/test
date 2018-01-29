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
    routing
} from './scheduleAnalysis.routing';

import {
    ListboxModule,
    ButtonModule,
    DataTableModule,
    DialogModule,
    GrowlModule,
    DropdownModule,
    PaginatorModule,
    TabViewModule,
    CalendarModule,
    FileUploadModule
} from 'primeng/primeng';

import {
    MessageService
} from '../../../service/message.service';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

import {
    ScheduleAnalysis
} from './scheduleAnalysis.component';
import {
    TimeSheetVersion
} from './components/timeSheetVersion.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing,
        ListboxModule,
        ButtonModule,
        DataTableModule,
        DialogModule,
        GrowlModule,
        DropdownModule,
        PaginatorModule,
        TabViewModule,
        CalendarModule,
        FileUploadModule
    ],
    declarations: [
        ScheduleAnalysis,
        TimeSheetVersion
    ],
    providers: [
        HttpDataService,
        MessageService,
        DeleteComfirmService,
        DataManageService
    ]
})

export class ScheduleAnalysisModule {

}