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
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { RendicontazioneService } from './../services/rendicontazione.service';
import { CustomEventTitleFormatter } from './utils/custom-event-title-formatter.provider';
import { ceilToNearest, floorToNearest } from './utils/date.util';
import { isMobile } from '../utils/mobile.utils';
import { ConsuntivoEvent } from '../models/rendicontazione';
import { DialogGestionePresenzaComponent } from '../dialog-gestione-presenza/dialog-gestione-presenza.component';
import { MatDialog } from '@angular/material/dialog';
import { CalendarService } from './calendar.service';
import { UUID } from '../utils/uuid.utils';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
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
  
  loading = false;
  initialized = false;
  destroy$ = new Subject<void>();

  dragToCreateActive = false;

  constructor(
    public rendicontazioneService: RendicontazioneService,
    private calendarService: CalendarService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.view = isMobile() ? CalendarView.Day : CalendarView.Week;
  }

  ngOnInit() {

    this.rendicontazioneService.viewDate$
      .pipe(
        takeUntil(this.destroy$),
        tap(viewDate => {
          this.viewDate = viewDate;
          this.refresh();
        })
      )
      .subscribe();

    this.rendicontazioneService._consuntiviRemote$
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

    this.rendicontazioneService.loading$
      .pipe(
        takeUntil(this.destroy$),
        tap(loading => {
          this.loading = loading;
          this.refresh();
        }),
      )
      .subscribe();

    this.rendicontazioneService.initialized$
      .pipe(
        takeUntil(this.destroy$),
        tap(initialized => {
          this.initialized = initialized;
          this.refresh();
        }),
      )
      .subscribe();

    // Scroll once after init
    this.rendicontazioneService.initialized$
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
          // this.openDialog(dragToSelectEvent);
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

  eventTimesChanged({ event, newStart, newEnd, }): void {
    event.start = newStart;
    event.end = newEnd;
    event.meta.tmpEvent = true;
    event.setTitle();
    // this.openDialog(event);
    this.refresh();
  }

  onEventClicked({ event }: { event: ConsuntivoEvent }): void {
    this.openDialog(event);
  }

  private openDialog(event: ConsuntivoEvent, events?: ConsuntivoEvent[]) {
    this.dialog.open(
      DialogGestionePresenzaComponent,
      {
        data: { event, events },
        width: '90%',
        maxWidth: '800px',
        enterAnimationDuration: '0ms',
        exitAnimationDuration: '0ms'
      }
    );
  }

  refresh() {
    this.events = [
      ...this.calendarService._consuntiviLocal$.getValue(),
      ...this.rendicontazioneService._consuntiviRemote$.getValue()
    ];
    this.cdr.detectChanges();
  }
}
