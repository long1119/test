/**
 * Created by wanghui on 2017/6/30.
 */
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {
  // 维护用户身份信息
  principal: string = null;
  private userCode: string;

  constructor(private http: Http, private router: Router){ }

  // 获取TokenRecords
  static getToken() {
    if (null != sessionStorage.getItem('token')){
      console.log('Now i load sessionStorage[token]: ' + sessionStorage.getItem('token'));
      let token = JSON.parse(sessionStorage.getItem('token'));
      console.log('Now i get accessToken from sessionStorage[token]: ' + token.access_token);
      return token;
    }
  }

  // 获取用户信息
  static getUserInfo() {
    if (null != sessionStorage.getItem('userInfo')){
      console.log('Now i load sessionStorage[userInfo]: ' + sessionStorage.getItem('userInfo'));
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      return userInfo;
    }
  }

  /**
   * 请求ebon后台，通过code或者access_token实现后台认证和登陆，
   * 返回 token、userInfo、sysUser 信息
   * @param {string} code
   * @param {string} accessToken
   */
  ebonOauthLogin(code: string, accessToken: string){
    this.http.get(`/bpd-proj/oauthLogin?code=${code}&accessToken=${accessToken}`).subscribe(success => {
      console.log(success.json());
      let successJson = success.json();
      if(successJson.code==='0'){
        alert(successJson.msg);
        return;
      }
      sessionStorage.setItem('token', JSON.stringify(successJson['token']));
      sessionStorage.setItem('access_token', JSON.stringify(successJson['token']['access_token']));
      sessionStorage.setItem('userInfo', JSON.stringify(successJson['oauthUserInfo']));
      window.localStorage['userMsg'] = JSON.stringify(successJson['user']);
      this.userCode = successJson.user.userCode;
      this.getMenuAndBtnPermis();

    }, error => {
    });
  }

  /**
   *  获取菜单和权限
   */
  getMenuAndBtnPermis(): void {
    // this.get(`app/menu/getNgMenuTree?_=${ new Date().getTime() }`).subscribe(res1 => {
    //   window.localStorage['menuJson'] = JSON.stringify(res1);
    //   this.get(`inituser/permissions?_=${ new Date().getTime() }`).subscribe(res2 => {
    //     window.localStorage['array'] = JSON.stringify(res2);
    //     location.href = '#/pages/adminner';
    //     //this.router.navigate(['pages/adminner']);
    //   });
    // });
    this.get('/bpd-proj/bpd/initUser?userCode=' + this.userCode + '&' + Number(new Date()))
            .subscribe(data => {
                if(data.userCode) {
                    window.localStorage.setItem('userInformation', JSON.stringify(data));
                    window.localStorage.setItem('userName',data.userName);
                    window.localStorage.setItem('user',data.userCode);
                    window.localStorage.setItem('isEnglish',"1");
                    this.getmenuSignList();
                } else {
                    // this.msgservice.showInfo("User unviable");
                    // this.msgs = this.msgservice.msgs;
                    // alert("User unviable");
                    // return;
                }
            })
  }
  get(url: string): Observable<any> {
    return this.http.get(url).map((res) => {
        return res.json();
      }).catch((error: any) => Observable.throw(error || 'Server error'));
  }

  private getmenuSignList() {
        this.get('/bpd-proj/bpd/menuPermission/getMenuSignList?userCode=' + this.userCode + '&' + Number(new Date()))
        .subscribe(data => {
            window.localStorage.setItem('authorityData', JSON.stringify(data));
            this.getMenuTree();
        })
    }

  private getMenuTree() {
        // this.service.get("data/menu.json")
        this.get("/bpd-proj/bpd/menu/getPermMenuTree?" + Number(new Date()) + "&userCode=" + this.userCode)
        .subscribe(success =>{
            if(success.length) {
                let menusTwo = [];
                let menusOne = [];
                for (let i  = 0; i < success.length; i++) {
                    if (i < 7) {
                        menusOne.push(success[i]);
                    }
                    if (success.length > 7 && i >= success.length - 7) {
                        menusTwo.push(success[i]);
                    }
                }
                window.localStorage.setItem("menus", JSON.stringify(success));
                window.localStorage.setItem("menusTwo",JSON.stringify(menusTwo));
                window.localStorage.setItem("menusOne",JSON.stringify(menusOne));
                // QA
                let url = window.location.href = "#/pages/" + JSON.parse(window.localStorage.getItem("menusOne"))[0].routerLink;
                // alert(url);
                // 开发
                // window.location.href = "/bpd-proj/index.html#/pages/" + JSON.parse(window.localStorage.getItem("menusOne"))[0].routerLink;
                window.location.reload();
            } else {
                alert("No Menu Tree");
                return;
            }
        });
    }
}
