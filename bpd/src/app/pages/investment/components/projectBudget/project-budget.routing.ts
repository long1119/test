/**
 * Created by 田建辉 on 2017/8/21.
 */
import {Routes, RouterModule}  from '@angular/router';
import {projectBudgetComponent} from "./project-budget.component";

const routes: Routes = [
    {
        path: '', component : projectBudgetComponent
    }
];

export const routing = RouterModule.forChild(routes);
