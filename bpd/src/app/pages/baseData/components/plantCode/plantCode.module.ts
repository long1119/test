import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './plantCode.routing'
import { GrowlModule ,TreeTableModule,TreeNode,SharedModule,ContextMenuModule, ButtonModule, DataTableModule, ListboxModule, DialogModule, DropdownModule } from 'primeng/primeng';

import { PlantCode } from './plantCode.component';
import { plantCodeService } from './plantCode.service';
import { MessageService } from '../../../service/message.service';
import { DataManageService } from  '../../../service/dataManage.service';
import { DeleteComfirmService } from '../../../service/deleteDialog.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    TreeTableModule,
    SharedModule,
    ContextMenuModule,
    ButtonModule,
    DataTableModule,
    ListboxModule,
    DialogModule,
    GrowlModule,
    DropdownModule 
  ],
  declarations: [
    PlantCode,
  ],
  providers: [
    plantCodeService,
    // TreeNode
    MessageService,
    DataManageService,
    DeleteComfirmService 
  ]
})
export class PlantCodeModule {}