import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ammountPips'})
export class AmmountPips implements PipeTransform {

  public transform(num:any, arg:boolean): string {
    if(num) {
        var num = (num || 0).toString(), result = '';
        if(num.indexOf(".") == -1) {
           while (num.length > 3) {
                result = ',' + num.slice(-3) + result;
                num = num.slice(0, num.length - 3);
           }
           if (num) { result = num + result; }
           result = result + ".00";
           if(!arg) {
             return result;
           } else {
             return result.substring(0,result.length-3);
           } 
        } else {
           let minNum = num.split(".")[0].toString();
           let litNum = num.split(".")[1].toString();
           while (minNum.length > 3) {
                result = ',' + minNum.slice(-3) + result;
                minNum = minNum.slice(0, minNum.length - 3);
           }
           if (minNum) { result = minNum + result; }
           if(litNum.length >= 2) {
               litNum = litNum.slice(0,2);
           } else {
               litNum = litNum + "0";
           }
           result = result+"."+litNum;
           if(!arg) {
             return result;
           } else {
             return result.substring(0,result.length-3);
           }
        }
    } else {
        return num;
    }
  }
}