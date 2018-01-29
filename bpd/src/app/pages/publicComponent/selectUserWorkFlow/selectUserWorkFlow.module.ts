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
    MessageService
} from '../../service/message.service';

import {
    UserSelectModule
} from '../userSelect/userSelect.module';
import {
    SelectUserWorkFlow
} from './selectUserWorkFlow.component';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        DataTableModule,
        FormsModule,
        UserSelectModule,
        PaginatorModule,
        TabViewModule,
        CalendarModule,
        GrowlModule,
        DialogModule,
        DropdownModule
    ],
    declarations: [
        SelectUserWorkFlow
    ],
    providers: [
        DataManageService,
        HttpDataService,
        MessageService
    ],
    exports: [
        SelectUserWorkFlow
    ]
})

export class SelectUserWorkFlowModule {

}