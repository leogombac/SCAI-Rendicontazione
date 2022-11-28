import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  CalendarEventTitleFormatter,
  CalendarView,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent, Subject } from 'rxjs';
import { finalize, take, takeUntil, tap } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek, isSameDay, isSameMonth } from 'date-fns';
import { ConsuntivoService } from '../services/consuntivo.service';
import { NoTooltipEventTitleFormatter } from './utils/custom-event-title-formatter.provider';
import { ceilToNearest, floorToNearest } from './utils/date.util';
import { isMobile } from '../utils/mobile.utils';
import { ConsuntivoEvent } from '../models/consuntivo';
import { DialogGestionePresenzaComponent } from '../dialog-gestione-presenza/dialog-gestione-presenza.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarService } from './calendar.service';
import { UUID } from '../utils/uuid.utils';
import { AppStateService } from '../services/app-state.service';
import { UserService } from '../services/user.service';
import { toHyphenCase } from '../utils/string.utils';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: NoTooltipEventTitleFormatter,
    },
  ],
})
export class CalendarComponent {

  @ViewChild('scrollContainer') scrollContainer: ElementRef;

  CalendarView = CalendarView;

  view: CalendarView = CalendarView.Week;
  locale = 'it-IT';
  weekStartsOn = DAYS_OF_WEEK.MONDAY;

  viewDate = new Date();
  events: ConsuntivoEvent[] = [];

  activeDayIsOpen: boolean = true;
  
  loading = false;
  initialized = false;
  destroy$ = new Subject<void>();

  dragToCreateActive = false;

  constructor(
    public appState: AppStateService,
    private userService: UserService,
    public consuntivoService: ConsuntivoService,
    private calendarService: CalendarService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.view = isMobile() ? CalendarView.Day : CalendarView.Week;
  }

  ngOnInit() {

    this.appState.viewDate$
      .pipe(
        takeUntil(this.destroy$),
        tap(viewDate => {
          this.viewDate = viewDate;
          this.refresh();
        })
      )
      .subscribe();

    this.consuntivoService._consuntiviRemote$
      .pipe(
        takeUntil(this.destroy$),
        tap(consuntivi => {
          this.events = consuntivi;
          this.refresh();
        }),
      )
      .subscribe();

    this.calendarService._consuntiviLocal$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => this.refresh()),
      )
      .subscribe();

    this.consuntivoService.loading$
      .pipe(
        takeUntil(this.destroy$),
        tap(loading => {
          this.loading = loading;
          this.refresh();
        }),
      )
      .subscribe();

    this.consuntivoService.initialized$
      .pipe(
        takeUntil(this.destroy$),
        tap(initialized => {
          this.initialized = initialized;
          this.refresh();
        }),
      )
      .subscribe();

    // Scroll once after init
    this.consuntivoService.initialized$
      .pipe(
        tap(() => this.scrollContainer.nativeElement.scroll(0, 540)),
        take(1),
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {

    const dragToSelectEvent = new ConsuntivoEvent({
      id: UUID(),
      start: segment.date
    });

    // Emit on consuntiviLocal$ and refresh
    const consuntivi = this.calendarService._consuntiviLocal$.getValue();
    consuntivi.push(dragToSelectEvent);
    this.calendarService._consuntiviLocal$
      .next(consuntivi);

    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, { weekStartsOn: this.weekStartsOn });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          this.dragToCreateActive = false;
          this.refresh();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        
        const minutesDiff = ceilToNearest(mouseMoveEvent.clientY - segmentPosition.top, 30);
        const daysDiff = floorToNearest(mouseMoveEvent.clientX - segmentPosition.left, segmentPosition.width) / segmentPosition.width;
        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);

        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
          dragToSelectEvent.setTitle();
        }

        this.refresh();
      });
  }

  dayClicked({ date, events }: { date: Date; events: ConsuntivoEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true || events.length === 0)
        this.activeDayIsOpen = false;
      else
        this.activeDayIsOpen = true;
      this.viewDate = date;
    }
    this.appState.viewDate = date;
  }

  eventTimesChanged({ event, newStart, newEnd, }): void {
    event.start = newStart;
    event.end = newEnd;
    event.meta.tmpEvent = true;
    event.setTitle();
    this.refresh();
  }

  onEventClicked({ event }: { event: ConsuntivoEvent }): void {
    this.openDialog(event);
  }

  private openDialog(event: ConsuntivoEvent, events?: ConsuntivoEvent[]) {

    // Do nothing if stato is Chiuso or Vistato
    if (this.appState.viewIdStato === 2 || this.appState.viewIdStato === 3)
      return;

    this.dialog.open(
      DialogGestionePresenzaComponent,
      {
        data: { event, events },
        width: '90%',
        maxWidth: '800px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms',
        autoFocus: false
      }
    );
  }

  refresh() {
    this.events = [
      ...this.calendarService._consuntiviLocal$.getValue(),
      ...this.consuntivoService._consuntiviRemote$.getValue()
    ];
    this.cdr.detectChanges();
  }

  beforeWeekViewRender(renderEvent: any): void {

    if (!this.userService.festivita) return;

    const festivo = this.userService.festivita.reduce((acc, val) => (acc[val.mese + '-' + val.giorno] = val, acc), {});

    renderEvent.header.forEach(day => {
      const _festivo = festivo[(day.date.getMonth() + 1) + '-' + day.date.getDate()];
      (_festivo || [0, 6].includes(day.date.getDay()))
        ? day.cssClass = 'is-holiday ' + toHyphenCase(_festivo?.festivita)
        : null
    });

    renderEvent.hourColumns.forEach((hourColumn) =>
      hourColumn.hours.forEach((hour) =>
        hour.segments.forEach((segment) => {
          const _festivo = festivo[(segment.date.getMonth() + 1) + '-' + segment.date.getDate()];
          (_festivo || [0, 6].includes(segment.date.getDay()))
            ? segment.cssClass = 'is-holiday ' + toHyphenCase(_festivo?.festivita)
            : null
          })
      )
    );
  }
}
