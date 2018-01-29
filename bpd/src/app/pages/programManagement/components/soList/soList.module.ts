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
    routing
} from './soList.routing';
import {
    SoList
} from './soList.component';

import {
    DataTableModule,
    DialogModule,
    TabViewModule,
    GrowlModule,
    DropdownModule,
    ButtonModule,
    PaginatorModule,
    CalendarModule,
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
        FileUploadModule
    ],
    declarations: [
        SoList
    ],
    providers: [
        MessageService,
        DataManageService,
        HttpDataService
    ]
})

export class SoListModule {

}