import { appCtx } from '../app-ctx';
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
  const [daysRange, monthThreeLett, yearSplit] = dateRangeText
    .replace(/\(.*/, '')
    .trim()
    .split(' ');
  const year = yearSplit ?? new Date().getFullYear().toString();
  const month = threeLetterMonthToNum(monthThreeLett)
    .toFixed(0)
    .padStart(2, '0');
  const [dayStart, dayEnd] = daysRange
    .split('–')
    .map((x) => x.padStart(2, '0'));

  const resCtx: ReservationCtx = {
    dateFromStr: `${year}${month}${dayStart}`,
    dateToStr: `${year}${month}${dayEnd}`,
  };
  appCtx.reservationCtx = resCtx;
}
