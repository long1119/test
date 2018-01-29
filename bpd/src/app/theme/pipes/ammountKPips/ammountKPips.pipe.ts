import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ammountKPips'})
export class AmmountKPips implements PipeTransform {

  public transform(number:any): string {
    if(number) {
        var num = (Number(number/1000) || 0).toString(), result = '';
        if(num.indexOf(".") == -1) {
           while (num.length > 3) {
                result = ',' + num.slice(-3) + result;
                num = num.slice(0, num.length - 3);
           }
           if (num) { result = num + result; }
           result = result + ".00";
           return result; 
        } else {
           let minNum = num.split(".")[0].toString();
           let litNum = num.split(".")[1].toString();
           while (minNum.length > 3) {
                result = ',' + minNum.slice(-3) + result;
                minNum = minNum.slice(0, minNum.length - 3);
           }
           if (minNum) { result = minNum + result; }
           if(litNum.length >= 3) {
               litNum = Math.round(Number(litNum.slice(0,3))/10).toString();
           } else {
               litNum = litNum;
           }
           result = result+"."+litNum;
           return result;
        }
    } else {
        return number;
    }
  }
}