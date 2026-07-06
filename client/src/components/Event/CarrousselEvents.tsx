import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import CardEvent from "../../components/Event/CardEvent";
import { ModalEventProvider } from "../../context/CloseEventModalContext";
import useParticipants from "../../hooks/useParticipants";
import type { Activity } from "../../types/activity";
import "./CarrousselEvents.css";

type CarrousselEventsProps = {
  events: Activity[];
};

function CarrousselEvents({ events }: CarrousselEventsProps) {
  const participants = useParticipants();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const isClickingDot = useRef(false);

  // Calcule la largeur réelle d'une carte + son gap, directement depuis le DOM
  const getCardWidth = () => {
    const firstCard = carouselRef.current?.querySelector(".carousel-item");
    return firstCard ? firstCard.getBoundingClientRect().width + 24 : 0;
    // +16 = ton gap (var(--space-4)), à ajuster selon sa valeur réelle en px
  };

  // Gestion du scroll au clic sur les flèches
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;

      const cardWidth = getCardWidth();

      const scrollTo =
        direction === "left" ? scrollLeft - cardWidth : scrollLeft + cardWidth;

      carouselRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  // Surveiller le scroll pour activer/désactiver les flèches ET mettre à jour les dots
  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

      // Gestion des flèches (toujours actives)
      const isAtLeft = scrollLeft <= 10;
      const isAtRight = scrollLeft + clientWidth >= scrollWidth - 10;
      setCanScrollLeft(!isAtLeft);
      setCanScrollRight(!isAtRight);

      // flèches bloquées si on a cliqué sur un dot
      if (isClickingDot.current) return;

      // mode normal
      const cardWidth = getCardWidth();
      let newIndex = Math.round(scrollLeft / cardWidth);

      if (isAtRight) {
        newIndex = events.length - 1;
      } else if (isAtLeft) {
        newIndex = 0;
      }

      if (
        newIndex >= 0 &&
        newIndex < events.length &&
        newIndex !== activeIndex
      ) {
        setActiveIndex(newIndex);
      }
    }
  };

  // Gestion des dots
  const goToSlide = (index: number) => {
    if (carouselRef.current) {
      isClickingDot.current = true; // On bloque handleScroll
      setActiveIndex(index);

      const cardWidth = getCardWidth();
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });

      setTimeout(() => {
        isClickingDot.current = false;
      }, 400);
    }
  };
  return (
    <>
      <div className="carroussel-container">
        {events.length > 0 ? (
          <>
            {/* Flèche Gauche */}
            <button
              type="button"
              className={`carousel-arrow left ${!canScrollLeft ? "disabled" : ""}`}
              onClick={() => scroll("left")}
              aria-label="Evènement précédent"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Fenêtre visible du carrousel */}
            <div
              className="events-div-selected-events"
              ref={carouselRef}
              onScroll={handleScroll}
            >
              <div className="events-div-selected-events-container">
                {events.map((event) => {
                  const eventParticipants = participants.find(
                    (p) => p.id_activity === event.id,
                  );
                  return (
                    <div className="carousel-item" key={event.id}>
                      <ModalEventProvider>
                        <CardEvent
                          event={event}
                          participants={eventParticipants}
                        />
                      </ModalEventProvider>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flèche Droite */}
            <button
              type="button"
              className={`carousel-arrow right ${!canScrollRight ? "disabled" : ""}`}
              onClick={() => scroll("right")}
              aria-label="Evènement Suivant"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : (
          <p className="events-message-no-event">
            Aucun évènement ce jour. Sélectionnez un jour marqué (*).
          </p>
        )}
      </div>

      {/* Les Dots sous le bloc carrousel */}
      {events.length > 1 && (
        <div className="carousel-dots">
          {events.map((event, index) => (
            <button
              key={event.id}
              type="button"
              className={`carousel-dot ${index === activeIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller à la diapositive évènement ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default CarrousselEvents;
