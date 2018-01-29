import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DropdownModule, ButtonModule, GrowlModule, DataTableModule, DialogModule, MultiSelectModule, InputMaskModule } from 'primeng/primeng';
import { PreviousEsimation } from './previousEsitmation.component';
import { PreviousProject } from './components/previousProject/previousProject.component';

import { routing } from './previousEsitmation.routing';
import { MessageService } from '../../../service/message.service';
import { HttpDataService } from '../../../service/http.service';
import { DataManageService } from '../../../service/dataManage.service';
import { DeleteComfirmService } from '../../../service/deleteDialog.service';

@NgModule({
    imports: [
        CommonModule,
        routing,
        FormsModule,
        DropdownModule,
        ButtonModule, 
        GrowlModule, 
        DataTableModule, 
        DialogModule,
        MultiSelectModule,
        InputMaskModule
    ],
    declarations: [
        PreviousEsimation,
        PreviousProject
    ],
    providers: [
        MessageService,
        HttpDataService,
        DataManageService,
        DeleteComfirmService 
    ]
})

export class PreviousEsitmationModule {

}