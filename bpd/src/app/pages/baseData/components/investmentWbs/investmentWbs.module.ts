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
} from './investmentWbs.routing'

import {
  InvestmentWbs
} from './investmentWbs.component';
import {
  GrowlModule,
  ButtonModule,
  ListboxModule,
  DataTableModule,
  DialogModule,
  TreeTableModule,
  SharedModule,
} from 'primeng/primeng';
import {
  HttpDataService
} from '../../../service/http.service';
import {
  MessageService
} from '../../../service/message.service';
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
    ButtonModule,
    ListboxModule,
    DataTableModule,
    DialogModule,
    TreeTableModule,
    SharedModule,

  ],
  declarations: [
    InvestmentWbs
  ],
  providers: [
    HttpDataService,
    MessageService,
    DataManageService,
    DeleteComfirmService
  ]
})
export class InvestmentWbsModule {

}