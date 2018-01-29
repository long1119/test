import {Component, ViewChild, ElementRef} from '@angular/core';
import {GlobalState} from '../../../global.state';

@Component({
  selector: 'ba-sidebtn',
  styleUrls: ['./baSidebtn.scss'],
  template: `
    <br>
    <i class="{{isSidebtnCollapsed?'ion-android-arrow-dropright-circle':'ion-android-arrow-dropleft-circle'}} ba-sidebtn-top" (click)="toggleMenu()"></i>
    <div #baSidebtn [ngClass]="{'ba-sidebtn': isSidebtnCollapsed}">
      <br>
      <button type="button" class="btn btn-primary btn-icon"><i class="ion-android-download"></i></button>
      <button type="button" class="btn btn-default btn-icon"><i class="ion-stats-bars"></i></button>
      <button type="button" class="btn btn-success btn-icon"><i class="ion-android-checkmark-circle"></i></button>
      <button type="button" class="btn btn-info btn-icon"><i class="ion-information"></i></button>
      <button type="button" class="btn btn-warning btn-icon"><i class="ion-android-warning"></i></button>
      <button type="button" class="btn btn-danger btn-icon"><i class="ion-nuclear"></i></button>
    </div>
  `
})
export class BaSidebtn {

  public isSidebtnCollapsed:boolean = true;
  constructor(private _state:GlobalState) {}
  public toggleMenu() {
    this.isSidebtnCollapsed = !this.isSidebtnCollapsed;
    this._state.notifyDataChanged('sidebtn.isCollapsed', this.isSidebtnCollapsed);
    return false;
  }


  @ViewChild('baSidebtn') _selector:ElementRef;

}
