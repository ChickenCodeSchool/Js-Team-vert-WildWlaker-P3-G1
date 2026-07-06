import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import useEventRequests from "../../../hooks/useEventRequests";
import AllActivitiesModal from "../AllActivitiesModal/AllActivitiesModal";
import "./EventRequestsClient.css";

function EventRequestsClient() {
  const requests = useEventRequests();
  const [showModal, setShowModal] = useState(false);
  const displayed = requests.slice(0, 3);

  return (
    <section className="event-requests-client__container">
      <div className="event-requests-client__header">
        <h2 className="event-requests-client__title">
          <CalendarPlus
            size={20}
            color="var(--color-primary)"
            aria-hidden="true"
          />{" "}
          Mes demandes d'événements
        </h2>
        {requests.length > 0 && (
          <button
            type="button"
            className="event-requests-client__toggle"
            onClick={() => setShowModal(true)}
            aria-label="Voir toutes mes demandes d'événements"
          >
            Voir tout
          </button>
        )}
      </div>

      {requests.length === 0 ? (
        <p className="event-requests-client__empty">
          Aucune demande d'événement.
        </p>
      ) : (
        <ul className="event-requests-client__list">
          {displayed.map((request) => (
            <li key={request.id} className="event-requests-client__item">
              <div className="event-requests-client__info">
                <span className="event-requests-client__name">
                  {request.name}
                </span>
                <span className="event-requests-client__meta">
                  {request.start_date.slice(0, 10)} · {request.space_name} ·{" "}
                  {request.start_hour.slice(0, 5)} -{" "}
                  {request.end_hour.slice(0, 5)}
                </span>
              </div>
              <span
                className={`event-requests-client__status event-requests-client__status--${request.status}`}
              >
                {request.status === "pending"
                  ? "En attente"
                  : request.status === "approved"
                    ? "Validé"
                    : "Refusé"}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <AllActivitiesModal
          title="Toutes mes demandes d'événements"
          items={requests}
          onClose={() => setShowModal(false)}
          type="request"
        />
      )}
    </section>
  );
}

export default EventRequestsClient;
