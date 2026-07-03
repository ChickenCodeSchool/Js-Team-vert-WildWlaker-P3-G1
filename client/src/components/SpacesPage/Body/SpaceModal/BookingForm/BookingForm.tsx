import { useEffect, useState } from "react";
import type { Space } from "../../../../../types/space";
import "./BookingForm.css";
import { useNavigate } from "react-router";
import { apiFetch } from "../../../../../hooks/apiFetch";
import useSpaceAvailability from "../../../../../hooks/useSpaceAvailability.ts";
import useTimeSlot from "../../../../../hooks/useTimeSlot";
import type { TimeSlot } from "../../../../../types/time-slot";

type BookingFormProps = {
  space: Space;
  onBack: () => void;
  userId: number;
};

/**
 * Formulaire de réservation pour un espace donné.
 * Le comportement (champs affichés, calcul du prix, vérification de dispo) varie selon la catégorie de l'espace :
 * - espace "open" (catégorie contenant "open") : on choisit un nombre de places
 * - "Local vide" : réservation sur une durée en mois (pas de créneau horaire)
 * - tout le reste (salle de réunion, studio...) : réservation par créneau, un seul occupant possible
 */
function BookingForm({ space, onBack, userId }: BookingFormProps) {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(1);
  // Durée en mois pour un "Local vide". Pas de setter exposé pour l'instant (toujours 1 mois) : le underscore signale que setMonths n'est pas utilisé.
  const [months, _setMonths] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Liste des créneaux horaires, en excluant "Soir" (non proposé à la réservation)
  const timeSlots = useTimeSlot();
  const timeSlot = timeSlots.filter((time) => time.slot !== "Soir");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  const isOpenSpace = space.space_category.toLowerCase().includes("open");
  const isLocal = space.space_category === "Local vide";
  const navigate = useNavigate();

  // Pour un "Local vide", calcule à l'avance la date de fin (date + X mois) afin de pouvoir vérifier la disponibilité de la période avant validation
  const previewEndDate =
    isLocal && date
      ? (() => {
          const start = new Date(date);
          start.setMonth(start.getMonth() + months);
          return start.toISOString().split("T")[0];
        })()
      : undefined;

  // Interroge l'API de disponibilité :
  // - mode "créneau" (timeSlotId) pour les espaces non-locaux
  // - mode "plage de dates" (endDate) pour les locaux vides
  const { availability, loading: availabilityLoading } = useSpaceAvailability(
    space.id,
    date,
    isLocal ? undefined : selectedTimeSlot,
    isLocal ? previewEndDate : undefined,
  );

  // Un espace "exclusif" est tout espace qui n'est pas "open" (salle de réunion, studio, local vide...) : un seul occupant possible par créneau/période
  const isExclusiveSpace = !isOpenSpace;
  const isUnavailable =
    isExclusiveSpace && availability != null && availability.available === 0;

  // Nombre maximum de places sélectionnables : ne peut pas dépasser la capacité totale, ni le nombre de places réellement encore disponibles
  const maxSeats = isOpenSpace
    ? Math.min(space.capacity, availability?.available ?? space.capacity)
    : space.capacity;

  // Si la dispo change (ex: après changement de créneau) et que le nombre de places sélectionné dépasse maintenant ce qui reste disponible, on ramène automatiquement la sélection à une valeur valide
  useEffect(() => {
    if (isOpenSpace && availability && seats > (availability?.available ?? 0)) {
      setSeats(
        (availability?.available ?? 0) > 0 ? (availability?.available ?? 0) : 1,
      );
    }
  }, [availability, isOpenSpace, seats]);

  // Le créneau "Journée" coûte plus cher (majoration) qu'un demi-créneau
  const isFullDay =
    timeSlots.find((s) => String(s.id) === selectedTimeSlot)?.slot ===
    "Journée";

  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Applique la majoration "Journée" au prix unitaire directement,
  // sauf pour les locaux vides (réservés au mois, sans notion de créneau)
  const effectivePrice = isLocal
    ? space.price_unit
    : space.price_unit * (isFullDay ? 1.75 : 1);

  // Calcul du prix total selon le type d'espace :
  // - open      : prix effectif x nombre de places
  // - local     : prix unitaire x nombre de mois
  // - exclusif  : prix effectif (créneau unique)
  const totalPrice = isOpenSpace
    ? effectivePrice * seats
    : isLocal
      ? effectivePrice * months
      : effectivePrice;

  /**
   * Soumet la réservation à l'API (ajout au panier).
   * Recalcule la date de fin pour les locaux (date + months) avant l'envoi.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      let endDate = date;
      if (isLocal && date) {
        const start = new Date(date);
        start.setMonth(start.getMonth() + months);
        endDate = start.toISOString().split("T")[0];
      }

      const payload = {
        space_id: space.id,
        time_slot_id: isLocal ? null : Number(selectedTimeSlot),
        start_date: date,
        end_date: endDate,
        seats: isOpenSpace ? seats : null,
        months: isLocal ? months : null,
        users_id: userId,
        total_price: totalPrice,
        effective_price: effectivePrice,
        name,
      };

      const res = await apiFetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // En cas d'erreur métier (créneau pris, plus de place...), l'API renvoie un message explicite qu'on affiche à l'utilisateur
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Erreur lors de la réservation");
      }

      setSuccess(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue, veuillez réessayer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Écran de confirmation affiché après une réservation réussie
  if (success) {
    return (
      <div className="booking-form">
        <button type="button" className="booking-form-back" onClick={onBack}>
          ‹ Retour
        </button>
        <h2 className="booking-form-title">Ajouté au panier</h2>
        <p>
          Votre réservation pour {space.space_name} le {formattedDate} a été
          ajoutée à votre panier.
        </p>
        <div className="booking-form-button-div">
          <div className="booking-form-button-div">
            <button
              type="button"
              className="booking-form-go-cart"
              onClick={() => navigate("/cart")}
            >
              ‹ Voir votre panier
            </button>
          </div>
        </div>
      </div>
    );
  }
  console.log(availability);
  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <button type="button" className="booking-form-back" onClick={onBack}>
        ‹ Retour
      </button>

      <h2 className="booking-form-title">Réserver — {space.space_name}</h2>

      <label className="booking-form-label">
        Date
        <input
          type="date"
          className="booking-form-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      {/* Pas de sélection de créneau pour un local vide (réservation à la durée) */}
      {!isLocal && (
        <label className="booking-form-label">
          Créneau
          <select
            className="booking-form-input"
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            required
          >
            <option value="">Sélectionnez un créneau</option>
            {timeSlot.map((slot: TimeSlot) => (
              <option key={slot.id} value={slot.id}>
                {slot.slot}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Sélecteur de nombre de places, uniquement pour les espaces "open" encore disponibles */}
      {isOpenSpace && !isUnavailable && (availability?.available ?? 0) > 0 && (
        <label className="booking-form-label">
          Nombre de places
          <input
            type="number"
            min={1}
            max={maxSeats}
            value={seats}
            onChange={(e) => {
              const raw = Number(e.target.value);
              if (Number.isNaN(raw)) return;
              // Empêche de sortir des bornes [1, maxSeats] même si l'utilisateur tape une valeur invalide au clavier
              const clamped = Math.min(Math.max(raw, 1), maxSeats);
              setSeats(clamped);
            }}
            className="booking-form-input"
          />
        </label>
      )}

      {/* Message de disponibilité pour les espaces "open" (places restantes) */}
      {date && selectedTimeSlot && (
        <span className="booking-form-availability">
          {availabilityLoading
            ? "Vérification des disponibilités..."
            : availability
              ? isOpenSpace
                ? (availability?.available ?? 0) > 0
                  ? `${availability.available} place${(availability?.available ?? 0) > 1 ? "s" : ""} disponible${(availability?.available ?? 0) > 1 ? "s" : ""} sur ${availability.capacity}`
                  : "Aucune place disponible pour ce créneau"
                : null
              : null}
        </span>
      )}

      {/* Message de disponibilité pour les espaces exclusifs (créneau ou période entièrement libre/occupée) */}
      {isExclusiveSpace && date && (selectedTimeSlot || previewEndDate) && (
        <p className="booking-form-availability">
          {availabilityLoading
            ? "Vérification des disponibilités..."
            : availability
              ? (availability?.available ?? 0) > 0
                ? isLocal
                  ? "Cette période est disponible"
                  : "Ce créneau est disponible"
                : isLocal
                  ? "Cet espace est déjà réservé sur une période qui chevauche ces dates"
                  : "Ce créneau est déjà réservé pour cet espace"
              : null}
        </p>
      )}

      {/* Coordonnées du client, affichées seulement si une place est effectivement disponible */}
      {!isUnavailable && (availability?.available ?? 0) > 0 && (
        <label className="booking-form-label">
          Nom
          <input
            type="text"
            className="booking-form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      )}

      {/* Récapitulatif du prix, formulé différemment selon le type d'espace */}
      <p className="booking-form-price">
        {isOpenSpace &&
          !isUnavailable &&
          (availability?.available ?? 0) > 0 &&
          `${seats} place${seats > 1 ? "s" : ""} : ${totalPrice}€`}
        {isLocal && `${months} mois : ${totalPrice}€`}
        {!isOpenSpace && !isLocal && `${totalPrice}€`}
      </p>

      {errorMsg && <p className="booking-form-error">{errorMsg}</p>}

      <button
        type="submit"
        className="booking-form-submit"
        disabled={
          submitting ||
          (isOpenSpace && availability?.available === 0) ||
          isUnavailable
        }
      >
        {submitting ? "Envoi..." : "Confirmer la réservation"}
      </button>
    </form>
  );
}

export default BookingForm;
