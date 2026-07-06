import { X } from "lucide-react";
import type { Activity } from "../../../types/activity";
import type { Booking } from "../../../types/booking";
import "./AllActivitiesModal.css";

type EventRequest = {
  id: number;
  name: string;
  space_name: string;
  start_date: string;
  end_date: string;
  start_hour: string;
  end_hour: string;
  status: string;
};

type Props = {
  title: string;
  items: Activity[] | Booking[] | EventRequest[];
  onClose: () => void;
  type: "event" | "booking" | "request";
};

function isBooking(item: Activity | Booking | EventRequest): item is Booking {
  return "total_price" in item;
}

function isRequest(
  item: Activity | Booking | EventRequest,
): item is EventRequest {
  return "status" in item;
}

function AllActivitiesModal({ title, items, onClose, type }: Props) {
  return (
    <div
      className="all-activities-modal__overlay"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      <dialog
        className="all-activities-modal__container"
        aria-labelledby="modal-title"
        open
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="all-activities-modal__header">
          <h2 className="all-activities-modal__title">{title}</h2>
          <button
            type="button"
            className="all-activities-modal__close"
            onClick={onClose}
            aria-label="Fermer la modale"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <ul className="all-activities-modal__list">
          {items.map((item) => (
            <li key={item.id} className="all-activities-modal__item">
              <div className="all-activities-modal__info">
                <span className="all-activities-modal__name">
                  {type === "booking" ? item.space_name : item.name}
                </span>
                <span className="all-activities-modal__meta">
                  {item.start_date.slice(0, 10)} · {item.start_hour.slice(0, 5)}{" "}
                  - {item.end_hour.slice(0, 5)}
                </span>
              </div>
              {isBooking(item) && (
                <span className="all-activities-modal__price">
                  {item.total_price} €
                </span>
              )}
              {isRequest(item) && (
                <span
                  className={`all-activities-modal__status all-activities-modal__status--${item.status}`}
                >
                  {item.status === "pending"
                    ? "En attente"
                    : item.status === "approved"
                      ? "Validé"
                      : "Refusé"}
                </span>
              )}
            </li>
          ))}
        </ul>
      </dialog>
    </div>
  );
}

export default AllActivitiesModal;
