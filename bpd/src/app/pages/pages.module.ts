import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { routing }       from './pages.routing';
import { NgaModule } from '../theme/nga.module';

import { DialogModule, ButtonModule, GrowlModule, ConfirmationService, ConfirmDialogModule } from 'primeng/primeng';

import { Pages } from './pages.component';
import { WorkFLowStartComponent, WorkFlowStartService } from '../ebon/components';
import { PaginationModule } from 'ngx-bootstrap/index';
import { LocalStorage } from './portal/workPortal/local.storage';
import { MessageService } from './service/message.service';
import { RefreshMenuService } from './service/refreshMenu.service';
import { DataManageService } from './service/dataManage.service';

import { I18nPips } from '../theme/pipes/i18nPips/i18nPips.pipe';
import { AmmountPips } from '../theme/pipes/ammountPips/ammountPips.pipe';
import { AmmountKPips } from '../theme/pipes/ammountKPips/ammountKPips.pipe';
 
@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    PaginationModule.forRoot(),
    DialogModule,
    ButtonModule,
    GrowlModule,
    ConfirmDialogModule
  ],
  declarations: [
    Pages,
    WorkFLowStartComponent,
    I18nPips,
    AmmountPips,
    AmmountKPips
  ],
  providers: [
    WorkFlowStartService,
    LocalStorage,
    MessageService,
    RefreshMenuService,
    DataManageService,
    ConfirmationService
  ],
  exports: [
    I18nPips,
    AmmountPips,
    AmmountKPips
  ]
})
export class PagesModule {
}
