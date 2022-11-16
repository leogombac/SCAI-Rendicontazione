import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CalendarDateFormatter, CalendarEvent, CalendarEventTimesChangedEvent, CalendarEventTitleFormatter, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, filter, finalize, startWith, takeUntil, tap } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { CustomEventTitleFormatter } from './custom-event-title-formatter.provider';
import { floorToNearest, ceilToNearest } from './angular-calendar.util';
import { isMobile } from 'src/app/utils/mobile.utils';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLElement>;

  @Input() viewDate: Date;
  @Input() events: CalendarEvent[];

  @Output() eventsChange = new EventEmitter<CalendarEvent[]>();
  @Output() eventSelected = new EventEmitter<CalendarEvent>();

  searchDate: FormControl;

  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;

  locale = 'it-IT';

  dragToCreateActive = false;

  weekStartsOn = DAYS_OF_WEEK.MONDAY;

  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.view = isMobile() ? CalendarView.Day : CalendarView.Week;
    // setInterval(() => console.error("Ping", (window['cal'] = this, window['calEvents'] = this.events, new Date().getTime())), 3000);
  }

  ngAfterViewInit() {
    this.createSearchDateInputHandler();
    this.createTimedScrolling();
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  private createSearchDateInputHandler() {

    this.searchDate = new FormControl('');
    this.searchDate.valueChanges
      .pipe(
        startWith(this.viewDate),
        filter(date => date && date instanceof Date),
        distinctUntilChanged(),
        tap((date: Date) => this.viewDate = date),
        takeUntil(this.destroy$)
      )
    .subscribe();
  }

  private createTimedScrolling() {
    // const nineAM: any = this.scrollContainer.nativeElement.querySelectorAll(".cal-hour:nth-child(10)")[0];
    // setTimeout(() =>
    //   this.scrollContainer.nativeElement.scroll({
    //     top: nineAM.offsetTop,
    //     behavior: 'smooth'
    //   })
    // , 100);
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
      draggable: true,
      meta: {
        tmpEvent: true,
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    console.warn(this.events);
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });
    const mouseEvents = ['mousemove', 'mousedown'];

    mouseEvents.forEach(mouseEv => {
      fromEvent(document, mouseEv)
        .pipe(
          finalize(() => {
            delete dragToSelectEvent.meta.tmpEvent;
            this.dragToCreateActive = false;
            this.refresh();
            this.eventsChange.emit(this.events);
            this.eventSelected.emit(dragToSelectEvent);

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
          if (newEnd === segment.date) {
            dragToSelectEvent.end = addMinutes(segment.date, 30);
          }

          this.calculateDuration(dragToSelectEvent);
          this.refresh();
        });
    });
  }

  private calculateDuration(dragToSelectEvent) {
    dragToSelectEvent.duration = dragToSelectEvent.end.getTime() - dragToSelectEvent.start.getTime();
    dragToSelectEvent.duration /= 1000;
    dragToSelectEvent.duration /= 60;
    dragToSelectEvent.duration /= 60;
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.calculateDuration(event);
    this.refresh();
  }

  onEventClicked({ event }: { event: CalendarEvent }): void {
    this.eventSelected.emit(event);
  }

  refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}

