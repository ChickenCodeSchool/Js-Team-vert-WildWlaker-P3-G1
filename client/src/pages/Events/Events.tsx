import { useState } from "react";
import CalendarAgenda from "react-calendar";
import CardEvent from "../../components/Event/CardEvent";
import FooterDashboard from "../../components/FooterDashboard/FooterDashboard";
import FirstArticle from "../../components/SpacesPage/Header/FirstArticle/FirstArticle";
import { ModalEventProvider } from "../../context/CloseEventModalContext";
import useParticipants from "../../hooks/useParticipants";
import useUpcomingEvents from "../../hooks/useUpcomingEvents";
import type { FirstArticleProps } from "../../types/firstarticleprops";
import "./Events.css";
import "react-calendar/dist/Calendar.css";
import { Calendar, CalendarDays } from "lucide-react";
import CreateEventForm from "../../components/CreateEventForm/CreateEventForm";
import CarrousselEvents from "../../components/Event/CarrousselEvents";
import useEventsOfTheDay from "../../hooks/useEventsOfTheDay";

function Events() {
  const EventFirstArticle: FirstArticleProps = {
    bigtitle: "AGENDA DU TIERS LIEU",
    sloganBegin: "Des",
    sloganItalic: "évènements",
    sloganEnd: "qui créent du lien",
    description:
      "Conférences, concerts, expositions, workshops ouverts... Le Local anime son espace avec une programmation variée et inclusive",
    info1: 28,
    info1text: "CE MOIS-CI",
    info2: 340,
    info2text: "PARTICIPANTS / MOIS",
    info3: "12",
    info3text: "ORGANISATIONS",
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [maxCardsForGrid, setMaxCardsForGrid] = useState<number>(3);

  const chooseDate = (date: Date) => {
    // le calendrier affiche la case sélectionnée
    setSelectedDate(date);
  };
  const dateCalendarFormatted = selectedDate
    ? selectedDate.toLocaleDateString("fr-CA")
    : null;

  const eventsOfTheDay = useEventsOfTheDay(dateCalendarFormatted);
  const upcomingEvents = useUpcomingEvents();
  const participants = useParticipants();

  // style css cases calendrier
  const dynamicTileClassName = ({
    date,
    view,
  }: { date: Date; view: string }) => {
    // On ne veut ajouter la classe que sur la vue "mois" (pas année/décennie)
    if (view === "month") {
      const dateTileFormatted = date.toLocaleDateString("fr-CA");

      // On cherche si un événement en BDD correspond à la date de cette case
      const hasEvent = upcomingEvents.some(
        (event) => event.start_date.slice(0, 10) === dateTileFormatted,
      );

      if (hasEvent) {
        return "has-event";
      }
    }
    return "no-event";
  };

  return (
    <>
      <header className="events-section-hero">
        <FirstArticle pageData={EventFirstArticle} />
      </header>

      <section className="events-big-section">
        <div className="events-big-title">
          <h1 className="events-page-title">Nos évènements</h1>
          <hr className="events-page-hr" />
        </div>
        <p className="events-text">
          Conférences, ateliers, concerts, expositions ou rencontres conviviales
          : découvrez la programmation du Local et trouvez votre prochain
          rendez-vous.
        </p>
        <section className="events-section-agenda">
          <div className="events-div-icon-title">
            <span className="events-icon-wrapper events-icon-calendar">
              <CalendarDays size={24} strokeWidth={2} />
            </span>
            <div className="events-agenda-div-title-text">
              <h2 className="events-title">Agenda</h2>
              <p className="events-text events-text-agenda">
                Choisissez une date pour découvrir les événements. Les jours
                marqués (*) comportent au moins un événement.
              </p>
            </div>
          </div>
          <div className="events-calendar-carroussel-container">
            {/* Calendrier centré qui ne s'étire plus */}
            <div className="events-calendar-wrapper">
              <CalendarAgenda
                onChange={(value) => {
                  if (value instanceof Date) {
                    chooseDate(value);
                  }
                }}
                value={selectedDate}
                tileClassName={dynamicTileClassName}
              />
              {/*tileClassName est une propriété de calendar pour le css*/}
            </div>
            <div className="events-details-panel">
              {eventsOfTheDay.length === 0 ? (
                <>
                  <span className="events-icon-wrapper events-icon-empty">
                    <Calendar size={40} strokeWidth={1.5} />
                  </span>
                  <p className="events-text event-empty-day">
                    Aucun événement ce jour.
                  </p>
                  <p className="events-text event-empty-day">
                    Sélectionnez une date marquée (*) dans le calendrier.
                  </p>
                </>
              ) : (
                <div className="events-carroussel-container">
                  <CarrousselEvents events={eventsOfTheDay} />
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
      <section className="events-section-upcoming">
        <h2 className="events-title">Prochains évènements</h2>
        <p className="events-text">
          Retrouvez ici l'ensemble des événements programmés dans les prochaines
          semaines. Parcourez les différentes propositions, réservez votre place
          si nécessaire et rejoignez-nous pour partager ces moments.
        </p>
        <div className="events-grid-container">
          {upcomingEvents.slice(0, maxCardsForGrid).map((upcomingEvent) => {
            const eventParticipants = participants.find(
              (p) => p.id_activity === upcomingEvent.id,
            );
            return (
              <ModalEventProvider key={upcomingEvent.id}>
                <CardEvent
                  event={upcomingEvent}
                  participants={eventParticipants}
                />
              </ModalEventProvider>
            );
          })}
        </div>
        <button
          type="button"
          className="events-btn-see-all"
          onClick={() => setMaxCardsForGrid(50)}
        >
          Voir tous les évènements
        </button>
      </section>
      <section className="events-create-event">
        <CreateEventForm />
      </section>
      <FooterDashboard />
    </>
  );
}

export default Events;
