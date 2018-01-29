/**
 * Created by 田建辉 on 2017/8/21.
 */
import {Component,OnInit} from '@angular/core';
import {InputTextModule,DropdownModule,ButtonModule} from 'primeng/primeng';
import 'style-loader!./project-budget.scss';
@Component({
    selector:'project-budget',
    templateUrl:'./project-budget.html'
})
export class projectBudgetComponent{
    ngOnInit(){

    };

    lookUpEnterSearch($event) {
        if ($event.key === "Enter") {
            this.lookUp();
        }
    }

    lookUp(){

    };

}