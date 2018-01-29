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
    ButtonModule,
    DataTableModule,
    PaginatorModule,
    TabViewModule,
    CalendarModule,
    GrowlModule,
    DialogModule,
    DropdownModule
} from 'primeng/primeng'

import {
    HttpDataService
} from '../../service/http.service';
import {
    DataManageService
} from '../../service/dataManage.service';

import {
    TimeSheetWorkFlow
} from './timeSheetWorkFlow.component';
import {
    TimeSheetDataWorkFlow
} from './component/timeSheetDataWorkFlow/timeSheetDataWorkFlow.component';
import {
    DevlibablesWorkFlow
} from './component/devlibablesWorkFlow/devlibablesWorkFlow.component';
import {
    FilesWorkFlow
} from './component/filesWorkFlow/filesWorkFlow.component';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        DataTableModule,
        FormsModule,
        PaginatorModule,
        TabViewModule,
        CalendarModule,
        GrowlModule,
        DialogModule,
        DropdownModule
    ],
    declarations: [
        TimeSheetWorkFlow,
        TimeSheetDataWorkFlow,
        FilesWorkFlow,
        DevlibablesWorkFlow
    ],
    providers: [
        DataManageService,
        HttpDataService
    ],
    exports: [
        TimeSheetWorkFlow
    ]
})

export class TimeSheetWorkFlowModule {

}