import {
    Component,
    OnInit
} from '@angular/core';
import 'style-loader!./GVDP-template.scss';
import {
    Message
} from 'primeng/primeng';
import {
    SelectItem
} from 'primeng/primeng';
import {
    HttpDataService
} from '../../../service/http.service';
import {
    MessageService
} from "../../../service/message.service";
import {LocalStorage} from "../../../portal/workPortal/local.storage"
import {
    DataManageService
} from '../../../service/dataManage.service';
import {
    DeleteComfirmService
} from '../../../service/deleteDialog.service';

@Component({
    selector: 'gvdp-template',
    templateUrl: './GVDP-template.html',
    providers: [DataManageService]
})
export class GvdpTemplate {
    template: string;
    GVDPdata: any[] = [];
    tableData: any[] = [];
    value1: any;
    value2: any;
    version: string;
    changed: boolean;
    changed1: boolean;
    description: string;
    elementName: string;
    elementName1: string;
    elementId: string;
    elementType: string;
    // period: number;
    value: any;
    display: boolean = false;
    display1: boolean = false;
    display2: boolean = false;
    display3: boolean = false;
    display4: boolean = false;
    messageDialog: boolean = false;
    messageDialog1: boolean = false;
    messageDialog2: boolean = false;
    addElement: boolean = false;
    messageData: any[];
    selectedCity: any;
    selectedCity1:any;
    templateId: string = " ";
    // displayPosition: string;
    colors: any[];
    msgs: Message[];
    growLife: number;
    growMessage: Message[];
    templateFiles: any;
    val: number;
    flag: any;
    flag1: any;
    flag2: any;
    // flag3: any;
    gvdpTemplateDetail: any;
    GraphicData: any[];
    selectedBox: string[] = [];
    // cities: any[] = [];
    elementTypes:any[] = [];
    selectedType:any;
    gvdpTemplateDetailErr: any[];
    response: any;
    graphicChange: any[];
    selectedValue: any;
    selectedColor: any;
    displayRowNo: any;
    importDisabled: boolean = true;
    elementName2: any;
    elementId2: any;
    widthGraphic: any;
    rowNo: any;
    elementName3:any;
    elementId3:any;
    totalRecord:any;     //  分页总条数
    totalRecord1:any;
    paginatorRow:number;  // 行数
    paginatorPage:number; // 页数
    paginatorRow1:number;
    paginatorPage1:number;
    chooseGvdpDetail:boolean = false;
    file:boolean = false;
    attId:any;
    bussinessId:any;
    // fileName:any;

    powerOfModify:any;     //GVDP维护权限

    graphics:any[];   //加于2017/11/29
    selectedGraphic:any;
    PrimaryElement:boolean = false;
    addPrimaryElement:boolean = false;
    changePrimaryElement:boolean = false;
    selectedValue1: any;
    priElementName:any;
    priElementId:any;
    priWidth:any;
    priRowNo:any;
    priColor:any;
    priType:any;
    primaryElements:any[];
    checked:any;
    metaNames:any[];
    selectedMetaName:any;
    totalRecord2:number;
    paginatorRow2:number;  
    paginatorPage2:number;
    metaTitle:string;
    gotoSwitch:boolean = false;
    templateTitle:string;
    deleteInformation:boolean = false;
    deleteFlag:number = 0;
    gvdpTemplateDetailId:string;
    metaTypeName:string;
    elementIdforsearch:any;
    idName:any;           //new add 2018/1/11
    //gvdp表格的行悬浮事件 
    gotoCover(value) {
        this.flag2 = value;
        if (this.flag2 == this.flag) {
            this.flag2 = -1;
        }
    }

    //  gvdp表格鼠标移出事件
    outTable() {
        this.flag2 = -1;
    }
    // menuOut() {
    //     this.flag3 = -1;
    // }

    // 第一个Add按钮事件
    add() {
        // this.httpService.post("/bpd-proj/bpd/gvdpTemplate/getId",{

        // }).subscribe(data => {
        //     this.bussinessId = data;
        //     this.display = true;
        // })
        this.display = true;
        this.template = "Add Template";
        this.version = "";
        this.description = "";
        // this.fileName = "";
        this.changed = false;
    }
    // Graphic Config 按钮事件
    graphic() {
        this.selectedBox = [];      // 改于2017-10-20 17：20
        this.elementName1 = null;
        this.elementIdforsearch = null;
        this.display2 = true;
        this.paginatorPage1 = 1;
        this.paginatorRow1 = 10;
        this.getGraphicData();
        // new add 2017/12/12
        this.httpService.post("/bpd-proj/bpd/elementType/getCombobox", {})
        .subscribe(data => {
            this.elementTypes = data;
            this.elementTypes.unshift({
                label:'please select element type',
                value: ' '
            });
        });
        this.checkSymbol();
    }

    // showGraphic() {
    //     this.display2 = false;
    // }
    // 请求GVDP数据
    requestGVDP(){
        this.httpService.post("/bpd-proj/bpd/gvdpTemplate/getVList", {})
        .subscribe(data => {
            this.GVDPdata = data
        })
    }
    // 《gvdp增加&修改》弹框提交事件 
    confirm() {
        if (!this.changed) {
            this.httpService.post("/bpd-proj/bpd/gvdpTemplate/insert", {
                    "templateTitle": this.version,
                    "descriiption": this.description,
                    // "templateFiles": this.templateFiles,
                    // "templateId": this.bussinessId
                })
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.msgService.showSuccess('Opration Succeed!');
                        this.growLife = 5000;
                        this.requestGVDP();
                    }
                    else if("2" == data.code){
                        this.growLife = 999999;
                        this.msgService.showInfo('This GVDP Already Exist');
                    }
                    else { //操作失败
                        this.growLife = 5000;
                        this.msgService.showError('Opration Failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                    // this.httpService.post("/bpd-proj/bpd/gvdpTemplate/getVList", {})
                    //     .subscribe(data => {
                    //         this.GVDPdata = data
                    //     })
                });
        } else {
            this.httpService.post("/bpd-proj/bpd/gvdpTemplate/update", {
                    "templateTitle": this.version,
                    "descriiption": this.description,
                    // "templateFiles": this.templateFiles,
                    "templateId": this.value1
                })
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.growLife = 5000;
                        this.msgService.showSuccess('Opration Succeed!');
                        this.requestGVDP();
                    } 
                    else if("2" == data.code){
                        this.growLife = 999999;
                        this.msgService.showInfo('This GVDP Already Exist');
                    }
                    else { //操作失败
                        this.growLife = 5000;
                        this.msgService.showError('Opration Failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                    // this.httpService.post("/bpd-proj/bpd/gvdpTemplate/getVList", {})
                    //     .subscribe(data => {
                    //         this.GVDPdata = data
                    //     })
                });
        }
        this.display = false;
        this.changed = false;
    }

    // 《gvdp增加&修改》弹框取消事件
    delete() {
        this.display = false;
        this.version = "";
        this.description = "";
    }
    

    //  gvdp 请求数据
    getGVDPdata(){
        this.httpService.post("/bpd-proj/bpd/gvdpTemplateDetail/getList", {
            "elementId":this.elementId3,
            "elementName":this.elementName3,
            "templateId": this.templateId,
            "page": {
              "page": this.paginatorPage,
              "rows": this.paginatorRow
            }
          })
          .subscribe(data => {
            this.totalRecord = data.total;
            // if (!data.rows.length) {
            //   data.rows = [{}];
            // }
            // let length = data.rows.length;
    
            // while (length > 10) {
            //   length -= 10;
            // }
            // if (length > 0 && length < 10) {
            //   for (let i = 0; i < 10 - length; i++) {
            //     data.rows.push({
            //       id: i
            //     });
            //   }
            // }
            this.tableData = data.rows;
          }) 
    }
    // 颜色值与名称对应函数
    colorMate(array){
        for(let i=0;i<array.length;i++){
            let colorName:string;
            if(array[i].graphicColor == '#FF9900'){
                colorName = 'Orange';
            }
            else if(array[i].graphicColor == '#3365FB'){
                colorName = 'Blue';
            }
            else if(array[i].graphicColor == '#94D352'){
                colorName = 'Green';
            }
            else if(array[i].graphicColor == '#FFC000'){
                colorName = 'Gold';
            }
            else if(array[i].graphicColor == '#FFCC99'){
                colorName = 'Bisque';
            }
            else if(array[i].graphicColor == '#33CC33'){
                colorName = 'Darkgreen';
            }
            else if(array[i].graphicColor == '#404040'){
                colorName = 'Black';
            }
            else if(array[i].graphicColor == '#A6A6A6'){
                colorName = 'Gray';
            }
            else if(array[i].graphicColor == '#D9D9D9'){
                colorName = 'Frenchgray';
            }
            else if(array[i].graphicColor == '#00B2F7'){
                colorName = 'Deepblue';
            }
            else if(array[i].graphicColor == '#528ED6'){
                colorName = 'Darkblue';
            }
            else{
                colorName = array[i].graphicColor;
            };
            array[i].colorName = colorName;
        } 
    }
    // 请求graphic 数据
    getGraphicData(){
        this.httpService.post("/bpd-proj/bpd/graphicConfig/getList", {
            "elementName":this.elementName1,
            "elementId":this.elementIdforsearch,
            "page": {
              "page": this.paginatorPage1,
              "rows": this.paginatorRow1
            }
          })
          .subscribe(data => {
            this.totalRecord1 = data.total;
            // if (!data.rows.length) {
            //   data.rows = [{}];
            // }
            // let length = data.rows.length;
    
            // while (length > 10) {
            //   length -= 10;
            // }
            // if (length > 0 && length < 10) {
            //   for (let i = 0; i < 10 - length; i++) {
            //     data.rows.push({
            //       id: i
            //     });
            //   }
            // }
            this.GraphicData = data.rows;
            if(this.GraphicData.length>0){
                this.colorMate(this.GraphicData);
                for(let i=0;i<this.GraphicData.length;i++){
                    this.GraphicData[i].id = i+1;
                }
            }
          }) 
    }
    // gvdp表格的行点击事件
    choose(value, value1, value2) {
        this.elementName3 = "";
        this.elementId3 = "";
        this.templateId = value;
        this.gvdpTemplateDetail = value1;
        this.flag = value2;
        this.flag2 = -1;
        this.importDisabled = false;
        this.getGVDPdata();
    }

    // gvdp明细增加按钮事件
    add1() {
        this.template = "Add Element";
        this.display1 = true;
        this.changed1 = false;
        this.elementId = "";
        this.elementName = " ";
        // this.selectedType = " ";
        this.selectedCity = "";
        this.val = 0;
        // this.displayPosition = " ";
    }

    // 《gvdp明细增加&修改》弹框提交事件
    confirm1() {
        if (!this.changed1) {
            this.httpService.post("/bpd-proj/bpd/gvdpTemplateDetail/insert", {
                    "templateId": this.templateId,
                    "elementId": this.elementId,
                    "elementName": this.elementName,
                    "elementTypeId": this.selectedCity1,
                    "period": this.val
                    // "displayPosition": this.displayPosition

                })
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.growLife = 5000;
                        this.msgService.showSuccess('Opration Succeed!');
                        this.getGVDPdata();
                    } else if ("2" == data.code) {
                        this.growLife = 999999;
                        this.msgService.showInfo(this.elementId + ' Already Exist!');
                    } else { //操作失败
                        this.growLife = 5000;
                        this.msgService.showError('Opration Failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                });
        } else {
            this.httpService.post("/bpd-proj/bpd/gvdpTemplateDetail/update", {
                    "gvdpTemplateDetailId": this.value2,
                    "elementId": this.elementId,
                    "elementName": this.elementName,
                    "elementTypeId": this.selectedCity1,
                    "period": this.val,
                    // "displayPosition": this.displayPosition
                })
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.growLife = 5000;
                        this.msgService.showSuccess('Opration Succeed!');
                    }
                    else if("2" == data.code){
                        this.growLife = 999999;
                        this.msgService.showInfo(this.elementId + ' Already Exist!');
                    }
                     else { //操作失败
                        this.growLife = 5000;
                        this.msgService.showError('Opration Failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                    // this.httpService.post("/bpd-proj/bpd/gvdpTemplateDetail/getList", {
                    //         "templateId": this.templateId,
                    //         "page": {
                    //             "page": this.paginatorPage,
                    //             "rows": this.paginatorRow
                    //           }
                    //     })
                    //     .subscribe(data => {
                    //         this.tableData = data
                    //     })
                    this.getGVDPdata();
                });
        }
        this.display1 = false;
    }

     // 《gvdp明细增加&修改》弹框取消事件
     delete1(value) {
        this.display1 = false;
        this.elementName = "";
        this.elementId = "";
    }

    // Graphic Config按钮触发的弹框里的修改配置弹框提交事件
    confirm3() {
        let elementId = this.selectedBox.join(",");
        this.httpService.post("/bpd-proj/bpd/graphicConfig/updateAll", {
                "elementIds": elementId,
                "graphicType": this.selectedValue,
                "graphicColor": this.selectedColor,
                "displayPosition": this.displayRowNo,
                "elementTyId": this.selectedType,
                "metaTypeName": this.selectedMetaName
            })
            .subscribe(data => {
                if ("1" == data.code) { //操作成功
                this.growLife = 5000;
                // this.httpService.post("/bpd-proj/bpd/graphicConfig/getList", {})
                // .subscribe(data => {
                //     this.GraphicData = data;
                // });
                this.getGraphicData();
                this.msgService.showSuccess('Opration Succeed!');
                }else { //操作失败
                    this.growLife = 999999;
                    this.msgService.showError('Opration Failed!');
                }
                this.msgs = this.msgService.msgs;
            });
        this.display3 = false;
    }
    // 多选框单选回填
    forOneGoback(){
        if(this.selectedBox.length==1){
            for(let i=0;i<this.GraphicData.length;i++){
                if(this.selectedBox[0]==this.GraphicData[i].elementId){
                    this.selectedValue = this.GraphicData[i].graphicType;
                    this.selectedColor = this.GraphicData[i].graphicColor;
                    this.displayRowNo = this.GraphicData[i].displayPosition;
                    this.selectedType = this.GraphicData[i].elementTyId;
                }
            }
        }
        else{
            this.selectedValue = null;
            this.selectedColor = null;
            this.displayRowNo = null;
            this.selectedType = null;
        }
    }
    // Graphic Config按钮触发的弹框里的按钮事件
    double() {
        this.selectedMetaName = ' ';
        this.forOneGoback();
        this.display3 = true;
    }
    bindSymbolInfo(){
        this.httpService.post("/bpd-proj/bpd/metaGraphic/getList",{
            "metaTypeName":this.selectedMetaName,
            "page":{
                "page":1,
                "rows":1
            }
        }).subscribe(data => {
            if(data.rows.length>0){
                let oneOfSymbol = data.rows[0];
                if(oneOfSymbol.metaTypeName != 'MRD'){
                    this.selectedValue = oneOfSymbol.graphicType.toString();
                    this.selectedColor = oneOfSymbol.graphicColor;
                    this.widthGraphic = oneOfSymbol.width;
                }
                else{
                    this.selectedValue = null;
                    this.selectedColor = null;
                    this.widthGraphic = null;
                }
            }
            else{
                this.selectedValue = null;
                this.selectedColor = null;
                this.widthGraphic = null;
            }
        })
    }
    // 导入按钮点击事件
    importFile() {
        this.display4 = true;
    }

    //导入excel
    onBasicUpload($event) {
        if(!this.msgService.checkoutFileType($event,"xlsx-xls")) {
            this.msgService.showInfo("Unvaliable File Type!");
            this.growLife = 300000;
            this.msgs = this.msgService.msgs;
            return;
          }
        let response = eval('(' + $event.xhr.response + ')');
        // let response = JSON.parse($event.xhr.response);
        this.response = response;
        if (response.code == "1") {
            this.getGVDPdata();
            this.display4 = false;
            this.growLife = 5000;
            this.msgService.showSuccess("Operation Success!");
        } else if (response.code == "3") {
            this.display4 = false;
            this.messageDialog = true;
            this.messageDialog2 = true;
            this.gvdpTemplateDetailErr = response.gvdpTemplateDetailErr;
            console.log(this.gvdpTemplateDetailErr);
        } else if (response.code == "2") {
            this.display4 = false;
            this.messageDialog1 = true;
            this.gvdpTemplateDetailErr = response.excelError.list;
            console.log(this.gvdpTemplateDetailErr);
        } else {
            this.display4 = false;
            this.growLife = 999999;
            this.msgService.showError("Operation Failed!");
        }
            this.msgs = this.msgService.msgs;
    }

    // gvdp 增加弹框里的选择文件按钮的点击事件
    exportFile(value){
        this.bussinessId = value;
        this.attId = this.dataManageService.getUuId();
        this.file = true;
    }
    // GVDP 增加弹框里的导入文件
    onBasicUpload1(e) {
        let response = eval('(' + e.xhr.response + ')');
        this.response = response;
        // this.fileName = e.files[0].name;
        if (response.code == "1") {
           let timeStamp = new Date().getTime();
           this.httpService.get("/bpd-proj/bpd/gvdpTemplate/addAtt?"+timeStamp+"&attId="+this.attId+"&type=GVDP&dirId=666")
           .subscribe(data => {
               if(data.code == 1){
                this.requestGVDP();
                this.growLife = 5000;
                this.msgService.showSuccess("Operation Success!");
                this.msgs = this.msgService.msgs;
               }
               else{
                this.growLife = 5000;
                this.msgService.showSuccess("Operation Failed!");
                this.msgs = this.msgService.msgs;
               }
           })
            this.file = false;
        } 
        else {
            this.growLife = 5000;
            this.msgService.showSuccess("Operation Failed!");
            this.msgs = this.msgService.msgs;
        }
    }
    // 删除上传的文件
    removeFile(value){
        let timeStamp = new Date().getTime();
        this.httpService.get("/bpd-proj/bpd/att/delete?"+timeStamp+"&attIds="+value)
        .subscribe(data => {
            if(data.code==1){
                this.requestGVDP();
            }
        });
    }
    // 是否覆盖弹框的确认事件
    cando(){
        this.httpService.post("/bpd-proj/bpd/gvdpTemplateDetail/insertGvdp", this.response.gvdpTemplateDetails)
        .subscribe(data => {
            if ("1" == data.code) { //操作成功
            this.growLife = 5000;
            this.msgService.showSuccess('Opration Succeed!');
            this.messageDialog = false;
            this.getGVDPdata();
            }else { //操作失败
                this.growLife = 5000;
                this.msgService.showError('Opration Failed!');
                this.messageDialog = false;
            }
            this.msgs = this.msgService.msgs;
        })
        this.messageDialog2 = false;
    }

    // 导入重复弹框的提交事件
    messageDetermine() {
        console.log(this.response.gvdpTemplateDetails);
        // this.httpService.post("/bpd-proj/bpd/gvdpTemplateDetail/insertGvdp", this.response.gvdpTemplateDetails)
            // .subscribe(data => {
            //     this.tableData = data
            // })
        this.messageDialog = false;
    }

    // 导入重复弹框的取消事件
    messageVeto() {
        this.messageDialog = false;
    }

    // 导入错误弹框的提交事件
    messageDetermine1() {
        this.messageDialog1 = false;
    }

    //  导入错误弹框的取消事件
    messageVeto1() {
        this.messageDialog1 = false;
    }

    //gvdp表格修改数据
    change(value, value1, value2) {
        this.template = "Modify Template";
        this.templateId = value;
        this.display = true;
        this.changed = true;
        this.value1 = value;
        // this.fileName = true;
        this.version = value1;
        this.description = value2;
        // this.fileName = value3;
    }

    //gvdp表格删除数据
    remove(value, value1) {
        this.deleteFlag = 1;
        this.templateId = value;
        this.templateTitle = value1;
        // this.deleteInformation = true;
        this.deleteService.confirm(() => {
            this.sureDelete();
        })
    }
    sureDelete(){
        if(this.deleteFlag == 1){
            let timeStamp = new Date().getTime();
            this.httpService.get("/bpd-proj/bpd/gvdpTemplate/delete?"+timeStamp+"&templateId=" + this.templateId)
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.flag = -1;
                        this.growLife = 5000;
                        this.msgService.showSuccess('Opration Succeed!');
                        this.requestGVDP();
                    } else if ("2" == data.code) {
                        this.growLife = 999999;
                        this.msgService.showInfo(this.templateTitle + " Already Exist,Can't Delete!");
                    } else { //操作失败
                        this.growLife = 5000;
                        this.msgService.showError('Opration Failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                    // this.httpService.post("/bpd-proj/bpd/gvdpTemplate/getVList", {})
                    //     .subscribe(data => {
                    //         this.GVDPdata = data
                    //     })
                })
        }
        else if(this.deleteFlag == 2){
            let timeStamp = new Date().getTime();
            this.httpService.get("/bpd-proj/bpd/gvdpTemplateDetail/delete?"+timeStamp+"&gvdpTemplateDetailId=" + this.gvdpTemplateDetailId)
                .subscribe(data => {
                    if ("1" == data.code) { //操作成功
                        this.growLife = 5000;
                        this.msgService.showSuccess('Opration Succeed!');
                    } else { //操作失败
                        this.growLife = 5000;
                        this.msgService.showError('Opration Failed!');
                    }
                    //获取操作信息
                    this.msgs = this.msgService.msgs;
                    // this.httpService.post("/bpd-proj/bpd/gvdpTemplateDetail/getList", {
                    //         "templateId": this.templateId
                    //     })
                    //     .subscribe(data => {
                    //         this.tableData = data
                    //     })
                    this.getGVDPdata();
                })
        }
        else{
            let timeStamp = new Date().getTime();
            this.httpService.get("/bpd-proj/bpd/metaGraphic/deleteById?"+timeStamp+"&metaTypeName="+this.metaTypeName)
            .subscribe(data => {
                if(1 == data.code){ 
                    this.msgService.showSuccess('Opration Succeed!');
                    this.checkPriElement();
                }
                else{
                    this.msgService.showError('Opration Failed!');
                }
                //获取操作信息
                this.msgs = this.msgService.msgs;
            })
        }
        this.deleteInformation = false;
    }
    // gvdp明细修改数据
    changeTable(value, val1, val2, val3, val4,val5) {
        this.template = "Modify Element";
        this.display1 = true;
        this.changed1 = true;
        this.value2 = value;
        this.elementName = val1;
        this.elementId = val2;
        this.selectedCity1 = val3;
        this.selectedCity = val5;
        this.val = Number(val4);
    }

    //gvdp明细删除数据
    removeTable(value) {
        this.deleteFlag = 2;
        // this.deleteInformation = true;
        this.deleteService.confirm(() => {
            this.sureDelete();
        })
        this.gvdpTemplateDetailId = value;
    }

    elementNameEnterSearch($event) {
        if ($event.key === "Enter") {
            this.checkElement();
        }
    }

    // Graphic Config按钮触发的弹框里的查询事件 
    checkElement(){
        this.paginatorPage1 = 1;
        this.paginatorRow1 = 10;
        this.getGraphicData();
    }

    elementName1EnterSearch($event) {
        if ($event.key === "Enter") {
            this.checkElement1();
        }
    }
    
    // gvdp 明细过滤查询
    checkElement1(){
        this.paginatorPage = 1;
        this.paginatorRow = 10;
        this.getGVDPdata();
    }

    // 查询symbol弹框
    checkSymbol(){
        this.httpService.post("/bpd-proj/bpd/metaGraphic/getMeatGraphicCombobox",{

        }).subscribe(data => {
            this.metaNames = data;
            // this.metaNames.unshift({
            //     label:'please select symbol',
            //     value:' '
            // });
        })
    }
    
    // Graphic Config按钮触发的弹框里的Add Element 按钮事件
    addElement1(){
        this.elementName2 = null;
        this.elementId2 = null;
        this.selectedValue = null;
        this.selectedColor = null;
        this.widthGraphic = null;
        this.rowNo = null;
        this.selectedMetaName = ' ';
        this.selectedType = this.elementTypes[0].value;
        this.addElement = true;
    }
    getSymbolInfo(){
        this.httpService.post("/bpd-proj/bpd/metaGraphic/getList",{
            "metaTypeName":this.selectedMetaName,
            "page":{
                "page":1,
                "rows":1
            }
        }).subscribe(data => {
            if(data.rows.length>0){
                let oneOfSymbol = data.rows[0];
                if(oneOfSymbol.metaTypeName != 'MRD'){
                    this.selectedValue = oneOfSymbol.graphicType.toString();
                    this.selectedColor = oneOfSymbol.graphicColor;
                    this.widthGraphic = oneOfSymbol.width;
                }
                else{
                    this.selectedValue = null;
                    this.selectedColor = null;
                    this.widthGraphic = null;
                }
            }
            else{
                this.selectedValue = null;
                this.selectedColor = null;
                this.widthGraphic = null;
            }
        })
    }
    // GVDP模板下载
    xiazai(value){
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/att/downloadFiles?attIds=" + value + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
    // GVDP明细导出
    download(){
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/gvdpTemplateDetail/exportExcel?templateId="+this.templateId + "&_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }

    // Graphic Config按钮触发的弹框里的Add Element 弹框的提交事件
    tijiao(){
        this.addElement = false;
        this.httpService.post("/bpd-proj/bpd/graphicConfig/insert", {
            "elementName": this.elementName2,
            "elementId": this.elementId2,
            "elementTyId": this.selectedType,
            "graphicType": this.selectedValue,
            "graphicColor": this.selectedColor,
            "width": this.widthGraphic,
            "displayPosition": this.rowNo,
            "metaTypeName": this.selectedMetaName
        })
        .subscribe(data => {
            if ("2" == data.code) { //操作成功
                this.growLife = 999999;
                this.msgService.showInfo('Element ID Repeat!');
            } 
            else if("0" == data.code){ //操作失败
                this.growLife = 5000;
                this.msgService.showError('Opration Failed!');
            }
            else{
                this.growLife = 5000;
                this.msgService.showSuccess('Opration Succeed!');
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
            })
            this.getGraphicData();
    }

    constructor(private httpService: HttpDataService, private msgService: MessageService,private ls: LocalStorage, private dataManageService: DataManageService, private deleteService: DeleteComfirmService) {
        this.paginatorRow  = 10;
        this.paginatorPage = 1;
        this.paginatorPage1 = 1;
        this.paginatorRow1 = 10;
    }
    // 分页切换事件
    paginate($event) {
        this.paginatorPage = $event.page + 1;
        this.paginatorRow = $event.rows;
        this.getGVDPdata();
    
      }

      paginate1($event) {
        this.paginatorPage1 = $event.page + 1;
        this.paginatorRow1 = $event.rows;
        this.forOneGoback();
        this.getGraphicData();
      }
    //   GVDP明细增加修改弹框中的elementId输入框点击事件
      openChoose(){
          this.elementName1 = null;
          this.elementIdforsearch = null;
          this.paginatorPage1 = 1;
          this.paginatorRow1 = 10;
          this.chooseGvdpDetail = true;
          this.getGraphicData();
      }
    //   GVDP明细从弹框绑定数据   
      bindData(val){
        this.elementId = val.data.elementId;
        this.elementName = val.data.elementName;
        this.selectedCity1 = val.data.elementTyId;
        // this.selectedCity = val.elementTypeName;
        this.selectedCity = val.data.elementType;
        this.chooseGvdpDetail = false;
      }
    //   下载模板
    downloadTemplate(){
        let token = window.sessionStorage.getItem("access_token");
        let url: string = "/bpd-proj/bpd/gvdpTemplate/exportExcel?_=" + Number(new Date());
        if (token) {
            let realToken = token.substr(1, token.length - 2)
            url = url + "&accessToken=" + realToken;
        }
        window.location.href = url;
    }
    
    //   查询元图形
    checkPriElement(){
        this.httpService.post("/bpd-proj/bpd/metaGraphic/getList",{
            "page":{ 
                "page": this.paginatorPage2,
                "rows": this.paginatorRow2
            }
        }).subscribe(data => {
            this.primaryElements = data.rows;
            this.totalRecord2 = data.total;
            if(this.primaryElements.length>0){
                this.colorMate(this.primaryElements);
                for(let i=0;i<this.primaryElements.length;i++){
                    this.primaryElements[i].id = i+1;
                }
            }
        })
    }
    // 元图形分页
    paginate2(e){
        this.paginatorPage2 = e.page + 1;
        this.paginatorRow2 = e.rows;
        this.checkPriElement();
    }
    // 打开元图形弹框
      gotoPE(){
          this.paginatorPage2 = 1;
          this.paginatorRow2 = 10;
        this.checkPriElement();
        this.PrimaryElement = true;
      }
    //   增加元图形
      addPriElement(){
        this.gotoSwitch = true;
        this.metaTitle = "Add Meta Graphic";
        this.priElementName = null;
        this.selectedValue1 = null;
        this.selectedColor = null;
        this.priWidth = null;
        this.checked = false;
        // this.selectedType = this.elementTypes[0].value;
        this.addPrimaryElement = true;
      }
    //   修改元图形
      changePriElement(val){
        this.gotoSwitch = false;
        this.metaTitle = "Modify Meta Graphic";
        this.idName = val.idName;
        this.priElementName = val.metaTypeName;
        this.selectedColor = val.graphicColor;
        this.selectedValue1 = val.graphicType.toString();
        this.priWidth = val.width;
        // this.selectedType = val.elementTypeId;
        this.checked = (val.border==0)?false:true;
        this.addPrimaryElement = true;
      }
    //  删除元图形
      deletePriElement(value){
        this.deleteFlag = 3;
        this.deleteService.confirm(() => {
            this.sureDelete();
        })
        this.metaTypeName = value;
        // this.deleteInformation = true;
        // let timeStamp = new Date().getTime();
        // this.httpService.get("/bpd-proj/bpd/metaGraphic/deleteById?"+timeStamp+"&metaTypeName="+value)
        // .subscribe(data => {
        //     if(1 == data.code){ 
        //         this.growLife = 5000;
        //         this.msgService.showSuccess('Opration succeed!');
        //         this.checkPriElement();
        //     }
        //     else{
        //         this.growLife = 5000;
        //         this.msgService.showError('Opration failed!');
        //     }
        //     //获取操作信息
        //     this.msgs = this.msgService.msgs;
        // })
      }
    //   增加元图形到库
      confirmAddPriElement(){
        let border = this.checked == false?0:1;
        this.httpService.post("/bpd-proj/bpd/metaGraphic/insert",{
            "border":border,
            "graphicColor":this.selectedColor,
            "width":this.priWidth,
            "graphicType":this.selectedValue1,
            "metaTypeName":this.priElementName,
            // "elementTypeId":this.selectedType
        }).subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.growLife = 5000;
                this.msgService.showSuccess('Opration Succeed!');
                this.checkPriElement();
            } else { //操作失败
                this.growLife = 5000;
                this.msgService.showError('Opration Failed!');
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        });
        this.addPrimaryElement = false;
      }
    //   修改元图形到库
      confirmChangePriElement(){
        let border = this.checked == false?0:1;
        this.httpService.post("/bpd-proj/bpd/metaGraphic/update",{
            "idName":this.idName,
            "border":border,
            "graphicColor":this.selectedColor,
            "width":this.priWidth,
            "graphicType":this.selectedValue1,
            "metaTypeName":this.priElementName,
            // "elementTypeId":this.selectedType
        }).subscribe(data => {
            if ("1" == data.code) { //操作成功
                this.growLife = 5000;
                this.msgService.showSuccess('Opration Succeed!');
                this.checkPriElement();
            } else { //操作失败
                this.growLife = 5000;
                this.msgService.showError('Opration Failed!');
            }
            //获取操作信息
            this.msgs = this.msgService.msgs;
        });
        this.addPrimaryElement = false;
      }
    //   元图形提交
      handMetaElement(){
        if(this.gotoSwitch){
            this.confirmAddPriElement();
        }else{
            this.confirmChangePriElement();
        }
      }
    ngOnInit() { 
        this.powerOfModify = JSON.parse(this.ls.get("authorityData"))['Maintain GVDP Template'];
        if(this.powerOfModify=="true"){
            this.powerOfModify = true;
        }
        else{
            this.powerOfModify = false;
        }
        // this.attId = "999";
        this.requestGVDP();
        // this.httpService.post("/bpd-proj/bpd/gvdpTemplate/getVList", {})
        //     .subscribe(data => {
        //         this.GVDPdata = data
        //     });
        // this.httpService.post("/bpd-proj/bpd/elementType/getCombobox", {})
        //     .subscribe(data => {
        //         this.cities = data
        //     });
        // this.cities.unshift({
        //     label:'please select element type',
        //     value: ' '
        // })
        this.colors = [];
        // this.colors.push({
        //     label: 'please select color',
        //     value: ' '
        // })
        this.colors.push({
            label: 'Red',
            value: 'red'
        });
        this.colors.push({
            label: 'Blue',
            value: '#3365FB'
        });
        this.colors.push({
            label: 'Yellow',
            value: 'yellow'
        });
        this.colors.push({
            label: 'Black',
            value: 'black'
        });
        this.colors.push({
            label: 'Purple',
            value: 'purple'
        });
        this.colors.push({
            label: 'Green',
            value: '#94D352'
        });
        this.colors.push({
            label: 'Orange',
            value: '#FF9900'
        });
        this.colors.push({
            label: 'Gray',
            value: '#A6A6A6'
        });
        this.colors.push({
            label: 'Frenchgray',
            value: '#D9D9D9'
        });
        this.colors.push({
            label: 'Gold',
            value: '#FFC000'
        });
        this.colors.push({
            label: 'Bisque',
            value: '#FFCC99'
        });
        this.colors.push({
            label: 'Darkgreen',
            value: '#33CC33'
        });
        this.colors.push({
            label: 'Black',
            value: '#404040'
        });
        this.colors.push({
            label: 'Deepblue',
            value: '#00B2F7'
        });
        this.colors.push({
            label: 'Darkblue',
            value: '#528ED6'
        });
    }
}