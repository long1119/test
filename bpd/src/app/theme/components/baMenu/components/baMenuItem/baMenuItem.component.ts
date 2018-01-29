import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { BaMenuService } from '../../../../../theme/services/baMenu/baMenu.service';
import { HttpDataService } from '../../../../../pages/service/http.service';

import 'style-loader!./baMenuItem.scss';

@Component({
  selector: 'ba-menu-item',
  templateUrl: './baMenuItem.html',
  providers: [HttpDataService],
})
export class BaMenuItem {

  @Input() menuItem:any;
  @Input() child:boolean = false;

  @Output() itemHover = new EventEmitter<any>();
  @Output() toggleSubMenu = new EventEmitter<any>();

  private menus: any = [];
  public menusOne: any = [];
  public menusTwo: any = [];
  public showMenuFlag: Boolean = true;

  constructor(
    private _menuService: BaMenuService,
    private httpService: HttpDataService,
  ) {

  }

  public onHoverItem($event):void {
    this.itemHover.emit($event);
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  public onToggleSubMenu($event, item):boolean {
    $event.item = item;
    this.toggleSubMenu.emit($event);
    return false;
  }

  public listClick($event) {
    let id: string = $event.route.id;
    this.httpService.get("/bpd-proj/bpd/menu/setUserMenu?menuId=" + id)
      .subscribe(data => {

      })
  }
}
