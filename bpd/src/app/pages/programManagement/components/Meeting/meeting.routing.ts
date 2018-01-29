import {Routes,RouterModule} from '@angular/router';

import {meetingComponent} from './meeting.component';

const routes: Routes = [
    {
        path: '',
        component: meetingComponent
    }    
]

export const routing = RouterModule.forChild(routes)
