import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Treaty } from '../../../models/treaty.model';
import { TreatyService } from '../../../services/treaty.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { ChangeDetectorRef } from '@angular/core';
import { QuickLinks } from '../../Admin/quick-links/quick-links';

@Component({
  selector: 'app-treaty-list',standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    QuickLinks
  ],
  templateUrl: './treaty-list.html',
  styleUrl: './treaty-list.css',
})
export class TreatyList implements OnInit {
  displayedColumns = ['treatyId', 'reinsurerName', 'treatyType', 'coverageLimit', 'period', 'status', 'actions'];
  dataSource = new MatTableDataSource<Treaty>([]);
  loading = false;

  status: string = '';
  type: string = '';
  reinsurer: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private treatyService: TreatyService,
    private cdr: ChangeDetectorRef,private router: Router
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

fetch(): void {
  this.loading = true;
  this.treatyService.list().subscribe(res => {
    let filtered = res;

    if (this.status) {
      filtered = filtered.filter(t => t.status === this.status);
    }
    if (this.type) {
      filtered = filtered.filter(t => t.treatyType === this.type);
    }
    if (this.reinsurer) {
      filtered = filtered.filter(t =>
        t.reinsurerName.toLowerCase().includes(this.reinsurer.toLowerCase())
      );
    }

    this.dataSource = new MatTableDataSource(filtered);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  });
}


go(id: string | number) {
  if (id === null || id === undefined) return;
  const slug = encodeURIComponent(String(id));
  this.router.navigate(['/treaties', slug]);
}




  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}