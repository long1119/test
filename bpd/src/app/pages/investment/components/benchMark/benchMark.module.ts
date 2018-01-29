import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './benchMark.routing'

import { NgaModule } from '../../../../theme/nga.module';
import { Http, HttpModule, XHRBackend, RequestOptions }    from '@angular/http';
import { BenchMark } from './benchMark.component';
import { ButtonModule, DataTableModule, DialogModule, DropdownModule, TabViewModule, RadioButtonModule, PaginatorModule, InputTextareaModule, CalendarModule, GrowlModule, TreeTableModule, SharedModule, PanelMenuModule, FileUploadModule } from 'primeng/primeng';
import { HttpDataService } from '../../../service/http.service';

import { PagesModule } from '../../../pages.module';

import { HttpInterceptorService } from '../../../../ebon/auth/HttpInterceptorService';

export function interceptorFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions){
   let service = new HttpInterceptorService(xhrBackend, requestOptions);
   return service;
 }

@NgModule({
  imports: [
    PagesModule,
    CommonModule,
    FormsModule,
    routing,
    ButtonModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    TabViewModule,
    RadioButtonModule,
    PaginatorModule,
    InputTextareaModule,
    CalendarModule,
    GrowlModule,
    TreeTableModule,
    SharedModule,
    PanelMenuModule,
    FileUploadModule,
    NgaModule 
  ],
  declarations: [
    BenchMark,
  ],
  providers: [
    HttpInterceptorService,
    {
       provide: Http,
       useFactory: interceptorFactory,
       deps: [XHRBackend, RequestOptions]
     }
  ]
})
export class BenchMarkModule {}