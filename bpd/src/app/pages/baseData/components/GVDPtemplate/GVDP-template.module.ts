import { NgModule }      from '@angular/core';
//import { BrowserModule } from '@angular/platform-browser';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './GVDP-template.routing'
import {GvdpTemplate} from "./GVDP-template.component";
import {ButtonModule,DialogModule,DropdownModule,DataTableModule,SharedModule,SpinnerModule,RadioButtonModule,GrowlModule,InputTextareaModule,FileUploadModule,CheckboxModule,PaginatorModule,InputSwitchModule} from 'primeng/primeng';
import {HttpDataService} from '../../../service/http.service';
import { MessageService } from '../../../service/message.service';
import { DeleteComfirmService } from '../../../service/deleteDialog.service';
import {LocalStorage} from '../../../portal/workPortal/local.storage';


@NgModule({
  imports: [
    //BrowserModule,
    CommonModule,
    FormsModule,
    routing,
    ButtonModule,
    DialogModule,
    DropdownModule,
    DataTableModule,
    SharedModule,
    SpinnerModule,
    RadioButtonModule,
    GrowlModule,
    InputTextareaModule,
    FileUploadModule,
    CheckboxModule,
    PaginatorModule,
    InputSwitchModule
  ],
  declarations: [
    GvdpTemplate
  ],
  providers: [
    HttpDataService,
    MessageService,
    LocalStorage,
    DeleteComfirmService 
  ]
})
export class GvdpTemplateModule {}