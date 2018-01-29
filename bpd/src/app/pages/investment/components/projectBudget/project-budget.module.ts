/**
 * Created by 田建辉 on 2017/8/21.
 */
import {NgModule} from '@angular/core';
import { CommonModule }  from '@angular/common';
import {projectBudgetComponent} from "./project-budget.component";
import {MessageService} from "../../../service/message.service";
import {HttpDataService} from "../../../service/http.service";
import {routing} from './project-budget.routing';
import { FormsModule } from '@angular/forms';
import {ButtonModule,DialogModule,DropdownModule,DataTableModule,SharedModule,SpinnerModule,RadioButtonModule,GrowlModule} from 'primeng/primeng';
@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        DataTableModule,
        SharedModule,
        SpinnerModule,
        RadioButtonModule,
        GrowlModule,
        routing
    ],
    declarations:[
        projectBudgetComponent
    ],
    providers:[
        MessageService,
        HttpDataService
    ]
})
export class projectBudgetModule{

}