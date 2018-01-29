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
} from './launchPlan.routing';

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
    CheckboxModule
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
    LaunchPlan
} from './launchPlan.component';
import {
    TimeSheetVersionInfo
} from './component/timeSheetVersionInfo/timeSheetVersionInfo.component';
// import {
    // WorkFLowStartComponent
// } from '../../../../ebon/components/workflow/workflow-start.component';

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
        FileUploadModule,
        CheckboxModule
    ],
    declarations: [
        LaunchPlan,
        TimeSheetVersionInfo
        // WorkFLowStartComponent
    ],
    providers: [
        HttpDataService,
        MessageService,
        DeleteComfirmService,
        DataManageService
    ]
})

export class LaunchPlanModule {

}