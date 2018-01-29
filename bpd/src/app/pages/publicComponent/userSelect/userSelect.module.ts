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
    PaginatorModule
} from 'primeng/primeng'

import {
    HttpDataService
} from '../../service/http.service';
import {
    DataManageService
} from '../../service/dataManage.service';

import {
    UserSelect
} from './userSelect.component';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        DataTableModule,
        FormsModule,
        PaginatorModule
    ],
    declarations: [
        UserSelect
    ],
    providers: [
        DataManageService,
        HttpDataService
    ],
    exports: [
        UserSelect
    ]
})

export class UserSelectModule {

}