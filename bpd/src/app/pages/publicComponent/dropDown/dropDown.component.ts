import { Component, OnInit , Input, OnChanges, SimpleChanges} from '@angular/core';

// import "style-loader!./dropDown.scss";
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'drop-down',
    templateUrl: './dropDown.html',
    styleUrls: ['./dropDown.scss']
})

export class DropDown {
    @Input() dropDownList: SelectItem;
    
    constructor() {

    }

    ngOnInit() {

    }
}