/**
 * Created by wanghui on 2017/6/30.
 */
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../ebon/auth/user.service';
import { AUTHORIZE_URL } from '../../ebon/auth/const.data';

@Injectable()
export class MudoleCanActivate implements CanActivate{

    constructor( private userService: UserService){}
    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
        console.log('catch url request: ' + location.href);
            return false;
    }

}
