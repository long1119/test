import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, XHRBackend, RequestOptions }    from '@angular/http';
import { routing } from './investmentPortal.routing';
import { GrowlModule, DialogModule, ButtonModule, DataTableModule, ListboxModule, MultiSelectModule,FileUploadModule,DropdownModule,TabViewModule,ChartModule,PaginatorModule } from 'primeng/primeng';
import { HttpDataService } from '../../service/http.service';
import { InvestmentPortal } from './investmentPortal.component';
import {MessageService} from '../../service/message.service';
import {LocalStorage} from '../workPortal/local.storage'
import { HttpInterceptorService } from '../../../ebon/auth/HttpInterceptorService';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions){
   let service = new HttpInterceptorService(xhrBackend, requestOptions);
   return service;
 }
@NgModule({
  // 引入第三方模块
  imports: [
    CommonModule,
    FormsModule,
    routing,
    HttpModule,
    ButtonModule,
    DialogModule,
    DataTableModule,
    GrowlModule,
    MultiSelectModule,
    FileUploadModule,
    DropdownModule,
    TabViewModule,
    ChartModule,
    PaginatorModule
  ],
  //声明组件和指令
  declarations: [
    InvestmentPortal
  ],

  //服务依赖注入
  providers: [
    HttpDataService,
    MessageService,
    LocalStorage,
    HttpInterceptorService,
    {
       provide: Http,
       useFactory: interceptorFactory,
       deps: [XHRBackend, RequestOptions]
     }
  ]
})
export class InvestmentPortalModule {
    
}