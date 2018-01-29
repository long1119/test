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
    LandInformation
} from './landInformation.component';
import {
    routing
} from './landInformation.routing';
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
    PagesModule
} from '../../../pages.module';

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
        PagesModule
    ],
    declarations: [
        LandInformation
    ],
    providers: [
        MessageService,
        HttpDataService,
        DeleteComfirmService,
        DataManageService
    ]
})
export class LandInformationModule {}