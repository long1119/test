import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BugetTemplate } from './bugetTemplate.component';
import { routing } from './bugetTemplate.routing';
import { ListboxModule, ButtonModule, DataTableModule, DialogModule, GrowlModule, PaginatorModule } from 'primeng/primeng';

import { MessageService } from '../../../service/message.service';
import { HttpDataService } from '../../../service/http.service';
import { DataManageService } from '../../../service/dataManage.service';
import { DeleteComfirmService } from '../../../service/deleteDialog.service';


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
    PaginatorModule 
  ],
  declarations: [
    BugetTemplate
  ],
  providers: [
    MessageService,
    HttpDataService,
    DataManageService,
    DeleteComfirmService
  ]
})
export class BugetTemplateModule {}