import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  Pages
} from './pages.component';
import {
  ModuleWithProviders
} from '@angular/core';
import { SgmCanActivate } from '../ebon/auth/canactive.route'
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  // {path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule'},
  // {path: 'register', loadChildren: 'app/pages/register/register.module#RegisterModule'},
  {
    path: 'pages',
    component: Pages,
    // canActivate: [SgmCanActivate],
    children: [
      // {path: '', redirectTo: 'base-data', pathMatch: 'full'},
      // {
      //   path: 'base-data',
      //   loadChildren: 'app/pages/baseData/baseData.module#BaseDataModule'
      // }
      // {
      //   path: 'protal',
      //   loadChildren: ''}

      {
        path: '',
        redirectTo: 'work-portal',
        pathMatch: 'full'
      },
      {
        path: 'program-info',
        loadChildren: './ProjectInfo/components/programInfo/programInfo.module#ProgramInfoModule'
      },
      {
        path: 'project-program-info',
        loadChildren: './ProjectInfo/components/projectProgramInfo/projectProgramInfo.module#ProjectProgramInfoModule'
      },
      {
        path: 'vehicle-project',
        loadChildren: './ProjectInfo/components/vehicleProject/vehicleProject.module#VehicleProjectModule'
      },
      {
        path: 'power-train-project',
        loadChildren: './ProjectInfo/components/powerTrainProject/powerTrainProject.module#PowerTrainProjectModule'
      },
      {
        path: 'building-project',
        loadChildren: './ProjectInfo/components/buildingProject/buildingProject.module#BuildingProjectModule'
      },
      {
        path: 'model-year',
        loadChildren: './ProjectInfo/components/modelYear/modelYear.module#ModelYearModule'
      },
      {
        path: 'user',
        loadChildren: './resouceMag/components/user/user.module#UserModule'
      },
      {
        path: 'hrUserList',
        loadChildren: './resouceMag/components/hrUserList/hrUserList.module#HrUserListModule'
      },
      {
        path: 'role',
        loadChildren: './resouceMag/components/role/role.module#RoleModule'
      },
      {
        path: 'document-management',
        loadChildren: './resouceMag/components/documentManagement/documentManagement.module#DocumentManagementModule'
      },
      {
        path: 'share-page',
        loadChildren: './resouceMag/components/sharePage/sharePage.module#SharePageModule'
      },
      {
        path: 'investment-document',
        loadChildren: './resouceMag/components/investmentDocument/investmentDocument.module#InvestmentDocumentModule'
      },
      {
        path: 'issue-management',
        loadChildren: './resouceMag/components/issueManagement/issueManagement.module#IssueManagementModule'
      },
      // { path: '', redirectTo: 'project-type', pathMatch: 'full' },
      {
        path: 'ar-region',
        loadChildren: './baseData/components/bugetTemplate/bugetTemplate.module#BugetTemplateModule'
      },
      {
        path: 'project-type',
        loadChildren: './baseData/components/projectType/projectType.module#ProjectTypeModule'
      },
      {
        path: 'investment-wbs',
        loadChildren: './baseData/components/investmentWbs/investmentWbs.module#InvestmentWbsModule'
      },
      {
        path: 'echange-rate',
        loadChildren: './baseData/components/echangeRate/echangeRate.module#EchangeRateModule'
      },
      {
        path: 'investment-property',
        loadChildren: './baseData/components/investmentProperty/investmentProperty.module#InvestmentPropertyModule'
      },
      {
        path: 'region',
        loadChildren: './baseData/components/region/region.module#RegionModule'
      },
      {
        path: 'region-group',
        loadChildren: './baseData/components/regionGroup/regionGroup.module#RegionGroupModule'
      },
      {
        path: 'plant-code',
        loadChildren: './baseData/components/plantCode/plantCode.module#PlantCodeModule'
      },
      {
        path: 'plant',
        loadChildren: './baseData/components/plant/plant.module#PlantModule'
      },
      {
        path: 'investment-paramenters',
        loadChildren: './baseData/components/investmentParamenters/investmentParamenters.module#InvestmentParamentersModule'
      },
      {
        path: 'previous-esitmation',
        loadChildren: './esitmation/components/previousEsitmation/previousEsitmation.module#PreviousEsitmationModule'
      },
      {
        path: 'budgeting',
        loadChildren: './esitmation/components/budgeting/budgeting.module#BudgetingModule'
      },
      {
        path: 'budget-review',
        loadChildren: './esitmation/components/budgetReview/budgetReview.module#BudgetReviewModule'
      },
      {
        path: 'deliverable-bill',
        loadChildren: './PQRR/components/deliverableBill/deliverableBill.module#DeliverableBillModule'
      },
      {
        path: 'deliverable-tpl',
        loadChildren: './PQRR/components/deliverableTpl/deliverableTpl.module#DeliverableTplModule'
      },
      {
        path: 'pqrr-summary',
        loadChildren: './PQRR/components/pqrrSummary/pqrrSummary.module#PqrrSummaryModule'
      },
      {
        path: 'pqrr-submit',
        loadChildren: './PQRR/components/pqrrSubmit/pqrrSubmit.module#PqrrSubmitModule'
      },
      {
        path: 'cost-book',
        loadChildren: './esitmation/components/costBook/costBook.module#CostBookModule'
      },
      {
        path: 'investment-portal',
        loadChildren: './portal/investmentPortal/investmentPortal.module#InvestmentPortalModule'
      },
      {
        path: 'work-portal',
        loadChildren: './portal/workPortal/workPortal.module#WorkPortalModule'
      },
      {
        path: 'kanban-config',
        loadChildren: './portal/kanbanConfig/kanbanConfig.module#KanbanConfigModule'
      },
      {
        path: 'kanban-pic',
        loadChildren: './portal/kanbanPic/kanbanPic.module#KanbanPicModule'
      },
      {
        path: 'pet-member',
        loadChildren: './programManagement/components/petMember/petMember.module#PetMemberModule'
      },
      {
        path: 'ar-project',
        loadChildren: './ProjectInfo/components/ArProject/ArProject.module#ArProjectModule'
      },
      {
        path: 'project-member',
        loadChildren: './ProjectInfo/components/projectMember/projectMember.module#ProjectMemberModule'
      },
      {
        path: 'gvdp-template',
        loadChildren: './baseData/components/GVDPtemplate/GVDP-template.module#GvdpTemplateModule'
      },
      {
        path: 'bench-mark',
        loadChildren: './investment/components/benchMark/benchMark.module#BenchMarkModule'
      },
      {
        path: 'crdn',
        loadChildren: './investment/components/crdn/crdn.module#CrdnModule'
      },
      {
        path: 'crdn-tracking',
        loadChildren: './investment/components/crdnTracking/crdnTracking.module#CrdnTrackingModule'
      },
      {
        path: 'red-zone',
        loadChildren: './investment/components/redZone/redZone.module#RedZoneModule'
      },
      {
        path: 'project-budget',
        loadChildren: './investment/components/projectBudget/project-budget.module#projectBudgetModule'
      },
      {
        path: 'currency-translation',
        loadChildren: './ProjectInfo/components/currencyTranslation/currencyTranslation.module#CurrencyTranslationModule'
      },
      {
        path: 'program-portal',
        loadChildren: './portal/programPortal/program-portal.module#programPortalModule'
      },
      {
        path: 'pet-member',
        loadChildren: './programManagement/components/petMember/petMember.module#PetMemeber'
      },
      // {
      //   path: 'vehicle-management',
      //   loadChildren: './portal/vehicleManagement/vehicleManagement.module#vehicleManagementModule'
      // },
      {
        path: 'time-sheet',
        loadChildren: './scheduleManagement/component/timeSheet/timeSheet.module#TimeSheetModule'
      },
      {
        path: 'system-log',
        loadChildren: './systemManagement/components/systemLog/systemLog.module#SystemLogModule'
      },
      {
        path: 'investment-log',
        loadChildren: './systemManagement/components/investmentLog/investmentLog.module#InvestmentLogModule'
      },
      {
        path: 'nod',
        loadChildren: './programManagement/components/nod/nod.module#NodModule'
      },
      {
        path: 'score-card',
        loadChildren: './programManagement/components/scoreCard/scoreCard.module#ScoreCardModule'
      },
      {
        path: 'scorecard-status',
        loadChildren: './programManagement/components/scorecardStatus/scorecardStatus.module#ScorecardStatusModule'
      },
      {
        path: 'project-scorecard',
        loadChildren: './programManagement/components/projectScorecard/projectScorecard.module#ProjectScorecardModule'
      },
      {
        path: 'analysis-report',
        loadChildren: './programManagement/components/analysisReport/analysisReport.module#AnalysisReportModule'
      },
      {
        path: 'meeting',
        loadChildren: './programManagement/components/Meeting/meeting.module#meetingModule'
      },
      {
        path: 'schedule-analysis',
        loadChildren: './scheduleManagement/component/scheduleAnalysis/scheduleAnalysis.module#ScheduleAnalysisModule'
      },
      {
        path: 'tax-rate',
        loadChildren: './realEstate/component/taxRate/taxRate.module#TaxRateModule'
      },
      {
        path: 'land-information',
        loadChildren: './realEstate/component/landInformation/landInformation.module#LandInformationModule'
      },
      {
        path: 'rent-buy-analysis',
        loadChildren: './realEstate/component/rentBuyAnalysis/rentBuyAnalysis.module#RentBuyAnalysisModule'
      },
      {
        path: 'rental-record',
        loadChildren: './realEstate/component/rentalRecord/rentalRecord.module#RentalRecordModule'
      },
      {
        path: 'land-purchase-record',
        loadChildren: './realEstate/component/landPurchaseRecord/landPurchaseRecord.module#LandPurchaseRecordModule'
      },
      {
        path: 'investment-summary',
        loadChildren: './investment/components/investmentSummary/investmentSummary.module#investmentSummaryModule'
      },
      {
        path: 'investment-status',
        loadChildren: './investment/components/investmentStatus/investmentStatus.module#investmentStatusModule'
      },
      {
        path: 'close-report',
        loadChildren: './investment/components/closeReport/closeReport.module#closeReportModule'
      },
      {
        path: 'prpo',
        loadChildren: './investment/components/PRPO/prpo.module#prpoModule'
      },
      {
        path: 'summary-report',
        loadChildren: './investment/components/summaryReport/summary-report.module#summaryReportModule'
      },
      {
        path: 'launch-plan',
        loadChildren: './scheduleManagement/component/launchPlan/launchPlan.module#LaunchPlanModule'
      },
      {
        path: 'so-list',
        loadChildren: './programManagement/components/soList/soList.module#SoListModule'
      },
      {
        path: 'score-card-metrics',
        loadChildren: './baseData/components/scoreCardMetrics/scoreCardMetrics.module#ScoreCardMetricsModule'
      },
      {
        path: 'detail-report',
        loadChildren: './programManagement/components/detailReport/detailReport.module#DetailReportModule'
      },
      {
        path: 'set-time-out',
        loadChildren: './systemManagement/components/setTimeOut/setTimeOut.module#SetTimeOutModule'
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);