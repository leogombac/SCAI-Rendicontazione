export function getTZOffsettedDate(date: Date) {
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const timeOffsetted = date.getTime() - tzOffset;
    return new Date(timeOffsetted);
}

export function formatDate(_date: Date, year = true, month = true, day = false, weekday = false) {

    if (!_date)
      return;

    const opt: any = {};
    if (year)
        opt.year = 'numeric';
    if (month)  
        opt.month = 'long';
    if (day)
        opt.day = 'numeric';
    if (weekday)
        opt.weekday = 'short';
    return _date.toLocaleDateString(
        undefined, // User locale
        opt
    );
}