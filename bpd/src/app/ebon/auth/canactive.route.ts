/**
 * Created by wanghui on 2017/6/30.
 */
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../ebon/auth/user.service';
import { AUTHORIZE_URL } from '../../ebon/auth/const.data';

@Injectable()
export class SgmCanActivate implements CanActivate{

    constructor( private userService: UserService){}
    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean {
        console.log('catch url request: ' + location.href);
        if (UserService.getUserInfo()) {
            console.log('u have authenticated');
            return true;
        } else if (UserService.getToken()) {
            console.log('u have catch token');
            let accessToken = UserService.getToken().access_token;
            // 调用获取身份函数
            this.userService.ebonOauthLogin('', accessToken);
            return false;
        } else if (location.search.indexOf('?code=') === 0) {
            let code = location.search.substr(6, 6);
            console.log('now i am in ssologin with code: ' + code);
            // 首先获取
            this.userService.ebonOauthLogin(code, '');
            return false;
        } else {
            console.log('u need be authenticated');
            location.href = AUTHORIZE_URL;
            return false;
        }
    }

}
