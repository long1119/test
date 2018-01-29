import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ArProejct } from './ArProject.component';
import { ArSubProject } from './components/ArSubProject.component';
import { routing } from './ArProject.routing';
import { ListboxModule, ButtonModule, DataTableModule, DialogModule, GrowlModule,DropdownModule,PaginatorModule, TabViewModule, CalendarModule, CheckboxModule } from 'primeng/primeng';

import { MessageService } from '../../../service/message.service';
import { HttpDataService } from '../../../service/http.service';
import { DataManageService } from '../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ListboxModule,
    ButtonModule,
    DataTableModule,
    DialogModule,
    GrowlModule,
    DropdownModule,
    PaginatorModule,
    TabViewModule,
    CalendarModule,
    CheckboxModule 
  ],
  declarations: [
    ArProejct,
    ArSubProject
  ],
  providers: [
    MessageService,
    HttpDataService,
    DeleteComfirmService,
    DataManageService
  ]
})
export class ArProjectModule {}