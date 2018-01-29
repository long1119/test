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
    DropdownModule,
    CalendarModule,
    DialogModule,
    GrowlModule
} from 'primeng/primeng'

import {
    HttpDataService
} from '../../service/http.service';
import {
    DataManageService
} from '../../service/dataManage.service';
import {
    MessageService
} from '../../service/message.service';

import {
    NodWorkFlow
} from './nodWorkFlow.component';
import {
    PtLineupInfo
} from './components/ptLineupInfo/ptLineupInfo.component';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        DataTableModule,
        FormsModule,
        PaginatorModule,
        TabViewModule,
        DropdownModule,
        CalendarModule,
        DialogModule,
        GrowlModule
    ],
    declarations: [
        NodWorkFlow,
        PtLineupInfo
    ],
    providers: [
        DataManageService,
        HttpDataService,
        MessageService
    ],
    exports: [
        NodWorkFlow
    ]
})

export class NodWorkFlowModule {

}