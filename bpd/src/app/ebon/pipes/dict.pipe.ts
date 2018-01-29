import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dict'})
export class DictPipe implements PipeTransform {
  transform(value: any, dict: any): any {
      if(!!value){
        for(var i in dict){
          if(dict[i].value == value)
            return dict[i].label;
        }
      }else{
        return "";
      }
  }
}
