import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './workPortal.routing';
import { GrowlModule, DialogModule, ButtonModule, DataTableModule, ListboxModule, MultiSelectModule,DropdownModule,PaginatorModule } from 'primeng/primeng';

import { HttpDataService } from '../../service/http.service';
import { WorkPortal } from './workPortal.component';
import { DropDown } from '../../publicComponent/dropDown'
import {MessageService} from '../../service/message.service';
import {LocalStorage} from './local.storage';


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
    DropdownModule,
    PaginatorModule
  ],
  //声明组件和指令
  declarations: [
    WorkPortal,
    DropDown
    // RequiredInput
  ],

  //服务依赖注入
  providers: [
    HttpDataService,
    MessageService,
    LocalStorage
  ]
})
export class WorkPortalModule {
    
}