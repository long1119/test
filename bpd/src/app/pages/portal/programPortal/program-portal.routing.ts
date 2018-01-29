/**
 * Created by 田建辉 on 2017/8/22.
 */
import {Routes, RouterModule}  from '@angular/router';
import {programPortalComponent} from "./program-portal.component";

const routes: Routes = [
    {
        path: '', component : programPortalComponent
    }
];

export const routing = RouterModule.forChild(routes);
