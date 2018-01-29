import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import {GrowlModule,DropdownModule,ButtonModule,DialogModule,PaginatorModule,DataTableModule,SharedModule,TabViewModule} from 'primeng/primeng';
import { routing } from './prpo.routing'
import {prpoComponent} from "./prpo.component";
import {HttpDataService} from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import {LocalStorage} from '../../../portal/workPortal/local.storage';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GrowlModule,
        DropdownModule,
        ButtonModule,
        DialogModule,
        PaginatorModule,
        DataTableModule,
        SharedModule,
        TabViewModule,
        routing
    ],
    declarations: [
        prpoComponent
    ],
    providers: [
        HttpDataService,
        MessageService,
        LocalStorage
    ]
})
export class prpoModule {}