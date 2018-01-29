import { Component, ViewContainerRef, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { BaThemeConfig } from './theme/theme.config';
import { layoutPaths } from './theme/theme.constants';
import {
  RefreshMenuService
} from './pages/service/refreshMenu.service';

import 'style-loader!./app.scss';
import 'style-loader!./theme/initial.scss';
// import 'style-loader!./ebon/primeng/resources/themes/omega/theme.css';
// import 'style-loader!./ebon/primeng/resources/primeng.min.css';
import 'style-loader!./ebon/css/ebon.css';
import { DataManageService } from './pages/service/dataManage.service';


/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `,
  providers: [RefreshMenuService]
})

export class App {

  isMenuCollapsed: boolean = false;
  isSidebtnCollapsed: boolean = false;
  constructor(private _state: GlobalState,
              private _imageLoader: BaImageLoaderService,
              private _spinner: BaThemeSpinner,
              private viewContainerRef: ViewContainerRef,
              private themeConfig: BaThemeConfig,
              private refreshMenuService: RefreshMenuService,
              private dataManageService: DataManageService
            ) {

    themeConfig.config();

    this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

    this._state.subscribe('sidebtn.isCollapsed', (isCollapsed) => {
      this.isSidebtnCollapsed = isCollapsed;
    });
  }

  @Input()
  hashs: string;
  ngOnChanges(changes: SimpleChanges) {
    console.log(this.hashs);
    if (this.hashs) {
      let flag = this.dataManageService.getUuId();
      this.refreshMenuService.refreshMenu(flag);
    }
  }
  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });
  }

  private _loadImages(): void {
    // register some loaders
    BaThemePreloader.registerLoader(this._imageLoader.load(layoutPaths.images.root + 'sky-bg.jpg'));
  }

}
