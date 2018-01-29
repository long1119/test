import { Component, ElementRef, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { GlobalState } from '../../../global.state';

import 'style-loader!./baPageTop.scss';
import { BaMenuService } from '../../../theme/services/baMenu/baMenu.service';
import { Routes } from '@angular/router';
import { LocalStorage } from '../../../pages/portal/workPortal/local.storage';
import { Router, ActivatedRoute } from '@angular/router';
import { AUTHORIZE_URL, LOGOUT_URL } from '../../../ebon/auth/const.data';

@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
})
export class BaPageTop implements OnInit {
  public activ;
  public isScrolled: boolean = false;
  public isMenuCollapsed: boolean = false;
  private menus: any = [];
  public menusOne: any = [];
  public menusTwo: any = [];
  public showMenuFlag: Boolean = true;
  public loginUserName: string = 'Login';

  constructor(
    private _state: GlobalState,
    private _menuService: BaMenuService,
    private http: Http,
    private localStorage: LocalStorage,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
    this._state.subscribe("refreshMenu", data => {
      this.ngOnInit();
    })
  }

  ngOnInit() {
    let menus: any[] = window.localStorage.getItem("menus") ? JSON.parse(window.localStorage.getItem("menus")) : [];
    this.menusTwo = window.localStorage.getItem("menusTwo") ? JSON.parse(window.localStorage.getItem("menusTwo")) : [];
    this.menusOne = window.localStorage.getItem("menusOne") ? JSON.parse(window.localStorage.getItem("menusOne")) : [];
    let arr = location.hash.split("/");
    let str: string = "";
    for (let i = 1; i < arr.length; i++) {
      if (i === 1) {
        str = arr[i];
      } else {
        if (arr.length < 4) str += "/" + arr[i];
        else {
          str += "/" + arr[i];
          // if(i==arr.length-2)break;
        }
      }
    }
    str = '/' + str;
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].children && menus[i].children.length != 0) {
        for (let j = 0; j < menus[i].children.length; j++) {
          if (str.indexOf(menus[i].children[j].path) != -1) {
            if (i > 7) {
              this.showMenuFlag = false;
            } else {
              this.showMenuFlag = true;
            }
          }
        }
      } else {
        if (str.indexOf(menus[i].routerLink) != -1) {
          if (i > 7) {
            this.showMenuFlag = false;
          } else {
            this.showMenuFlag = true;
          }
        }
      }
    }
    if (this.showMenuFlag === true) {
      this.getSelectedMenu(this.menusOne, str);
    } else {
      this.getSelectedMenu(this.menusTwo, str);
    }
    this.loginUserName = this.localStorage.get("userName") ? this.localStorage.get("userName") : 'Login';
  }

  getSelectedMenu(menus, str) {
    let menuFlag: Boolean = true;
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].children && menus[i].children.length != 0) {
        for (let j = 0; j < menus[i].children.length; j++) {
          if(!menus[i].children[j].path) {
            for(let s = 0; s<menus[i].children[j].children.length; s++) {
              if (str.indexOf(menus[i].children[j].children[s].path) != -1) {
                  menuFlag = false;
                  this.loadMenus(menus[i]);
                  if (i > 7) {
                    this.showMenuFlag = false;
                  }
                  break;
                }
            }
          }
          if (str.indexOf(menus[i].children[j].path) != -1) {
            menuFlag = false;
            this.loadMenus(menus[i]);
            if (i > 7) {
              this.showMenuFlag = false;
            }
            break;
          }
        }
      } else {
        if (str.indexOf(menus[i].routerLink) != -1) {
          menuFlag = false;
          this.loadMenus(menus[i]);
          if (i > 7) {
            this.showMenuFlag = false;
          }
          break;
        }
      }
      if (menuFlag) {
        this.loadMenus(menus[0]);
      }
    }
  }

  loadMenus(data) {
    if (data.length !== 0) {
      let menus = [{
        path: 'pages',
        children: data.children
      }];
      this.activ = data;
      this._menuService.updateMenuByRoutes(<Routes>menus);
    }
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  startSearch2(): void {

    let menus = [{
      path: 'pages',
      children: [{
        path: 'editors',
        data: {
          menu: {
            title: 'Editors',
            icon: 'ion-edit',
            selected: false,
            expanded: false,
            order: 100,
          }
        },
        children: [
          {
            path: 'ckeditor',
            data: {
              menu: {
                title: 'CK/bpd-proj/bpd/menu/getMenuTreeEditor',
              }
            }
          }
        ]
      }]
    }];
    this._menuService.updateMenuByRoutes(<Routes>menus);
  }
  startSearch1(): void {
    let menus = [{
      path: 'pages',
      children: [{
        path: 'dashboard',
        data: {
          menu: {
            title: 'Dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      }
      ]
    }];
    this._menuService.updateMenuByRoutes(<Routes>menus);
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }

  public menuPreviousAndNext($event) {
    this.showMenuFlag = !this.showMenuFlag;
    let arr = location.hash.split("/");
    let str: string = "";
    for (let i = 1; i < arr.length; i++) {
      if (i === 1) {
        str = arr[i];
      } else {
        if (arr.length < 4) str += "/" + arr[i];
        else {
          str += "/" + arr[i];
          // if(i==arr.length-2)break;
        }
      }
    }
    str = '/' + str;
    if (this.showMenuFlag === true) {
      this.getSelectedMenu(this.menusOne, str);
    } else {
      this.getSelectedMenu(this.menusTwo, str);
    }
  }

  public logout() { // 退出登陆
    this.http.get("/bpd-proj/bpd/initUser/cancle?_" + Number(new Date()))
    .subscribe(data => {
      // 清除localStorage
      window.localStorage.clear();
      // 清除cookie
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);  
      if(keys) {  
          for(var i = keys.length; i--;)  
              document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()  
      }
      this.loginUserName = 'Login';
      window.sessionStorage.clear()

      // auth认证
      // window.location.href = LOGOUT_URL;

      // QA DEV 前后分离
      window.location.href = "#/pages/work-portal";
      
      // 前后台包一体模式
      // window.location.href = "/bpd-proj/index.html#/pages/work-portal";
      
    })
  }

  public changeLanguage() {  // 切换中英文
    if (window.localStorage.getItem("isEnglish") == "1") {
      window.localStorage.setItem("isEnglish", "0");
      window.location.reload();
    } else {
      window.localStorage.setItem("isEnglish", "1");
      window.location.reload();
    }
  }

  public listClick($event) {
    let id: string = $event.children[0].id;
    this.http.get("/bpd-proj/bpd/menu/setUserMenu?menuId=" + id)
      .subscribe(data => {

      })
  }
}


