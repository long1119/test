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
    IncomeRate
} from './component/incomeRate/incomeRate.component';
import {
    OtherRate
} from './component/otherRate/otherRate.component'
import {
    TaxRate
} from './taxRate.component';
import {
    routing
} from './taxRate.routing';
import {
    ListboxModule,
    ButtonModule,
    DataTableModule,
    DialogModule,
    GrowlModule,
    DropdownModule,
    PaginatorModule,
    TabViewModule,
    PanelModule
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
        PanelModule
    ],
    declarations: [
        TaxRate,
        IncomeRate,
        OtherRate
    ],
    providers: [
        MessageService,
        HttpDataService,
        DeleteComfirmService,
        DataManageService
    ]
})
export class TaxRateModule {}