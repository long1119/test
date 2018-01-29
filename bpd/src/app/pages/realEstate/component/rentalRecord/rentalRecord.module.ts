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
    RentalRecord
} from './rentalRecord.component';
import {
    routing
} from './rentalRecord.routing';
import {
    ListboxModule,
    ButtonModule,
    DataTableModule,
    DialogModule,
    GrowlModule,
    DropdownModule,
    PaginatorModule,
    TabViewModule,
    PanelModule,
    CalendarModule
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
        PanelModule,
        CalendarModule
    ],
    declarations: [
        RentalRecord
    ],
    providers: [
        MessageService,
        HttpDataService,
        DeleteComfirmService,
        DataManageService
    ]
})
export class RentalRecordModule {}