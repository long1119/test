import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'i18nPips'})
export class I18nPips implements PipeTransform {

  public transform(value:string): string {
  	let isen:boolean = window.localStorage.getItem("isEnglish") == "1";

    // 表格
    if(value=='No') {
        if(isen) {
            return 'No';
        } else{
            return '序号';
        }
    } else if(value=='User Name') {
        if(isen) {
            return 'User Name';
        } else {
            return '用户名';
        }
    } else if(value=='User Code') {
        if(isen) {
            return 'User Code';
        } else {
            return '用户编号';
        }
    } else if(value=='Job') {
        if(isen) {
            return 'Job';
        } else {
            return '职位';
        }
    } else if(value=='Department') {
        if(isen) {
            return 'Department';
        } else {
            return '部门名称';
        }
    } else if(value=='Telephone') {
        if(isen) {
            return 'Telephone';
        } else {
            return '电话号码';
        }
    } else if(value=='Email') {
        if(isen) {
            return 'Email';
        } else {
            return '电子邮箱';
        }
    } else if(value=='Manager') {
        if(isen) {
            return 'Manager';
        } else {
            return '管理员';
        }
    } else if(value=='Telephone') {
        if(isen) {
            return 'Telephone';
        } else {
            return '电话号码';
        }
    } else if(value=='Employee') {
        if(isen) {
            return 'Employee';
        } else {
            return '工号';
        }
    } else if(value=='obligate') {
        if(isen) {
            return 'obligate';
        } else {
            return '预留';
        }
    } 

    // 按钮
    else if(value=='Set Role') {
        if(isen) {
            return 'Set Role';
        } else {
            return '设置角色';
        }
    } else if(value=='Operation') {
        if(isen) {
            return 'Operation';
        } else {
            return '操作';
        }
    } else if(value=='Search') {
        if(isen) {
            return 'Search';
        } else {
            return '搜索';
        }
    } else if(value=='Add') {
        if(isen) {
            return 'Add';
        } else {
            return '添加';
        }
    } else if(value=='obligate') {
        if(isen) {
            return 'obligate';
        } else {
            return '预留';
        }
    } 

    // 对话框
    else if(value=='obligate') {
        if(isen) {
            return 'obligate';
        } else {
            return '预留';
        }
    } else {
        return value.toString();
    }
  }
}