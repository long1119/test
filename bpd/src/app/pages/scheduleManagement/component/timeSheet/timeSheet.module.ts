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
} from './timeSheet.routing';

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
    FileUploadModule,
    CheckboxModule,
    ConfirmationService,
    ConfirmDialogModule
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
    TimeSheet
} from './timeSheet.component';
import {
    ApproveLog
} from './components/approveLog/approveLog.component';
import {
    Devibables
} from './components/devibables/devibables.component';
import {
    TimeSheetData
} from './components/timeSheetData/timeSheetData.component';
import {
    TimeSheetFiles
} from './components/timeSheetFiles/timeSheetFiles.component';
import {
    SelectUserWorkFlowModule
} from '../../../publicComponent/selectUserWorkFlow/selectUserWorkFlow.module';
import {
    WorkFlowStartService
} from '../../../../ebon/components/workflow/workflow-start.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing,
        SelectUserWorkFlowModule,
        ListboxModule,
        ButtonModule,
        DataTableModule,
        DialogModule,
        GrowlModule,
        DropdownModule,
        PaginatorModule,
        TabViewModule,
        CalendarModule,
        FileUploadModule,
        CheckboxModule,
        ConfirmDialogModule
    ],
    declarations: [
        TimeSheet,
        TimeSheetData,
        TimeSheetFiles,
        ApproveLog,
        Devibables,
        // WorkFLowStartComponent
    ],
    providers: [
        HttpDataService,
        MessageService,
        WorkFlowStartService,
        DataManageService,
        ConfirmationService
    ],
    exports: [
        TimeSheetData
    ]
})

export class TimeSheetModule {

}