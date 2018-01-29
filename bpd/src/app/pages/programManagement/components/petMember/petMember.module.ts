import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, XHRBackend, RequestOptions }    from '@angular/http';
import { routing } from './petMember.routing';
import { GrowlModule, DialogModule, ButtonModule, DataTableModule, ListboxModule, MultiSelectModule, TreeTableModule, DropdownModule, InputTextModule, PaginatorModule, TabViewModule } from 'primeng/primeng';
import { AuthorityList } from './components/authorityList/authorityList.component';
import { UserSelectModule } from '../../../publicComponent/userSelect/userSelect.module';

import { HttpDataService } from '../../../service/http.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';
import { PetMember } from './petMember.component';
import {MessageService} from '../../../service/message.service';
import { DataManageService } from  '../../../service/dataManage.service';
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
    GrowlModule,
    MultiSelectModule,
    TreeTableModule,
    DropdownModule,
    UserSelectModule,
    InputTextModule,
    PaginatorModule,
    TabViewModule 
  ],
  //声明组件和指令
  declarations: [
    PetMember,
    AuthorityList
    // RequiredInput
  ],

  //服务依赖注入
  providers: [
    HttpDataService,
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
export class PetMemberModule {
    
}