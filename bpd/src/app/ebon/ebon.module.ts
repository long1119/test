/**
 * EbonModule added by ganyimeng
 * EBON开发常用组件、指令、管道、验证等，构成EBON完成的开发套件。
 */
 /**
 * Modify by wangzhongyu
 * 预编译处理组建引入
 */
import { NgModule, ModuleWithProviders }      from '@angular/core';
import { CommonModule }                       from '@angular/common';
import { ReactiveFormsModule, FormsModule }   from '@angular/forms';
import { RouterModule }                       from '@angular/router';


//此处引入 primeng 作为基础控件开发适用
import {
  CalendarModule,
  CheckboxModule,
  DataTableModule,
  DropdownModule,
  FieldsetModule,
  InputTextareaModule,
  InputTextModule,
  RadioButtonModule,
  TabViewModule,
  TooltipModule,
  TreeModule,
  SharedModule
} from 'primeng/primeng';

import { 
  PieChart, 
  TimeChart
  // WfAppliRegisterDeclareComponent,
  // WfCreateApplyComponent,
  // WfProjCloseApplyComponent,
  // WfQaCutComponent,
  // WfWorkplanChangeComponent,
  // WfWorlPlanCloseComponent,
  // WfWorlPlanDeclareComponent,
  // WfWorkTimeApproveComponent 
} from './components';
import { } from './directives';
import { DictPipe } from './pipes';
import { } from './services';
import { } from './validators';

const EBON_COMPONENTS = [ 
  PieChart, 
  TimeChart 
  // WfAppliRegisterDeclareComponent,
  // WfCreateApplyComponent,
  // WfProjCloseApplyComponent,
  // WfQaCutComponent,
  // WfWorkplanChangeComponent,
  // WfWorlPlanCloseComponent,
  // WfWorlPlanDeclareComponent,
  // WfWorkTimeApproveComponent
];
const EBON_DIRECTIVES = [];
const EBON_PIPES = [ DictPipe ];
const EBON_SERVICES = [];
const EBON_VALIDATORS = [];
const PRIMENG_MODULES = [
  CalendarModule,
  CheckboxModule,
  DataTableModule,
  DropdownModule,
  FieldsetModule,
  InputTextareaModule,
  InputTextModule,
  RadioButtonModule,
  TabViewModule,
  TooltipModule,
  TreeModule,
  SharedModule
];
const NG2_MODULE = [
  CommonModule,
  FormsModule
];

@NgModule({
  declarations: [
    ...EBON_PIPES,
    ...EBON_DIRECTIVES,
    ...EBON_COMPONENTS
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ...EBON_PIPES,
    ...EBON_DIRECTIVES,
    ...EBON_COMPONENTS,
    ...PRIMENG_MODULES,
    ...NG2_MODULE
  ]
})
export class EbonModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders> {
      ngModule: EbonModule,
      providers: [
        ...EBON_VALIDATORS,
        ...EBON_SERVICES
      ],
    };
  }
}
