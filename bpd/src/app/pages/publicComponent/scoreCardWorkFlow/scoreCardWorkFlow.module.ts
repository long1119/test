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
    DialogModule,
    CalendarModule,
    DropdownModule,
    GrowlModule,
    ConfirmationService,
    ConfirmDialogModule,
    RadioButtonModule
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
    ScoreCardWorkFlow
} from './scoreCardWorkFLow.component';
// import {,
    // NodModule
// } from '../../programManagement/components/nod/nod.module';

@NgModule({
    imports: [
            CommonModule,
            ButtonModule,
            DataTableModule,
            FormsModule,
            PaginatorModule,
            TabViewModule,
            DialogModule,
            CalendarModule,
            DropdownModule,
            GrowlModule,
            ConfirmDialogModule,
            RadioButtonModule
            // NodModule
    ],
    declarations: [
        ScoreCardWorkFlow
    ],
    providers: [
        DataManageService,
        HttpDataService,
        ConfirmationService,
        MessageService
    ],
    exports: [
        ScoreCardWorkFlow
    ]
})

export class ScoreCardWorkFlowModule {

}