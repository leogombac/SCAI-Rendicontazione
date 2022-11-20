export function getTZOffsettedDate(date: Date) {
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const timeOffsetted = date.getTime() - tzOffset;
    return new Date(timeOffsetted);
}