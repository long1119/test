import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Http  } from '@angular/http';
import { BaMenuService } from '../theme';
import { GlobalState } from '../global.state';
import { ConfirmationService } from 'primeng/primeng';
import { LocalStorage } from './portal/workPortal/local.storage';
import { RefreshMenuService } from './service/refreshMenu.service';
import { DataManageService } from './service/dataManage.service';

import 'style-loader!./pages.scss';
// import { window } from 'rxjs/operator/window';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar></ba-sidebar>
    <ba-page-top></ba-page-top>
    
    <div class="al-main" [ngStyle]="{'margin-right':isSidebtnCollapsed?'0px':'52px'}">
      <div class="al-content">
        <workflow-start></workflow-start>
        <p-confirmDialog></p-confirmDialog>
        <ba-content-top>
        </ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>

    <ba-back-top position="200"></ba-back-top>
    `
})

export class Pages {

  public isSidebtnCollapsed:boolean = true;


  constructor(
      private _menuService: BaMenuService,
      private http: Http,
      private _state: GlobalState,
      private localStorage: LocalStorage,
      private refreshMenuService: RefreshMenuService,
      private dataManageService: DataManageService,
      private confirmationService: ConfirmationService) {

    this._state.subscribe('sidebtn.isCollapsed', (isCollapsed) => {
      this.isSidebtnCollapsed = isCollapsed;
    });
    this._state.subscribe('deleteConfirm', (confirmData) => {
      this.confirmationService.confirm({
        message: 'Do You Want To Delete This Record?',
        header: 'Delete Confirmation',
        icon: 'fa fa-trash',
        accept: () => {
           confirmData.callback()
        }
      });
    })
    let flag = this.dataManageService.getUuId()
    window.onhashchange = this.refreshMenuService.refreshMenu(flag);
  }

  ngOnInit() {
    let menusTwo = window.localStorage.getItem("menusTwo") ? JSON.parse(window.localStorage.getItem("menusTwo")) : [];
    let menusOne = window.localStorage.getItem("menusOne") ? JSON.parse(window.localStorage.getItem("menusOne")) : [];
    let menus = [{
      path: 'pages',
      children: menusOne.concat(menusTwo)
    }];
    this._menuService.updateMenuByRoutes(<Routes>menus);
  }
}



