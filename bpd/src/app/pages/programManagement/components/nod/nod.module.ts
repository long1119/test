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
} from './nod.routing';
import {
    Nod
} from './nod.component';
import {
    NodInformation
} from './component/nodInformation/nodInformation.component';
import {
    PtLineupInfo    
} from './component/ptLineupInfo/ptLineupInfo.component';
import {
    WorkFlowStartService
} from '../../../../ebon/components/workflow/workflow-start.service';
import {
    SelectUserWorkFlowModule
} from '../../../publicComponent/selectUserWorkFlow/selectUserWorkFlow.module';

import {
    DataTableModule,
    DialogModule,
    TabViewModule,
    GrowlModule,
    DropdownModule,
    ButtonModule,
    PaginatorModule,
    CalendarModule,
    FileUpload,
    FileUploadModule
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
        SelectUserWorkFlowModule,
        FileUploadModule
    ],
    declarations: [
        Nod,
        NodInformation,
        PtLineupInfo
    ],
    providers: [
        MessageService,
        DataManageService,
        HttpDataService,
        WorkFlowStartService,
        FileUpload,
        DeleteComfirmService,
    ],
    exports: [
        PtLineupInfo
    ]
})

export class NodModule {

}