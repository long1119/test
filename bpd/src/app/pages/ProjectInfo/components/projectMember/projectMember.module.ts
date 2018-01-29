import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProjectMember } from './projectMember.component';
import { AuthorityList } from './components/authorityList/authorityList.component';
import { UserSelectModule } from '../../../publicComponent/userSelect/userSelect.module';

import { routing } from './projectMember.routing';
import { ListboxModule, ButtonModule, DataTableModule, DialogModule, GrowlModule,DropdownModule, TreeTableModule, TabViewModule } from 'primeng/primeng';

import { MessageService } from '../../../service/message.service';
import { HttpDataService } from '../../../service/http.service';
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
    TreeTableModule,
    UserSelectModule,
    TabViewModule 
  ],
  declarations: [
    ProjectMember,
    AuthorityList
  ],
  providers: [
    MessageService,
    DeleteComfirmService,
    HttpDataService
  ]
})
export class ProjectMemberModule {}