import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, XHRBackend, RequestOptions }    from '@angular/http';
import { routing } from './region.routing';
import { GrowlModule, DialogModule, ButtonModule, DataTableModule, ListboxModule } from 'primeng/primeng';

import { RegionGroupService } from './regionGroup.service';
import { RegionGroup } from './regionGroup.component';
import {MessageService} from '../../../service/message.service';
import { DataManageService } from "../../../service/dataManage.service";
import { DeleteComfirmService } from "../../../service/deleteDialog.service";
// import { RequiredInput } from '../../../component/requiredInput/requiredInput.component';
import { HttpInterceptorService } from '../../../../ebon/auth/HttpInterceptorService';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions){
   let service = new HttpInterceptorService(xhrBackend, requestOptions);
   return service;
 }

@NgModule({
  //导入其他模块
  imports: [
    CommonModule,
    FormsModule,
    routing,
    HttpModule,
    ListboxModule,
    DataTableModule,
    ButtonModule,
    DialogModule,
    GrowlModule
  ],
  //声明组件和指令
  declarations: [
    RegionGroup,
    // RequiredInput
  ],

  //服务依赖注入
  providers: [
    RegionGroupService,
    MessageService,
    DataManageService,
    DeleteComfirmService,
    HttpInterceptorService,
    {
       provide: Http,
       useFactory: interceptorFactory,
       deps: [XHRBackend, RequestOptions]
     }
  ]
})
export class RegionGroupModule {
    
}