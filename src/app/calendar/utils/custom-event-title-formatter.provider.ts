import { Injectable } from "@angular/core";
import { CalendarEvent, CalendarEventTitleFormatter } from "angular-calendar";

@Injectable()
export class EventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event?.meta?.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event?.meta?.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

@Injectable()
export class NoTooltipEventTitleFormatter extends CalendarEventTitleFormatter {
  monthTooltip(event: CalendarEvent): string {
    return;
  }

  weekTooltip(event: CalendarEvent): string {
    return;
  }

  dayTooltip(event: CalendarEvent): string {
    return;
  }
}