import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Subject, of } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap, takeUntil, catchError } from 'rxjs';
import { ReinsurerService } from '../../../services/reinsurer.service';
import { Reinsurer } from '../../../models/reinsurer.model';
import { QuickLinks } from '../../Admin/quick-links/quick-links';

// TEMP: remove QuickLinks to rule it out; add back after it works
// import { QuickLinks } from '../../Admin/quick-links/quick-links';

@Component({
  selector: 'app-reinsurer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule,QuickLinks], // add QuickLinks back later
  templateUrl: './reinsurer-detail.html',
  styleUrls: ['./reinsurer-detail.css'], // use styleUrls (plural)
})
export class ReinsurerDetail implements OnInit, OnDestroy {
  reinsurer?: Reinsurer;
  loading = false;
  error?: string;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private reinsurerService: ReinsurerService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.route.paramMap.pipe(
      map(pm => pm.get('id')),
      filter((id): id is string => !!id),
      map(id => decodeURIComponent(id.trim())),
      distinctUntilChanged(),
      switchMap(id => {
        console.log('[ReinsurerDetail] fetching id =', id);
        return this.reinsurerService.getById(id).pipe(
          catchError(err => {
            this.ngZone.run(() => {
              console.error('[ReinsurerDetail] load failed', err);
              this.error = err?.message ?? 'Load failed';
              this.reinsurer = undefined;
              this.loading = false;
              this.cdr.detectChanges();
            });
            return of(null);
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((resp: any) => {
      this.ngZone.run(() => {
        console.log('[ReinsurerDetail] API response', resp);
        this.reinsurer = resp || undefined; // backend returns the object directly
        this.loading = false;
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
