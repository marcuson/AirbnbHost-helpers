import { appCtx } from '../app-ctx';
import { DateRange } from '../models/date-range';
import { ReservationCtx } from '../models/reservation-ctx';
import { threeLetterMonthToNum } from '../utils/date-utils';

let domThreadDisconnector: () => void;

export function startObserveDOM() {
  domThreadDisconnector = listenForDOMThread();
}

export function stopObserveDOM() {
  domThreadDisconnector();
}

function listenForDOMThread(): () => void {
  return VM.observe(document.body, () => {
    const inboxHeader = document.querySelector(
      'button[data-testid=host-inbox-open-thread-details-button] h3'
    );
    if (inboxHeader) {
      console.debug('Inbox header loaded, get reservation ctx');
      extractResCtxFromInboxHeader(inboxHeader as HTMLElement);
      return true;
    }

    const detailsHeader = document.querySelector(
      'div[data-testid=host-inbox-reservation-details] #FMP-target'
    );

    if (detailsHeader) {
      console.debug('Details header loaded, get reservation ctx');
      extractReservationCtxFromDetailsHeader(detailsHeader as HTMLElement);
      return true;
    }
  });
}

function extractResCtxFromInboxHeader(inboxHeader: HTMLElement): void {
  const dateRangeText = (
    inboxHeader.nextSibling.textContent.split('·')[1] as string
  ).trim();
  extractReservationCtxFromText(dateRangeText);
}

function extractReservationCtxFromDetailsHeader(
  detailsHeader: HTMLElement
): void {
  const dateRangeText = detailsHeader.nextSibling.nextSibling.textContent;
  extractReservationCtxFromText(dateRangeText);
}

function extractReservationCtxFromText(dateRangeText: string) {
  const dateRangeTextSplit = dateRangeText
    .replace(/\(.*/, '')
    .trim()
    .split(' ');

  let dateRange: DateRange;
  switch (dateRangeTextSplit.length) {
    case 2:
    case 3:
      dateRange = extractCompactDateRange(dateRangeTextSplit);
      break;
    case 5:
    case 6:
      dateRange = extractMidDateRange(dateRangeTextSplit);
      break;
    case 7:
      dateRange = extractLongDateRange(dateRangeTextSplit);
      break;
  }

  const { to, from } = dateRange;
  const resCtx: ReservationCtx = {
    dateFromStr: `${from.year}${from.month}${from.day}`,
    dateToStr: `${to.year}${to.month}${to.day}`,
  };
  appCtx.reservationCtx = resCtx;
}

function extractCompactDateRange(dateRangeTextSplit: string[]): DateRange {
  const [daysRange, monthThreeLett, yearSplit] = dateRangeTextSplit;
  const year = yearSplit ?? new Date().getFullYear().toString();
  const month = threeLetterMonthToNum(monthThreeLett)
    .toFixed(0)
    .padStart(2, '0');
  const [dayStart, dayEnd] = daysRange
    .split('–')
    .map((x) => x.padStart(2, '0'));
  return {
    from: {
      day: dayStart,
      month: month,
      year: year,
    },
    to: {
      day: dayEnd,
      month: month,
      year: year,
    },
  };
}

function extractMidDateRange(dateRangeTextSplit: string[]): DateRange {
  const [
    dayStrStart,
    monthThreeLettStart,
    _dash,
    dayStrEnd,
    monthThreeLettEnd,
    yearStr,
  ] = dateRangeTextSplit;
  const year = yearStr ?? new Date().getFullYear().toString();
  const monthStart = threeLetterMonthToNum(monthThreeLettStart)
    .toFixed(0)
    .padStart(2, '0');
  const monthEnd = threeLetterMonthToNum(monthThreeLettEnd)
    .toFixed(0)
    .padStart(2, '0');
  const dayStart = dayStrStart.padStart(2, '0');
  const dayEnd = dayStrEnd.padStart(2, '0');
  return {
    from: {
      day: dayStart,
      month: monthStart,
      year: year,
    },
    to: {
      day: dayEnd,
      month: monthEnd,
      year: year,
    },
  };
}

function extractLongDateRange(dateRangeTextSplit: string[]): DateRange {
  const [
    dayStrStart,
    monthThreeLettStart,
    yearStrStart,
    _dash,
    dayStrEnd,
    monthThreeLettEnd,
    yearStrEnd,
  ] = dateRangeTextSplit;
  const yearStart = yearStrStart;
  const yearEnd = yearStrEnd;
  const monthStart = threeLetterMonthToNum(monthThreeLettStart)
    .toFixed(0)
    .padStart(2, '0');
  const monthEnd = threeLetterMonthToNum(monthThreeLettEnd)
    .toFixed(0)
    .padStart(2, '0');
  const dayStart = dayStrStart.padStart(2, '0');
  const dayEnd = dayStrEnd.padStart(2, '0');
  return {
    from: {
      day: dayStart,
      month: monthStart,
      year: yearStart,
    },
    to: {
      day: dayEnd,
      month: monthEnd,
      year: yearEnd,
    },
  };
}
