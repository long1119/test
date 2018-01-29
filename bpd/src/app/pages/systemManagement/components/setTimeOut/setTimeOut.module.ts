import {
    NgModule
} from '@angular/core'; 
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';

import {routing} from './setTimeOut.routing';

import {
    ListboxModule,
    ButtonModule,
    DataTableModule,
    DialogModule,
    GrowlModule,
    TreeTableModule,
    CheckboxModule,
    RadioButtonModule,
    TabViewModule,
    PaginatorModule,
    DropdownModule
} from 'primeng/primeng';

import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    MessageService
} from '../../../service/message.service';
import {
    HttpDataService
} from '../../../service/http.service';

import {
    SetTimeOut
} from './setTimeOut.component';
import {
    SetTimeOutLog
} from './component/setTimeOutLog/setTimeOutLog.conponent';

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
        TreeTableModule,
        CheckboxModule,
        RadioButtonModule,
        PaginatorModule,
        TabViewModule,
        DropdownModule,
    ],
    declarations: [
        SetTimeOutLog,
        SetTimeOut,
    ],
    providers: [
        HttpDataService,
        MessageService,
        DataManageService
    ]
})

export class SetTimeOutModule {

}