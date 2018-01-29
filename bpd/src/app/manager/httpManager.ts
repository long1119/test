import { Http,Headers,RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { hostBase } from './microserver';

@Injectable()
export class HttpManager{

    constructor(private http:Http){}

}
