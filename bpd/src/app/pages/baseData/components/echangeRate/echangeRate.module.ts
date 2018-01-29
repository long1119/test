import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';
import {
  routing
} from './echangeRate.routing'

import {
  EchangeRate
} from './echangeRate.component';
import {
  ExchangeEdit
} from './components/exchangeEdit/exchangeEdit.copmonent';
import {
  GrowlModule,
  PanelModule,
  DataTableModule,
  ButtonModule,
  ListboxModule,
  DialogModule,
  FileUploadModule,
  PaginatorModule,
  DropdownModule
} from 'primeng/primeng'
import {
  MessageService
} from '../../../service/message.service';
import {
  HttpDataService
} from '../../../service/http.service';
import {
  DataManageService
} from '../../../service/dataManage.service';
import {
  DeleteComfirmService
} from '../../../service/deleteDialog.service';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    GrowlModule,
    PanelModule,
    DataTableModule,
    ButtonModule,
    ListboxModule,
    DialogModule,
    FileUploadModule,
    PaginatorModule,
    DropdownModule,
  ],
  declarations: [
    EchangeRate,
    ExchangeEdit
  ],
  providers: [
    MessageService,
    HttpDataService,
    DataManageService,
    DeleteComfirmService,
  ]
})
export class EchangeRateModule {

}