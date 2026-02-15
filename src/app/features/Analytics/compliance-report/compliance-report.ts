
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ComplianceService, ComplianceRules } from '../../../services/compliance.service';

import type { ComplianceIssue, AnalyticsData } from '../../../models/analytics.model';
import type { FinanceFilters } from '../../../models/finance.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from '../../../models/material.module';
import { MatChipsModule } from '@angular/material/chips';
import { FinanceDashboard } from '../../Financial-Report/finance-dashboard/finance-dashboard';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-compliance-report',
  templateUrl: './compliance-report.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    FinanceDashboard,
    MaterialModule,
    MatChipsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  styleUrls: ['./compliance-report.css']
})
export class ComplianceReport implements OnInit, AfterViewInit, OnDestroy {
  issues: ComplianceIssue[] = [];
  summary = { LOW: 0, MEDIUM: 0, HIGH: 0, total: 0 };
  loading = false;
  errorMsg?: string;

  filters: FinanceFilters = {};

  rules: ComplianceRules = {
    maxPendingDays: 60,
    minUtilization: 0.30,
    maxOutstandingPerTreaty: 0,
    maxLossRatio: 1.2
  };

  displayedColumns = ['id', 'entityType', 'entityId', 'severity', 'detectedAt', 'message'];

  // ----- Chart refs & instances -----
  @ViewChild('treatyUtilizationRef', { static: true }) treatyUtilizationRef!: ElementRef<HTMLDivElement>;
  @ViewChild('lossRatioGaugeRef', { static: true }) lossRatioGaugeRef!: ElementRef<HTMLDivElement>;

  private treatyChart?: echarts.ECharts;
  private lossGauge?: echarts.ECharts;

  private resizeObserver?: ResizeObserver;

  // Seed demo data (replace with real analytics later)
  private treatyLabels: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  private treatyValues: number[] = [72, 78, 81, 79, 85, 88];
  private lossRatioValue = 83.5; // %
  private lossRatioMax = 150;    // gauge max domain

  constructor(private compliance: ComplianceService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.refresh();
  }

  ngAfterViewInit(): void {
    // Defer to ensure the Material card has computed dimensions
    if (isPlatformBrowser(this.platformId)) {
    setTimeout(() => {
      this.initCharts();
      // Show something immediately
      this.setTreatyUtilization(this.treatyLabels, this.treatyValues, 100);
      this.setLossRatio(this.lossRatioValue, this.lossRatioMax);

      // Robust responsiveness
      this.resizeObserver = new ResizeObserver(() => {
        this.treatyChart?.resize();
        this.lossGauge?.resize();
      });
      this.resizeObserver.observe(this.treatyUtilizationRef.nativeElement);
      this.resizeObserver.observe(this.lossRatioGaugeRef.nativeElement);

      window.addEventListener('resize', this.onWindowResize);
    }, 0);
  }
  }
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
    window.removeEventListener('resize', this.onWindowResize);
    this.resizeObserver?.disconnect();
    this.treatyChart?.dispose();
    this.lossGauge?.dispose();
  }
}

  // ---------- Chart Initialization ----------
  private initCharts(): void {
    const accentBlue = '#1976d2';
    const green = '#2e7d32';
    const amber = '#ef6c00';
    const red   = '#c62828';
    const text  = '#1f2937';

    // Initialize instances
    this.treatyChart = echarts.init(this.treatyUtilizationRef.nativeElement);
    this.lossGauge   = echarts.init(this.lossRatioGaugeRef.nativeElement);

    // Treaty Utilization Line
    this.treatyChart.setOption({
      grid: { left: 40, right: 20, top: 35, bottom: 35 },
      tooltip: { trigger: 'axis', valueFormatter: (v: any) => `${Number(v).toFixed(1)}%` },
      xAxis: { type: 'category', boundaryGap: false, data: [] },
      yAxis: { type: 'value', min: 0, max: 100, axisLabel: { formatter: '{value}%' }, splitLine: { show: true } },
      series: [{
        name: 'Treaty Utilization',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 3, color: accentBlue },
        itemStyle: { color: accentBlue },
        areaStyle: { opacity: 0.15, color: accentBlue },
        data: []
      }],
      legend: { show: false }
    });

    // Loss Ratio Gauge
    this.lossGauge.setOption({
      tooltip: { formatter: '{a}<br/>{c}%' },
      series: [{
        name: 'Loss Ratio',
        type: 'gauge',
        min: 0,
        max: this.lossRatioMax,
        splitNumber: 6,
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.6, green],
              [0.9, amber],
              [1.0, red]
            ]
          }
        },
        pointer: { length: '65%' },
        axisTick: { distance: -10, splitNumber: 5 },
        detail: { valueAnimation: true, fontSize: 18, formatter: (v: number) => `${v.toFixed(1)}%`, color: text },
        title: { offsetCenter: [0, '80%'], fontSize: 14 },
        data: [{ value: 0, name: 'Loss Ratio' }]
      }]
    });
  }

  // ---------- Chart Update APIs ----------
  setTreatyUtilization(labels: string[], values: number[], yMax = 100): void {
    if (!this.treatyChart) return;
    this.treatyChart.setOption({
      xAxis: { data: labels },
      yAxis: { max: yMax },
      series: [{ data: values }]
    });
  }

  setLossRatio(value: number, max: number = this.lossRatioMax): void {
    if (!this.lossGauge) return;
    this.lossRatioMax = max;
    this.lossGauge.setOption({
      series: [{ max, data: [{ value, name: 'Loss Ratio' }] }]
    });
  }

  private onWindowResize = () => {
    this.treatyChart?.resize();
    this.lossGauge?.resize();
  };

  // ---------- Existing actions ----------
  clearFilters(): void {
    this.filters = { from: '', to: '' } as any;
    this.issues = [];
    this.summary = { LOW: 0, MEDIUM: 0, HIGH: 0, total: 0 };
    this.setTreatyUtilization([], [], 100);
    this.setLossRatio(0, this.lossRatioMax);
  }

  clearTable(): void {
    this.issues = [];
    this.summary = { LOW: 0, MEDIUM: 0, HIGH: 0, total: 0 };
    this.setTreatyUtilization([], [], 100);
    this.setLossRatio(0, this.lossRatioMax);
  }

  refresh(): void {
    this.loading = true;
    this.errorMsg = undefined;

    if (!this.filters.from && !this.filters.to) {
      this.issues = [];
      this.summary = { LOW: 0, MEDIUM: 0, HIGH: 0, total: 0 };
      this.loading = false;
      return;
    }

    this.compliance.listIssues(this.filters, this.rules).subscribe({
      next: (res: AnalyticsData<ComplianceIssue[]>) => {
        this.issues = res.data ?? [];
        this.summary = this.compliance.summarize(this.issues);
        this.loading = false;

        // TODO: Bind real analytics when available
        // const labels = res.meta?.periods ?? this.treatyLabels;
        // const utilization = res.meta?.treatyUtilization ?? this.treatyValues;
        // const lossRatioPct = res.meta?.lossRatioPct ?? this.lossRatioValue;
        // const lossGaugeMax = res.meta?.lossGaugeMax ?? this.lossRatioMax;

        const labels = this.treatyLabels;
        const utilization = this.treatyValues;
        const lossRatioPct = this.lossRatioValue;
        const lossGaugeMax = this.lossRatioMax;

        this.setTreatyUtilization(labels, utilization, 100);
        this.setLossRatio(lossRatioPct, lossGaugeMax);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load compliance issues.';
        this.loading = false;
      }
    });
  }

  exportCSV(): void {
    if (isPlatformBrowser(this.platformId)) {
    const blob = this.compliance.exportIssuesCSV(this.issues);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'compliance_issues.csv';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }
  }
  trackById(_: number, i: ComplianceIssue) { return i.id; }
}
``
