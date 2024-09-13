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
    const detailsHeader = document.querySelector(
      'section#thread_details_panel'
    );

    if (detailsHeader) {
      const dateElem = detailsHeader.querySelector(
        'div[data-testid="hrd-sbui-header-section"]>div>div:nth-child(3)'
      );
      if (!dateElem) {
        return false;
      }

      console.debug('Details header loaded, get reservation ctx');
      extractReservationCtxFromDetailsHeader(dateElem as HTMLElement);
      return true;
    }
  });
}

function extractReservationCtxFromDetailsHeader(dateElem: HTMLElement): void {
  const dateRangeText = dateElem.textContent;
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
