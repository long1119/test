import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { BaMenuService } from '../../services';
import { GlobalState } from '../../../global.state';

import 'style-loader!./baHash.scss';

@Component({
  selector: 'ba-hash',
  templateUrl: './baHash.html'
})
export class BaHash {
    hashs:any = location.hash.split('/');

    ngOnInit() {
        this.hashs.shift();

    }

    hashClick(idx) {
        
    }
};