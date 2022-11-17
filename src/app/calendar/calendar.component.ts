import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injectable,
} from '@angular/core';
import { 
  CalendarEvent,
  CalendarEventTitleFormatter,
  CalendarView,
  CalendarEventTimesChangedEvent,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { RendicontazioneService } from './../services/rendicontazione.service';
import { colors } from './utils/colors';
import { CustomEventTitleFormatter } from './utils/custom-event-title-formatter.provider';
import { ceilToNearest, floorToNearest } from './utils/date.util';

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

  CalendarView = CalendarView;

  view: CalendarView = CalendarView.Week;
  locale = 'it-IT';
  weekStartsOn = DAYS_OF_WEEK.MONDAY;

  viewDate: Date;
  events: CalendarEvent[] = [];
  
  loading = false;
  initialized = false;
  destroy$ = new Subject<void>();

  dragToCreateActive = false;

  constructor(
    public rendicontazioneService: RendicontazioneService,
    private cdr: ChangeDetectorRef
  ) { }

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

    this.rendicontazioneService.consuntivi$
      .pipe(
        takeUntil(this.destroy$),
        tap(consuntivi => {
          this.events = consuntivi;
          this.refresh();
        }),
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
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Nuovo consuntivo',
      start: segment.date,
      color: colors.yellow,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(
      this.viewDate,
      { weekStartsOn: this.weekStartsOn, }
    );

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refresh();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh();
      });
  }

  eventTimesChanged({ event, newStart, newEnd, }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh();
  }

  refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}
