import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';

// import {

// } from 'primeng/primeng';

import {
    DataManageService
} from '../../service/dataManage.service';
import {
    MessageService
} from '../../service/message.service';
import {
    HttpDataService
} from '../../service/http.service';

import {
    AutoMatch
} from './autoMatch.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        AutoMatch
    ],
    providers: [
        DataManageService,
        MessageService,
        HttpDataService
    ]
})

export class AutoMatchModule {

}