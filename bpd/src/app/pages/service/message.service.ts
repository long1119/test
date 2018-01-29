/**
 * Created by dujian on 2017/8/5.
 */
import { Message } from 'primeng/primeng';
import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class MessageService {

    msgs: Message[] = [];

    /**
     * 操作成功提示!
     */
    showSuccess(messageDetial: string = "") {
        this.msgs = [];
        if (messageDetial == "Return!" || messageDetial == "Approved!" || messageDetial == "Reject!") {
            this.msgs.push({ severity: 'success', summary: 'Info Message', detail: messageDetial });
        } else {
            this.msgs.push({ severity: 'success', summary: 'Info Message', detail: 'Operation Success!' });
        }
    };

    /**
     * 展示信息
     */
    showInfo(messageDetial: string = "") {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Info Message', detail: messageDetial });
    }

    /**
     * 警告信息
     */
    showWarn(messageDetial: string = "") {
        this.msgs = [];
        this.msgs.push({ severity: 'warn', summary: 'Warn Message', detail: messageDetial });
    }

    /**
     * 错误信息
     */
    showError(messageDetial: string = "") {
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: 'Operation Failed!' });
    }

    /**
     * 清除消息内容
     */
    clear() {
        this.msgs = [];
    };

    //  验证文件格式

    public checkoutFileType($event, typeStr) {
        let fileArr = typeStr.split("-");
        let allow = true;
        for (let i = 0; i < $event.files.length; i++) {
            let fileType = $event.files[i].name.split(".")[$event.files[i].name.split(".").length - 1];
            if (fileArr.indexOf(fileType) == -1) {
                allow = false;
                break;
            }
        }
        return allow;
    }

    public checkNumValue($event, ...length) {
        let event = $event.which ? $event.which : $event.keyCode;
        let _value = "";
        if (event == 8) {
            _value = $event.target.value.substr(0, $event.target.value.length - 1)
        } else {
            _value = $event.target.value + $event.key
        }
        if (length[1]) {
            if (event == 8 || event == 190 || event == 9 || event == 109 || event == 110 || (event >= 48 && event <= 57) || (event >= 96 && event <= 105)) {
                if (_value.indexOf(".") != -1) {
                    if (_value.indexOf(".") != _value.lastIndexOf(".")) {
                        return false;
                    }
                    if (_value.split(".")[1].length > 2) {
                        return false;
                    }
                }
                if (Number(_value) > length[0]) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } else {
            if (event == 8 || event == 9 || event == 109 || event == 110 || (event >= 48 && event <= 57) || (event >= 96 && event <= 105)) {
                if (Number(_value) > length[0]) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
    }

    public checkEnglish($event) {
        let reg = /[^0-9a-zA-Z]$/;
        let regexp = new RegExp(reg);
        if (!regexp.test($event)) {
            console.log($event);
            return $event;
        } else {
            return null;
        }
    }
}