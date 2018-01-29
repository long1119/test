import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, XHRBackend, RequestOptions }    from '@angular/http';
import { routing } from './region.routing';
import { DialogModule, ButtonModule, DataTableModule, ListboxModule, DropdownModule, CheckboxModule, FileUploadModule, GrowlModule, TabViewModule } from 'primeng/primeng';

import { HttpDataService } from '../../../service/http.service';
import { DeleteComfirmService } from '../../../service/deleteDialog.service';
import { MessageService } from '../../../service/message.service'
import { DataManageService } from  '../../../service/dataManage.service';

import { Region } from './region.component';
import { RegionCode } from './components/regionCode/regionCode.component';
import { RegionParameter } from './components/regionParameter/regionParameter.component';
import { RegionTemplate } from './components/regionTemplate/regionTemplate.component';
import { RegionDefineColumn } from './components/regionDefineColumn/regionDefineColumn.component';
import { HttpInterceptorService } from '../../../../ebon/auth/HttpInterceptorService';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions){
   let service = new HttpInterceptorService(xhrBackend, requestOptions);
   return service;
 }

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    HttpModule,
    ListboxModule,
    DataTableModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    FileUploadModule,
    GrowlModule,
    TabViewModule 
  ],
  declarations: [
    Region,
    RegionCode,
    RegionParameter,
    RegionTemplate,
    RegionDefineColumn 
  ],
  providers: [
    HttpDataService,
    MessageService,
    DeleteComfirmService,
    DataManageService,
    HttpInterceptorService,
    {
      provide: Http,
      useFactory: interceptorFactory,
      deps: [XHRBackend, RequestOptions]
    }
  ]
})
export class RegionModule {}