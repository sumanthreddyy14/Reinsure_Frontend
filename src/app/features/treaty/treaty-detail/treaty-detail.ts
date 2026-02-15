import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Subject, of } from 'rxjs';
import { map, filter, distinctUntilChanged, switchMap, takeUntil, catchError } from 'rxjs';
import { TreatyService } from '../../../services/treaty.service';
import { Treaty } from '../../../models/treaty.model';
import { QuickLinks } from '../../Admin/quick-links/quick-links';


@Component({
  selector: 'app-treaty-detail',
  standalone: true,
  // Remove QuickLinks from imports for now
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule,QuickLinks],
  templateUrl: './treaty-detail.html',
  styleUrls: ['./treaty-detail.css'], // use styleUrls (plural)
})
export class TreatyDetail implements OnInit, OnDestroy {
  treaty?: Treaty;
  loading = false;
  error?: string;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private treatyService: TreatyService,
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
        console.log('[TreatyDetail] fetching id =', id);
        return this.treatyService.getById(id).pipe(
          catchError(err => {
            console.error('[TreatyDetail] load failed', err);
            // Ensure state update happens in Angular zone
            this.ngZone.run(() => {
              this.error = err?.message ?? 'Load failed';
              this.treaty = undefined;
              this.loading = false;
              this.cdr.detectChanges();
            });
            return of(null); // keep stream alive
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((resp: any) => {
      // Ensure UI updates even if HTTP completes outside Angular
      this.ngZone.run(() => {
        console.log('[TreatyDetail] API response', resp);
        this.treaty = resp || undefined;  // backend returns the object directly
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
