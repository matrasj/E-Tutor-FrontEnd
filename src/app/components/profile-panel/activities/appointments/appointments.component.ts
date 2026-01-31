import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import plLocale from '@fullcalendar/core/locales/pl';
import { VisitPayloadModel } from '../../../../model/visit/visit-payload-model';
import { VisitService } from '../../../../service/visit-service';
import { finalize, forkJoin } from 'rxjs';
import { AuthService } from '../../../../service/auth-service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ApproveVisitModalComponent } from './approve-visit-modal/approve-visit-modal.component';
import { RejectVisitModalComponent } from './reject-visit-modal/reject-visit-modal.component';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  private readonly DEFAULT_DURATION_MIN = 60;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin],
    locale: plLocale,
    headerToolbar: { left: 'prev,next', center: 'title', right: 'dayGridMonth' },
    height: 'auto',
    contentHeight: '100%',
    aspectRatio: 1.35,
    editable: false,
    selectable: false,
    dayMaxEvents: 3,
    moreLinkText: (n: number) => '+ ' + n + ' more',
    eventClassNames: 'custom-event',
    dayHeaderClassNames: 'custom-day-header',
    dayHeaderFormat: { weekday: 'long' },
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
    events: []
  };

  public isLoading = false;
  visitsAsTutor: VisitPayloadModel[] = [];
  visitsAsStudent: VisitPayloadModel[] = [];
  acceptedVisits: VisitPayloadModel[] = [];
  rejectedVisits: VisitPayloadModel[] = [];
  private currentUserId!: number;

  constructor(
    private visitService: VisitService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUser().id;
    this.fetchData();
  }

  private fetchData() {
    this.isLoading = true;
    const userId: number = this.currentUserId;

    forkJoin([
      this.visitService.getAllVisitRequestsAsStudent(userId),
      this.visitService.getAllVisitRequestsAsTutor(userId),
      this.visitService.getAllAcceptedVisitConnectedToUser(userId),
      this.visitService.getAllRejectedVisitConnectedToUser(userId)
    ])
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ([asStudent, asTutor, accepted, rejected]) => {
          this.visitsAsStudent = asStudent;
          this.visitsAsTutor = asTutor;
          this.acceptedVisits = accepted;
          this.rejectedVisits = rejected;

          const tutorIds = new Set(this.visitsAsTutor.map(v => v.id));
          const events = this.acceptedVisits.map(v => this.mapVisitToEvent(v, tutorIds.has(v.id)));
          this.calendarOptions = { ...this.calendarOptions, events };
        },
        error: () => this.toastrService.error('An error occurred during fetching data')
      });
  }

  private mapVisitToEvent(v: VisitPayloadModel, isTutorRole: boolean) {
    const start = this.combineDateTime(v.visitDate, v.visitTime);
    const end = this.addMinutes(start, this.DEFAULT_DURATION_MIN);
    const colors = isTutorRole
      ? { backgroundColor: '#4f46e5', borderColor: '#4338ca', textColor: '#ffffff' }
      : { backgroundColor: '#059669', borderColor: '#047857', textColor: '#ffffff' };

    return {
      title: v.purpose || 'Visit',
      start,
      end,
      ...colors,
      extendedProps: { visitId: v.id, tutorName: v.tutorName, requesterName: v.requesterName, isTutorRole }
    };
  }

  private combineDateTime(dateStr: string, timeStr: string): string {
    return `${dateStr}T${timeStr}:00`;
  }

  private addMinutes(localIsoNoTZ: string, minutes: number): string {
    const [datePart, timePart] = localIsoNoTZ.split('T');
    const [y, m, d] = datePart.split('-').map(n => +n);
    const [hh, mm, ss] = timePart.split(':').map(n => +n);
    const dt = new Date(y, m - 1, d, hh, mm, ss || 0);
    dt.setMinutes(dt.getMinutes() + minutes);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
  }

  approve(visitId: number) {
    const dialogRef = this.dialog.open(ApproveVisitModalComponent, {
      data: { visitId },
      panelClass: 'big-dialog',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((confirmed?: boolean) => {
      if (confirmed) {
        this.fetchData();
      }
    });
  }

  reject(visitId: number) {
    const dialogRef = this.dialog.open(RejectVisitModalComponent, {
      data: { visitId },
      panelClass: 'big-dialog',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((confirmed?: boolean) => {
      if (confirmed) {
        this.fetchData();
      }
    });
  }
}
