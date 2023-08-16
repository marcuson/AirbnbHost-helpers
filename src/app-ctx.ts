import { EVENT_RESERVATION_CTX } from './models/events';
import { ReservationCtx } from './models/reservation-ctx';

class AppCtx {
  private _reservationCtx?: ReservationCtx;

  set reservationCtx(value: ReservationCtx) {
    this._reservationCtx = value;
    document.dispatchEvent(new Event(EVENT_RESERVATION_CTX));
  }

  get reservationCtx(): ReservationCtx {
    return this._reservationCtx;
  }
}

export const appCtx = new AppCtx();
