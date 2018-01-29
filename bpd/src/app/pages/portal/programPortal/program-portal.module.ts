/**
 * Created by 田建辉 on 2017/8/22.
 */
import {NgModule} from '@angular/core';
import { CommonModule }  from '@angular/common';
import {programPortalComponent} from "./program-portal.component";
import {MessageService} from "../../service/message.service";
import {HttpDataService} from "../../service/http.service";
import {DataManageService} from '../../service/dataManage.service'
import {routing} from './program-portal.routing';
import { FormsModule } from '@angular/forms';
import {ButtonModule,DialogModule,DropdownModule,GrowlModule,TabViewModule,FileUploadModule,RadioButtonModule,CalendarModule,DataTableModule,PaginatorModule,TreeModule,TooltipModule,SpinnerModule} from 'primeng/primeng';
import {vehicleManagementComponent} from './components/vehicleManagement/vehicleManagement.component';
import {programInformationComponent} from './components/programInformation/program-information.component';
import {selectPictureComponent} from './components/selectPicture/selectPicture.component';
import {LocalStorage} from '../../portal/workPortal/local.storage';
import {WorkFLowComponent} from '../../../ebon/components/workflow/workflow.component';
import {TimeSheetWorkFlowModule} from '../../publicComponent/timeSheetWorkFlow/timeSheetWorkFlow.module';
import {NodWorkFlowModule} from '../../publicComponent/nodWorkFlow/nodWorkFlow.module';
import {ScoreCardWorkFlowModule} from '../../publicComponent/scoreCardWorkFlow/scoreCardWorkFlow.module';
import { ScoreCardModule } from '../../programManagement/components/scoreCard/scoreCard.module';

@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        GrowlModule,
        routing,
        TabViewModule,
        FileUploadModule,
        RadioButtonModule,
        CalendarModule,
        DataTableModule,
        PaginatorModule,
        TreeModule,
        TimeSheetWorkFlowModule,
        NodWorkFlowModule,
        ScoreCardWorkFlowModule,
        TooltipModule,
        SpinnerModule
    ],
    declarations:[
        programPortalComponent,
        vehicleManagementComponent,
        programInformationComponent,
        selectPictureComponent,
        WorkFLowComponent,
    ],
    providers:[
        MessageService,
        HttpDataService,
        LocalStorage,
        DataManageService
    ]
})
export class programPortalModule{

}