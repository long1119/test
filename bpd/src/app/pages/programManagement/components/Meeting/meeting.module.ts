import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, XHRBackend, RequestOptions }    from '@angular/http';
import { routing } from './meeting.routing';
import { GrowlModule, DialogModule,ButtonModule,DropdownModule,InputTextModule,CalendarModule,TabViewModule,InputTextareaModule,CheckboxModule,SpinnerModule,PaginatorModule,TooltipModule,RadioButtonModule,DataTableModule,ConfirmDialogModule,FileUploadModule } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';
import { meetingComponent } from './meeting.component';
import {MessageService} from '../../../service/message.service';
import {DeleteComfirmService} from '../../../service/deleteDialog.service';
import { HttpInterceptorService } from '../../../../ebon/auth/HttpInterceptorService';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions){
   let service = new HttpInterceptorService(xhrBackend, requestOptions);
   return service;
 }
@NgModule({
    imports:[
        CommonModule,
        FormsModule,
        HttpModule,
        routing,
        GrowlModule, 
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        CalendarModule,
        TabViewModule,
        InputTextareaModule,
        CheckboxModule,
        SpinnerModule,
        PaginatorModule,
        TooltipModule,
        RadioButtonModule,
        DataTableModule,
        ConfirmDialogModule,
        FileUploadModule
    ],
    declarations:[
        meetingComponent
    ],
    providers:[
        HttpDataService,
        MessageService,
        DeleteComfirmService,
        HttpInterceptorService,
        {
            provide: Http,
            useFactory: interceptorFactory,
            deps: [XHRBackend, RequestOptions]
        }
    ]
})
export class meetingModule {
    
}