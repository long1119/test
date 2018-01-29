import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'menuPips'})
export class MenuPips implements PipeTransform {

  public transform(value:string): string {
  	let isen:boolean = window.localStorage.getItem("isEnglish") == "1";

    // 一级菜单
    if(value=='Portal') {
        if(isen) {
            return 'Portal';
        } else{
            return '系统门户';
        }
    } else if(value=='System Mgr') {
        if(isen) {
            return 'System Mgr';
        } else {
            return '系统管理';
        }
    } else if(value=='Program Mgr') {
        if(isen) {
            return 'Program Mgr';
        } else {
            return '集成管理';
        }
    } else if(value=='Document Mgr') {
        if(isen) {
            return 'Document Mgr';
        } else {
            return '文档管理';
        }
    } else if(value=='Schedule Mgr') {
        if(isen) {
            return 'Schedule Mgr';
        } else {
            return '进度管理';
        }
    } else if(value=='PQRR') {
        if(isen) {
            return 'PQRR';
        } else {
            return '质量伐管理';
        }
    } else if(value=='Change Management') {
        if(isen) {
            return 'Change Management';
        } else {
            return '变更管理';
        }
    } else if(value=='Base Data') {
        if(isen) {
            return 'Base Data';
        } else {
            return '基础数据';
        }
    } else if(value=='Program Info') {
        if(isen) {
            return 'Program Info';
        } else {
            return '项目信息';
        }
    } else if(value=='Budget Review') {
        if(isen) {
            return 'Budget Review';
        } else {
            return '预算编制&审核';
        }
    } else if(value=='Costbook Status') {
        if(isen) {
            return 'Costbook Status';
        } else {
            return '预算状态';
        }
    } else if(value=='Analysis') {
        if(isen) {
            return 'Analysis';
        } else {
            return '预测分析';
        }
    } else if(value=='Real Estate') {
        if(isen) {
            return 'Real Estate';
        } else {
            return '不动产项目';
        }
    }

    // 二级菜单
    else if(value=='Program Mgr Portal') {
        if(isen) {
            return 'Program Mgr Portal';
        } else {
            return '整车项目管理门户';
        }
    } else if(value=='Role') {
        if(isen) {
            return 'Role';
        } else {
            return '设置角色';
        }
    } else if(value=='Project_Authority') {
        if(isen) {
            return 'Project_Authority';
        } else {
            return '整车项目角色权限';
        }
    } else if(value=='User') {
        if(isen) {
            return 'User';
        } else {
            return '设置用户';
        }
    } else if(value=='Model Year Project') {
        if(isen) {
            return 'Model Year Project';
        } else {
            return 'MY项目信息';
        }
    } else if(value=='PET Member') {
        if(isen) {
            return 'PET Member';
        } else {
            return '项目组织(PET)';
        }
    } else if(value=='Meeting') {
        if(isen) {
            return 'Meeting';
        } else {
            return '会议管理';
        }
    } else if(value=='Red Zone') {
        if(isen) {
            return 'Red Zone';
        } else {
            return 'Red Zone管理';
        }
    } else if(value=='NOD') {
        if(isen) {
            return 'NOD';
        } else {
            return 'NOD管理';
        }
    } else if(value=='S&O List') {
        if(isen) {
            return 'S&O List';
        } else {
            return 'S&O List';
        }
    } else if(value=='Issue Mgr') {
        if(isen) {
            return 'Issue Mgr';
        } else {
            return '问题管理';
        }
    } else if(value=='Scorecard') {
        if(isen) {
            return 'Scorecard';
        } else {
            return '积分卡管理';
        }
    } else if(value=='Master Timesheet') {
        if(isen) {
            return 'Master Timesheet';
        } else {
            return '项目主计划';
        }
    } else if(value=='Master Timesheet Analysis') {
        if(isen) {
            return 'Master Timesheet Analysis';
        } else {
            return '项目主计划分析';
        }
    } else if(value=='Project Kanban') {
        if(isen) {
            return 'Project Kanban';
        } else {
            return '项目看板';
        }
    } else if(value=='Launch Plan') {
        if(isen) {
            return 'Launch Plan';
        } else {
            return '工厂计划';
        }
    } else if(value=='My PQRR') {
        if(isen) {
            return 'My PQRR';
        } else {
            return 'My PQRR';
        }
    } else if(value=='Deliverable-List') {
        if(isen) {
            return 'Deliverable-List';
        } else {
            return '交付物清单';
        }
    } else if(value=='Deliverable-Template') {
        if(isen) {
            return 'Deliverable-Template';
        } else {
            return '交付物模版';
        }
    } else if(value=='CR/DN') {
        if(isen) {
            return 'CR/DN';
        } else {
            return 'CR/DN';
        }
    } else if(value=='Tracking list') {
        if(isen) {
            return 'Tracking list';
        } else {
            return 'Tracking list';
        }
    } else if(value=='GVDP Template') {
        if(isen) {
            return 'GVDP Template';
        } else {
            return 'GVDP 模版';
        }
    } else if(value=='Scordcard Indicator') {
        if(isen) {
            return 'Scordcard Indicator';
        } else {
            return '项目积分卡指标';
        }
    } else if(value=='Investment Portal') {
        if(isen) {
            return 'Investment Portal';
        } else {
            return '投资管理门户';
        }
    } else if(value=='Investment_Authority') {
        if(isen) {
            return 'Investment_Authority';
        } else {
            return '投资角色权限';
        }
    } else if(value=='Costbook Member') {
        if(isen) {
            return 'Costbook Member';
        } else {
            return '投资项目成员';
        }
    } else if(value=='Veh.Project') {
        if(isen) {
            return 'Veh.Project';
        } else {
            return '整车产品项目';
        }
    } else if(value=='PT Project') {
        if(isen) {
            return 'PT Project';
        } else {
            return '动力总成项目';
        }
    } else if(value=='Fac. Project') {
        if(isen) {
            return 'Fac. Project';
        } else {
            return '设施基建项目';
        }
    } else if(value=='AR Project') {
        if(isen) {
            return 'AR Project';
        } else {
            return '年度非项目资本';
        }
    } else if(value=='Advance Estimation') {
        if(isen) {
            return 'Advance Estimation';
        } else {
            return '先期投资估算';
        }
    } else if(value=='Costbook Establish') {
        if(isen) {
            return 'Costbook Establish';
        } else {
            return '预算书生成';
        }
    } else if(value=='Budget Establish') {
        if(isen) {
            return 'Budget Establish';
        } else {
            return '预算编制';
        }
    } else if(value=='Budget Review') {
        if(isen) {
            return 'Budget Review';
        } else {
            return '预算审核';
        }
    } else if(value=='Budget Summary') {
        if(isen) {
            return 'Budget Summary';
        } else {
            return '投资汇总';
        }
    } else if(value=='Fx & Cashflow') {
        if(isen) {
            return 'Fx & Cashflow';
        } else {
            return '汇率&现金流';
        }
    } else if(value=='Costbook Overview') {
        if(isen) {
            return 'Costbook Overview';
        } else {
            return '预算概览';
        }
    } else if(value=='Costbook Detail') {
        if(isen) {
            return 'Costbook Detail';
        } else {
            return '预算明细';
        }
    } else if(value=='PR & PO List') {
        if(isen) {
            return 'PR & PO List';
        } else {
            return 'PR&PO报告';
        }
    } else if(value=='Close Report') {
        if(isen) {
            return 'Close Report';
        } else {
            return '预算关闭报告';
        }
    } else if(value=='Benchmark') {
        if(isen) {
            return 'Benchmark';
        } else {
            return '投资对标';
        }
    } else if(value=='Tax Rate') {
        if(isen) {
            return 'Tax Rate';
        } else {
            return '税率信息';
        }
    } else if(value=='Land Info') {
        if(isen) {
            return 'Land Info';
        } else {
            return '地块信息';
        }
    } else if(value=='Rental&Buy Analysis') {
        if(isen) {
            return 'Rental&Buy Analysis';
        } else {
            return '租买分析';
        }
    } else if(value=='Rent property ledger') {
        if(isen) {
            return 'Rent property ledger';
        } else {
            return '租赁地产台账';
        }
    } else if(value=='Rental Record') {
        if(isen) {
            return 'Rental Record';
        } else {
            return '购买地产台账';
        }
    } else if(value=='Project Type') {
        if(isen) {
            return 'Project Type';
        } else {
            return '项目类型';
        }
    } else if(value=='Investment WBS(L4-L5)') {
        if(isen) {
            return 'Investment WBS(L4-L5)';
        } else {
            return 'WBS明细(L4-L5)';
        }
    } else if(value=='FX Forecast') {
        if(isen) {
            return 'FX Forecast';
        } else {
            return '财务预测汇率';
        }
    } else if(value=='Investment Property(L6)') {
        if(isen) {
            return 'Investment Property(L6)';
        } else {
            return '投资属性(L6)';
        }
    } else if(value=='Region Code(L3)') {
        if(isen) {
            return 'Region Code(L3)';
        } else {
            return '区域编码(L3)';
        }
    } else if(value=='Region Group') {
        if(isen) {
            return 'Region Group';
        } else {
            return '区域分类';
        }
    } else if(value=='Plant Code(L2)') {
        if(isen) {
            return 'Plant Code(L2)';
        } else {
            return '工厂(L2)';
        }
    } else if(value=='Investment Assumption') {
        if(isen) {
            return 'Investment Assumption';
        } else {
            return '投资基本假设';
        }
    } else if(value=='Budget Template') {
        if(isen) {
            return 'Budget Template';
        } else {
            return '预算模版';
        }
    } else if(value=='AR Region') {
        if(isen) {
            return 'AR Region';
        } else {
            return 'AR 区域';
        }
    } else if(value=='Investment Document') {
        if(isen) {
            return 'Investment Document';
        } else {
            return '投资文档';
        }
    } else if(value=='Project Document') {
        if(isen) {
            return 'Project Document';
        } else {
            return '整车文档';
        }
    } else if(value=='HR Userlist') {
        if(isen) {
            return 'HR Userlist';
        } else {
            return '同步用户';
        }
    } else if(value=='Board Config') {
        if(isen) {
            return 'Board Config';
        } else {
            return '项目看板';
        }
    }

    // 三级菜单
    else if(value=='Set BOD Scorecard Date') {
        if(isen) {
            return 'Set BOD Scorecard Date';
        } else {
            return '设置BOD积分卡时间';
        }
    } else if(value=='Scorecard Tasks') {
        if(isen) {
            return 'Scorecard Tasks';
        } else {
            return '积分卡编制';
        }
    } else if(value=='BOD SC Summary Report') {
        if(isen) {
            return 'BOD SC Summary Report';
        } else {
            return 'BOD积分卡总结报告';
        }
    } else if(value=='BOD SC Detail Report') {
        if(isen) {
            return 'BOD SC Detail Report';
        } else {
            return 'BOD积分卡明细报告';
        }
    } else if(value=='BOD SC Analysis Report') {
        if(isen) {
            return 'BOD SC Analysis Report';
        } else {
            return 'BOD积分卡分析';
        }
    } else if(value=='Project Scorecard Report') {
        if(isen) {
            return 'Project Scorecard Report';
        } else {
            return '项目积分卡报告';
        }
    } else {
        return value.toString();
    }
  }
}