import {Injectable, OnInit} from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RegionGroupService {

  //post json对象请求头
  private headers = new Headers({'Content-Type': 'application/json'});
  //post请求选项
  private postRequestOptions = new RequestOptions({headers: this.headers});


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
        return res.json()
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
        return res.json()
      })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  // tslint:disable-next-line:member-ordering
  data: any;

  ngOnInit() {
  }

}
