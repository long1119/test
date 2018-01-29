import {
    NgModule
} from '@angular/core'; 
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';

import {routing} from './investmentLog.routing';

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
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

import {
    InvestmentLog
} from './investmentLog.component';
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
        InvestmentLog
    ],
    providers: [
        HttpDataService,
        MessageService,
        DeleteComfirmService,
        DataManageService
    ]
})

export class InvestmentLogModule {

}