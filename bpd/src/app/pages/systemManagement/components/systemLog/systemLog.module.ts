import {
    NgModule
} from '@angular/core'; 
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';

import {routing} from './systemLog.routing';

import {
    ListboxModule,
    ButtonModule,
    DataTableModule,
    DialogModule,
    GrowlModule,
    TreeTableModule,
    CheckboxModule,
    RadioButtonModule
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
    SystemLog
} from './systemLog.component';
import {
    Permission
} from './component/permission/permission.component';

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
        RadioButtonModule
    ],
    declarations: [
        Permission,
        SystemLog
    ],
    providers: [
        HttpDataService,
        MessageService,
        DataManageService
    ]
})

export class SystemLogModule {

}