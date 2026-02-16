// import { Routes } from '@angular/router';
// import { TreatyList } from './features/treaty/treaty-list/treaty-list';
// import { TreatyForm } from './features/treaty/treaty-form/treaty-form';
// import { TreatyDetail } from './features/treaty/treaty-detail/treaty-detail';
// import { RenewalCalendar } from './features/treaty/renewal-calendar/renewal-calendar';
// import { ReinsurerDetail } from './features/reinsurer/reinsurer-detail/reinsurer-detail';
// import { ReinsurerList } from './features/reinsurer/reinsurer-list/reinsurer-list';
// import { RiskCessionList } from './features/risk-cession/risk-cession-list/risk-cession-list';
// import { RiskCession } from './features/risk-cession/risk-cession-form/risk-cession-form';
// import { RecoveryList } from './features/recovery/recovery-list/recovery-list';
// import { RecoveryFormComponent } from './features/recovery/recovery-form/recovery-form';
// import { RecoveryDetail } from './features/recovery/recovery-detail/recovery-detail';
// import { AdminDashboard } from './features/Admin/admin-dashboard/admin-dashboard';
// import { FinanceSummary } from './features/Financial-Report/finance-summary/finance-summary';
// import { BalanceTable } from './features/Financial-Report/balance-table/balance-table';
// import { ExportButton } from './features/Financial-Report/export-button/export-button';
// import { FinancialReportList } from './features/Financial-Report/financial-report-list/financial-report-list';
// import { FinanceDashboard } from './features/Financial-Report/finance-dashboard/finance-dashboard';
// import { Financelinks } from './features/Financial-Report/financelinks/financelinks';
// import { LoginComponent } from './features/login/login';
// import { AnalyticsDashboard } from './features/Analytics/analytics-dashboard/analytics-dashboard';
// import { ManagementDashboard } from './features/Analytics/management-dashboard/management-dashboard';
// import { ComplianceReport } from './features/Analytics/compliance-report/compliance-report';
// import { AdminGuard, FinanceGuard } from './services/admin.guard';


// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   {
//     path: 'admin-dashboard',
//     loadComponent: () => import('./features/Admin/admin-dashboard/admin-dashboard')
//       .then(m => m.AdminDashboard),
//       canActivate: [AdminGuard]
//   },
//   {
//     path: 'finance-dashboard',
   
//     loadComponent: () => import('./features/Financial-Report/finance-dashboard/finance-dashboard')
//       .then(m => m.FinanceDashboard),
//       canActivate: [FinanceGuard] 
//   },

//   // { path: 'treaties', component: TreatyList },
//   // { path: 'treaties/new', component: TreatyForm },
//   // { path: 'treaties/:id/edit', component: TreatyForm },
//   // { path: 'treaties/:id', component: TreatyDetail},
//   // { path: 'treaties/renewals', component: RenewalCalendar },
//   // { path: 'renewals', component: RenewalCalendar },
//   // { path: 'reinsurers', component: ReinsurerList },
//   // { path: 'reinsurers/:id', component: ReinsurerDetail },
//   // { path: 'cessions', component: RiskCessionList },
//   // { path: 'cessions/new', component: RiskCession },
//   // {path:'audit',component:AuditLogView},
//   // { path: 'recoveries', component: RecoveryList },
//   //  { path: 'recoveries/new', component: RecoveryFormComponent }, 
//   //  { path: 'recoveries/:id', component: RecoveryDetail },
//   //  { path: 'admin/dashboard', component: AdminDashboard },
//   //  { path: 'financerep', component: FinanceSummary },
//   //  { path: 'balance', component: BalanceTable },
//   //  { path: 'export', component: ExportButton },
//   //  { path: 'report', component: FinancialReportList },
//   //  {path:'finance/dashboard', component:FinanceDashboard},
//   //  {path:'dashboard', component:Financelinks},
//   //  {path:'analytics-dash', component: AnalyticsDashboard},
//   //  {path:'manage-dash', component: ManagementDashboard},
//   //  {path:'compliance-report', component: ComplianceReport}


  
//   // Admin-only routes
//   { path: 'admin/dashboard', component: AdminDashboard, canActivate: [AdminGuard] },
//   { path: 'treaties', component: TreatyList, canActivate: [AdminGuard] },
//   { path: 'treaties/new', component: TreatyForm, canActivate: [AdminGuard] },
//   { path: 'treaties/:id', component: TreatyDetail, canActivate: [AdminGuard] },
//   { path: 'treaties/:id/edit', component: TreatyForm, canActivate: [AdminGuard] },
//   { path: 'treaties/renewals', component: RenewalCalendar, canActivate: [AdminGuard] },
//   { path: 'renewals', component: RenewalCalendar, canActivate: [AdminGuard] },
//   { path: 'reinsurers', component: ReinsurerList, canActivate: [AdminGuard] },
//   { path: 'reinsurers/:id', component: ReinsurerDetail },
//   { path: 'cessions/new', component: RiskCession, canActivate: [AdminGuard] },
//   { path: 'recoveries/new', component: RecoveryFormComponent, canActivate: [AdminGuard] },

//   // Finance-only routes
//   { path: 'report', component: FinancialReportList, canActivate: [FinanceGuard] },
//   { path: 'recoveries', component: RecoveryList, canActivate: [FinanceGuard] },
//   { path: 'balance', component: BalanceTable, canActivate: [FinanceGuard] },
//   { path: 'export', component: ExportButton, canActivate: [FinanceGuard] },
//   { path: 'financerep', component: FinanceSummary, canActivate: [FinanceGuard] },
//   { path: 'finance/dashboard', component: FinanceDashboard, canActivate: [FinanceGuard] },
//   { path: 'cessions', component: RiskCessionList, canActivate: [FinanceGuard] },
//   { path: 'dashboard', component: Financelinks, canActivate: [FinanceGuard] },
//   { path: 'recoveries/:id', component: RecoveryDetail, canActivate: [FinanceGuard]  },
//   { path: 'analytics-dash', component: AnalyticsDashboard, canActivate: [FinanceGuard] },
//   { path: 'manage-dash', component: ManagementDashboard, canActivate: [FinanceGuard] },
//   { path: 'compliance-report', component: ComplianceReport, canActivate: [FinanceGuard] },

//   { path: 'not-authorized', component: LoginComponent } // or a dedicated NotAuthorizedComponent




// ];
// import { Routes } from '@angular/router';
// import { TreatyList } from './features/treaty/treaty-list/treaty-list';
// import { TreatyForm } from './features/treaty/treaty-form/treaty-form';
// import { TreatyDetail } from './features/treaty/treaty-detail/treaty-detail';
// import { RenewalCalendar } from './features/treaty/renewal-calendar/renewal-calendar';
// import { ReinsurerDetail } from './features/reinsurer/reinsurer-detail/reinsurer-detail';
// import { ReinsurerList } from './features/reinsurer/reinsurer-list/reinsurer-list';
// import { RiskCessionList } from './features/risk-cession/risk-cession-list/risk-cession-list';
// import { RiskCession } from './features/risk-cession/risk-cession-form/risk-cession-form';
// import { RecoveryList } from './features/recovery/recovery-list/recovery-list';
// import { RecoveryFormComponent } from './features/recovery/recovery-form/recovery-form';
// import { RecoveryDetail } from './features/recovery/recovery-detail/recovery-detail';
// import { AdminDashboard } from './features/Admin/admin-dashboard/admin-dashboard';
// import { FinanceSummary } from './features/Financial-Report/finance-summary/finance-summary';
// import { BalanceTable } from './features/Financial-Report/balance-table/balance-table';
// import { ExportButton } from './features/Financial-Report/export-button/export-button';
// import { FinancialReportList } from './features/Financial-Report/financial-report-list/financial-report-list';
// import { FinanceDashboard } from './features/Financial-Report/finance-dashboard/finance-dashboard';
// import { Financelinks } from './features/Financial-Report/financelinks/financelinks';
// import { LoginComponent } from './features/login/login';
// import { AnalyticsDashboard } from './features/Analytics/analytics-dashboard/analytics-dashboard';
// import { ManagementDashboard } from './features/Analytics/management-dashboard/management-dashboard';
// import { ComplianceReport } from './features/Analytics/compliance-report/compliance-report';
// import { AdminGuard, FinanceGuard } from './services/admin.guard';


// export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },
//   { path: 'login', component: LoginComponent },
//   {
//     path: 'admin-dashboard',
//     loadComponent: () => import('./features/Admin/admin-dashboard/admin-dashboard')
//       .then(m => m.AdminDashboard),
//       canActivate: [AdminGuard]
//   },
//   {
//     path: 'finance-dashboard',
   
//     loadComponent: () => import('./features/Financial-Report/finance-dashboard/finance-dashboard')
//       .then(m => m.FinanceDashboard),
//       canActivate: [FinanceGuard] 
//   },

//   // { path: 'treaties', component: TreatyList },
//   // { path: 'treaties/new', component: TreatyForm },
//   // { path: 'treaties/:id/edit', component: TreatyForm },
//   // { path: 'treaties/:id', component: TreatyDetail},
//   // { path: 'treaties/renewals', component: RenewalCalendar },
//   // { path: 'renewals', component: RenewalCalendar },
//   // { path: 'reinsurers', component: ReinsurerList },
//   // { path: 'reinsurers/:id', component: ReinsurerDetail },
//   // { path: 'cessions', component: RiskCessionList },
//   // { path: 'cessions/new', component: RiskCession },
//   // {path:'audit',component:AuditLogView},
//   // { path: 'recoveries', component: RecoveryList },
//   //  { path: 'recoveries/new', component: RecoveryFormComponent }, 
//   //  { path: 'recoveries/:id', component: RecoveryDetail },
//   //  { path: 'admin/dashboard', component: AdminDashboard },
//   //  { path: 'financerep', component: FinanceSummary },
//   //  { path: 'balance', component: BalanceTable },
//   //  { path: 'export', component: ExportButton },
//   //  { path: 'report', component: FinancialReportList },
//   //  {path:'finance/dashboard', component:FinanceDashboard},
//   //  {path:'dashboard', component:Financelinks},
//   //  {path:'analytics-dash', component: AnalyticsDashboard},
//   //  {path:'manage-dash', component: ManagementDashboard},
//   //  {path:'compliance-report', component: ComplianceReport}


  
//   // Admin-only routes
//   { path: 'admin/dashboard', component: AdminDashboard, canActivate: [AdminGuard] },
//   { path: 'treaties', component: TreatyList, canActivate: [AdminGuard] },
//   { path: 'treaties/new', component: TreatyForm, canActivate: [AdminGuard] },
//   { path: 'treaties/:id', component: TreatyDetail, canActivate: [AdminGuard] },
//   { path: 'treaties/:id/edit', component: TreatyForm, canActivate: [AdminGuard] },
//   { path: 'treaties/renewals', component: RenewalCalendar, canActivate: [AdminGuard] },
//   { path: 'renewals', component: RenewalCalendar, canActivate: [AdminGuard] },
//   { path: 'reinsurers', component: ReinsurerList, canActivate: [AdminGuard] },
//   { path: 'reinsurers/:id', component: ReinsurerDetail },
//   { path: 'cessions/new', component: RiskCession, canActivate: [AdminGuard] },
//   { path: 'recoveries/new', component: RecoveryFormComponent, canActivate: [AdminGuard] },

//   // Finance-only routes
//   { path: 'report', component: FinancialReportList, canActivate: [FinanceGuard] },
//   { path: 'recoveries', component: RecoveryList, canActivate: [FinanceGuard] },
//   { path: 'balance', component: BalanceTable, canActivate: [FinanceGuard] },
//   { path: 'export', component: ExportButton, canActivate: [FinanceGuard] },
//   { path: 'financerep', component: FinanceSummary, canActivate: [FinanceGuard] },
//   { path: 'finance/dashboard', component: FinanceDashboard, canActivate: [FinanceGuard] },
//   { path: 'cessions', component: RiskCessionList, canActivate: [FinanceGuard] },
//   { path: 'dashboard', component: Financelinks, canActivate: [FinanceGuard] },
//   { path: 'recoveries/:id', component: RecoveryDetail, canActivate: [FinanceGuard]  },
//   { path: 'analytics-dash', component: AnalyticsDashboard, canActivate: [FinanceGuard] },
//   { path: 'manage-dash', component: ManagementDashboard, canActivate: [FinanceGuard] },
//   { path: 'compliance-report', component: ComplianceReport, canActivate: [FinanceGuard] },

//   { path: 'not-authorized', component: LoginComponent } // or a dedicated NotAuthorizedComponent




// ];

import { Routes } from '@angular/router';

// Guards
import { AdminGuard, FinanceGuard } from './services/admin.guard';

// Route config
export const routes: Routes = [
  // Default
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login
  { path: 'login', loadComponent: () => import('./features/login/login').then(m => m.LoginComponent) },

  // Not Authorized (dedicated page)
  {
  path: 'not-authorized',
  loadComponent: () => import('./features/login/login').then(m => m.LoginComponent),
},

  // --- Admin-only routes ---
  {
    path: 'admin-dashboard',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/Admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
  },

  // (Optional) alternative alias for admin dashboard - keep only one of these if you prefer
  {
    path: 'admin/dashboard',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/Admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard),
  },

  {
    path: 'treaties',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/treaty/treaty-list/treaty-list').then(m => m.TreatyList),
  },
  {
    path: 'treaties/new',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/treaty/treaty-form/treaty-form').then(m => m.TreatyForm),
  },
  {
    path: 'treaties/:id',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/treaty/treaty-detail/treaty-detail').then(m => m.TreatyDetail),
  },
  {
    path: 'treaties/:id/edit',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/treaty/treaty-form/treaty-form').then(m => m.TreatyForm),
  },
  {
    path: 'treaties/renewals',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/treaty/renewal-calendar/renewal-calendar').then(m => m.RenewalCalendar),
  },
  {
    path: 'renewals',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/treaty/renewal-calendar/renewal-calendar').then(m => m.RenewalCalendar),
  },
  {
    path: 'policies/new',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/policy-form/policy-form').then(m => m.PolicyForm),
  },
  {
    path: 'reinsurers',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/reinsurer/reinsurer-list/reinsurer-list').then(m => m.ReinsurerList),
  },
  {
    path: 'reinsurers/:id',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/reinsurer/reinsurer-detail/reinsurer-detail').then(m => m.ReinsurerDetail),
  },
  {
    path: 'cessions/new',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/risk-cession/risk-cession-form/risk-cession-form').then(m => m.RiskCession),
  },
  {
    path: 'recoveries/new',
    canActivate: [AdminGuard],
    loadComponent: () => import('./features/recovery/recovery-form/recovery-form').then(m => m.RecoveryFormComponent),
  },

  // --- Finance-only routes ---
  {
    path: 'finance-dashboard',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Financial-Report/finance-dashboard/finance-dashboard').then(m => m.FinanceDashboard),
  },
  {
    path: 'finance/dashboard',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Financial-Report/finance-dashboard/finance-dashboard').then(m => m.FinanceDashboard),
  },
  {
    path: 'dashboard',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Financial-Report/financelinks/financelinks').then(m => m.Financelinks),
  },
  {
    path: 'report',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Financial-Report/financial-report-list/financial-report-list').then(m => m.FinancialReportList),
  },
  {
    path: 'recoveries',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/recovery/recovery-list/recovery-list').then(m => m.RecoveryList),
  },



{ path: 'recoveries/:id/edit', loadComponent: () => import('./features/recovery/recovery-form/recovery-form').then(m => m.RecoveryFormComponent) },


  
  {
    path: 'recoveries/:id',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/recovery/recovery-detail/recovery-detail').then(m => m.RecoveryDetail),
  },
  {
    path: 'balance',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Financial-Report/balance-table/balance-table').then(m => m.BalanceTable),
  },
  {
    path: 'export',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Financial-Report/export-button/export-button').then(m => m.ExportButton),
  },
  {
    path: 'financerep',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Financial-Report/finance-summary/finance-summary').then(m => m.FinanceSummary),
  },
  {
    path: 'cessions',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/risk-cession/risk-cession-list/risk-cession-list').then(m => m.RiskCessionList),
  },
  {
    path: 'analytics-dash',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Analytics/analytics-dashboard/analytics-dashboard').then(m => m.AnalyticsDashboard),
  },
  {
    path: 'manage-dash',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Analytics/management-dashboard/management-dashboard').then(m => m.ManagementDashboard),
  },
  {
    path: 'compliance-report',
    canActivate: [FinanceGuard],
    loadComponent: () => import('./features/Analytics/compliance-report/compliance-report').then(m => m.ComplianceReport),
  },

  // Fallback
  { path: '**', redirectTo: 'login' }
];