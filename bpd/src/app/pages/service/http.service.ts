import {Injectable, OnInit} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpDataService {

  //get json对象请求头
  // private getHeaders = new Headers({Cache-Control: no-cache, no-store, must-revalidate
// })

  //post json对象请求头
  private postHeaders = new Headers({'Content-Type': 'application/json'});
  //post请求选项
  private postRequestOptions = new RequestOptions({headers: this.postHeaders});


  constructor(public http: Http) {

  }



//   getFiles() {
//     return this.http.get('assets/showcase/data/files.json')
//       .toPromise()
//       .then(res => <TreeNode[]> res.json().data);
//   }


//   getFilesystem() {
//     return this.http.get('assets/showcase/data/filesystem.json')
//       .toPromise()
//       .then(res => <TreeNode[]> res.json().data);
//   }

  // get请求
  get(url: string): Observable<any> {
    return this.http.get(url)
      .map((res) => {
        if(typeof(res['_body']) == 'string') {
          try {
            return res.json()
          } catch(e) {
            return res['_body'];
          }
        }
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  /**
   * post请求
   * @param url
   * @param paramBody 【必须】post参数请求体，是一个object对象，如果无参数，发送{}，
   *                   所有的post请求方式，参数都在请求体中
   */
  post(url: string, paramBody: any) {
    if (paramBody == null) {
      paramBody = {};
    }
    return this.http.post(url, paramBody, this.postRequestOptions)
      .map((res) => {
        if(typeof(res['_body']) == 'string') {
          try {
            return res.json()
          } catch(e) {
            return res['_body'];
          }
        }
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // tslint:disable-next-line:member-ordering
  data: any;

  ngOnInit() {
  }

}
