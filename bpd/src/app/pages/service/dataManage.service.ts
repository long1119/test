import {
    Injectable,
    OnInit
} from '@angular/core';

@Injectable()
export class DataManageService {
    /**
     * 表格初始化数据
     * 
     * @private
     * @param {any} data 
     * @param {any} n 
     * @returns 
     * @memberof DataManageService
     */
    public addEmptyOnInitTableData(n: number, data: any[] = []) {
        for (let i = 0; i < n; i++) {
            data.push({
                id: i
            });
        }
        return data;
    }

    /**
     * 添加分页假数据
     * 
     * @private
     * @param {any} data 元数据
     * @param {any} n 假数据条数
     * @returns 
     * @memberof DataManageService
     */
    public addEmptyPaginatorTableData(data: any, n: number) {
        if (!data.rows.length) {
            data.rows = [{}];
        }
        let length = data.rows.length;
        if (length > 0 && length < n) {
            for (let i = 0; i < n - length; i++) {
                data.rows.push({
                    id: i
                });
            }
        }
        return data.rows;
    }

    /**
     * 添加表格假数据
     * 
     * @private
     * @param {any} data 原数据
     * @param {any} n 假数据条数
     * @returns 
     * @memberof DataManageService
     */
    public addEmptyTableData(data: any[], n: number) {
        if (!data.length) {
            data = [{}];
        }
        let length = data.length;
        if (length > 0 && length < n) {
            for (let i = 0; i < n - length; i++) {
                data.push({
                    id: i
                });
            }
        }
        return data;
    }

    /**
     * 循环树表获取对应项
     * 
     * @param {any} id 对应项值
     * @param {String} key 对应项标识
     * @param {Array} nodeList 树表数据
     * @param {Array} selectedRowList 对应数据，传入空数组 
     * @returns 
     * @memberof DataManageService
     */
    public treeCircle(id :string | number, key: string, nodeList: any[], selectedRowList: any[]) {
        let newNodeList: any[] = [];
        let n = 0;
        let newSelectedList = selectedRowList || [];
        for (let i = 0; i < nodeList.length; i++) {
            if (id == nodeList[i].data[key]) {
                newSelectedList.push(nodeList[i]);
                // break;
            }
            if (nodeList[i].children && nodeList[i].children.length != 0) {
                newNodeList = newNodeList.concat(nodeList[i].children);
            }
        }
        let flag = true;
        for (let i = 0; i < newNodeList.length; i++) {
            if (newNodeList[i].children && newNodeList[i].children.length != 0) {
                flag = false;
            }
        }
        if (newNodeList.length != 0) {
           this.treeCircle(id, key, newNodeList, newSelectedList);
        }
        if (flag) {
            return newSelectedList;
        }
    }

    public getTree(arr: any[] = [],expanded): any {
        let newArr: any[] = [];
        let stepArr: any[] = [];
        for (let i = 0; i < arr.length; i++) {
            arr[i].value = arr[i].dirId;
            arr[i].label = arr[i].dirEname;
            arr[i].itemStore = arr[i];
            arr[i].expanded = expanded;
            arr[i].children = [];
            if (!arr[i].parentId) {
                arr[i].icon = 'fa-clipboard';
                stepArr.push(arr[i]);
            } else {
                arr[i].icon = 'fa-clipboard';
                arr[i].icon = 'fa-file-text-o';
            }
            
            for (let j = 0; j < arr.length; j++) {
                if (arr[i].id === arr[j].parentId) {
                    arr[i].children.push(arr[j]);
                }
            }
        }
        for (let k = 0; k < stepArr.length; k++) {
            for (let l = 0; l < arr.length; l++)
            if (stepArr[k].id === arr[l].id) {
                newArr.push(arr[l]);
            }
        }
        return newArr;
    }

    public getUuId() {
        let charArr = [];
        let hexDigits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let i = 0; i < 32; i++) {
            charArr[i] = hexDigits.substr(Math.floor(Math.random() * 62), 1);
        }
        return charArr.join("");
    }

    /**
     * 当存在对应key时返回true否则返回false
     * @param authorityKey 需要校验的键 
     */
    public buttonAuthority(authorityKey: string): Boolean {
        let localStorage = JSON.parse(window.localStorage.getItem("authorityData")) || new Object;
        let flag = false;
            if (localStorage[authorityKey]) {
                flag = true;
            }
        return flag;
    }

    /**
     * 日期转字符串
     * 
     * @memberof DataManageService
     */
    public getStrDate(date: Date = new Date(), symbol: string = "-", type: string = "date"): string {
        let year: string = String(date.getFullYear());
        let month: string = String(Number(date.getMonth()) + 1);
        let day: string = String(date.getDate());
        if (month.length === 1) {
            month = "0" + month;
        } 
        if (day.length === 1) {
            day = "0" + day;
        }
        let strDate: string = year;
        if (type === "month") {
            strDate = year + symbol + month;
        } else if (type === "date") {
            strDate = year + symbol + month + symbol + day
        }
        return strDate;
    }

    /**
     * 字符串转日期
     * 
     * @memberof DataManageService
     */
    public getDateDate(str: string, symbol: string = "-"): Date {
        let dateArr = str.split(symbol) || [];
        let flag: Boolean = true;
        for (let i = 0; i < dateArr.length; i++) {
            if (Number(dateArr[i]) === NaN) {
                flag = false;
            }
        }
        let year: number = 0;
        let month: number = 0;
        let day: number = 0;
        if (flag) {
            year = Number(dateArr[0]) || 0;
            month = Number(dateArr[1]) - 1 || 0;
            day = Number(dateArr[2]) || 0;
        }
        let dateDate: Date;
        if (month == 0) {
            return new Date(year);
        } else if (day == 0) {
            return new Date(year, month)          
        } else {
            return new Date(year, month, day);
        }
    }

    public checkUpload($event: any, type: string = "xls") {
        let nameArr = $event.files[0].name.split(".");
        let fileType = nameArr[nameArr.length - 1];
        if (fileType === type) {
            return false;
        } else {
            return true;
        }
    }
}