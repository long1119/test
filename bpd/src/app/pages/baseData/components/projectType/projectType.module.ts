import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { routing } from './projectType.routing';

import { ProjectType } from './projectType.component';
import { ButtonModule, DataTableModule, ListboxModule, DialogModule, DropdownModule, GrowlModule, PaginatorModule, FileUploadModule, TabViewModule} from 'primeng/primeng';
import { ProjectParameter } from './components/perojectParameter/projectParameter.component';
import { ProjectCategory } from './components/projectCategory/projectCategory.component';
import { ArTemplateUpload } from './components/arTemplateUpload/arTemplateUpload.component';
import { ProjectTypeProgram } from './components/projectTypeProgram/projectTypeProgram.component';
import { ProjectLevel } from './components/projectLevel/projectLevel.component';
import { HttpDataService } from '../../../service/http.service'
import { MessageService } from '../../../service/message.service';
import { DataManageService } from '../../../service/dataManage.service.ts';
import { DeleteComfirmService } from '../../../service/deleteDialog.service';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ButtonModule,
    DataTableModule,
    ListboxModule,
    DialogModule,
    DropdownModule,
    GrowlModule,
    PaginatorModule,
    FileUploadModule,
    TabViewModule
  ],
  declarations: [
    ProjectType,
    ProjectCategory,
    ProjectLevel,
    ProjectParameter,
    ArTemplateUpload,
    ProjectTypeProgram 
  ],
  providers: [
    HttpDataService,
    MessageService,
    DataManageService,
    DeleteComfirmService 
  ]
})
export class ProjectTypeModule {}