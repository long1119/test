/**
 * Created by Ebon-lax on 2017/8/23.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PermissionService {
  array: any;
  permissMap: any;

  // constructor(private http: Http) {
  //   this.array = window.localStorage['array'];
  // }

  /*getPermission(key) {
    // return true;
    if (this.array) {
      let array = JSON.parse(this.array);

      for (let i = 0; i < array.length; i++) {
        if (array[i] === key) {
          return true;
        }
      }
    }
  }*/

  //modified by ganyimeng
  constructor(private http: Http) {
    this.array = window.localStorage['array'];
    if (this.array) {
      this.permissMap = JSON.parse(this.array);
    }

  }

  // //modified by ganyimeng
  getPermission(key) {
    if (this.permissMap && this.permissMap[key]===1) {
      // console.log(this.permissMap[key] +':'+ true);
      return true;
    }else{
      // console.log(this.permissMap[key] +':'+ false);
      return false;
    }
  }


  // get请求
  get(url: string): Observable<any> {
    return this.http.get(url)
      .map((res) => {
        return res.json();
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  loadAuth(successFunc: ((suc) => void)) {
    this.get(`inituser/permissions?_=${new Date().getTime()}`).subscribe(res => {
      // 存储按钮权限的信息
      window.localStorage['array'] = JSON.stringify(res);
      this.array = window.localStorage['array'];
      this.permissMap = JSON.parse(this.array);
      successFunc(res);
    });
  }

  reload() {
    this.loadAuth(res => {
    });
  }


}
