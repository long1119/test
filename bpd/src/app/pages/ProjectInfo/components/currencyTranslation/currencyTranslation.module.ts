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
    GrowlModule,
    DataTableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    TabViewModule
} from 'primeng/primeng';

import {
    routing
} from './currencyTranslation.routing';
import {
    HttpDataService
} from '../../../service/http.service'
import {
    MessageService
} from '../../../service/message.service'
import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

import {
    CurrencyTemplate
} from './currencyTranslation.component';
import {
    RateChange
} from './components/rateChange/rateChange.component';
import {
    PaymentRate
} from './components/paymentRate/paymentRate.component';
import {
    YearRate
} from './components/rateChange/components/yearRate.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        routing,
        GrowlModule,
        DataTableModule,
        ButtonModule,
        DropdownModule,
        DialogModule,
        CalendarModule,
        TabViewModule
    ],
    declarations: [
        CurrencyTemplate,
        PaymentRate,
        RateChange,
        YearRate
    ],
    providers: [
        HttpDataService,
        MessageService,
        DeleteComfirmService,
        DataManageService
    ]
})

export class CurrencyTranslationModule {

}