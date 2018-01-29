import {
    Routes,
    RouterModule
} from '@angular/router';
import {
    CurrencyTemplate
} from './currencyTranslation.component'

const routes: Routes = [{
    path: '',
    component: CurrencyTemplate
}]

export const routing = RouterModule.forChild(routes);