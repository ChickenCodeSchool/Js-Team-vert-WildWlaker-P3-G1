import { useCallback, useEffect, useRef, useState } from "react";
import "./CreateEventForm.css";
import { useAuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../hooks/apiFetch";
import useSpaces from "../../hooks/useSpaces";
import useTimeSlot from "../../hooks/useTimeSlot";

type CreateEventDraft = {
  participants: number;
  priceUnit: number;
  startDate: string;
  nom: string;
  email: string;
  titre: string;
  description: string;
  selectedSpace: string;
  selectedTimeSlot: string;
  imageFileName: string;
};

type StoredCreateEventDraft = CreateEventDraft & {
  pendingSubmit: boolean;
};

const CREATE_EVENT_DRAFT_STORAGE_KEY = "create-event-form-draft";

function readStoredDraft(): StoredCreateEventDraft | null {
  const rawDraft = sessionStorage.getItem(CREATE_EVENT_DRAFT_STORAGE_KEY);

  if (!rawDraft) {
    return null;
  }

  try {
    const draft = JSON.parse(rawDraft) as Partial<StoredCreateEventDraft>;

    return {
      participants: Number(draft.participants) || 0,
      priceUnit: Number(draft.priceUnit) || 0,
      startDate: draft.startDate ?? "",
      nom: draft.nom ?? "",
      email: draft.email ?? "",
      titre: draft.titre ?? "",
      description: draft.description ?? "",
      selectedSpace: draft.selectedSpace ?? "",
      selectedTimeSlot: draft.selectedTimeSlot ?? "",
      imageFileName: draft.imageFileName ?? "",
      pendingSubmit: Boolean(draft.pendingSubmit),
    };
  } catch {
    sessionStorage.removeItem(CREATE_EVENT_DRAFT_STORAGE_KEY);
    return null;
  }
}

function writeStoredDraft(draft: StoredCreateEventDraft) {
  sessionStorage.setItem(CREATE_EVENT_DRAFT_STORAGE_KEY, JSON.stringify(draft));
}

function getLoginRedirectUrl() {
  const returnPath = `${window.location.pathname}${window.location.search}#create-event-form`;
  return `/log-in?redirect=${encodeURIComponent(returnPath)}`;
}

export default function CreateEventForm() {
  const user = useAuthContext();
  const spaces = useSpaces();
  const slot = useTimeSlot();
  const hasAutoSubmittedDraft = useRef(false);
  const [participants, setParticipants] = useState<number>(0);
  const [priceUnit, setPriceUnit] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [titre, setTitre] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const filteredSpaces = spaces.filter(
    (space) => space.space_type === "Evenements",
  );

  const getCurrentDraft = (): CreateEventDraft => ({
    participants,
    priceUnit,
    startDate,
    nom,
    email,
    titre,
    description,
    selectedSpace,
    selectedTimeSlot,
    imageFileName: imageFile?.name || imageFileName,
  });

  const restoreDraft = useCallback((draft: CreateEventDraft) => {
    setParticipants(draft.participants);
    setPriceUnit(draft.priceUnit);
    setStartDate(draft.startDate);
    setNom(draft.nom);
    setEmail(draft.email);
    setTitre(draft.titre);
    setDescription(draft.description);
    setSelectedSpace(draft.selectedSpace);
    setSelectedTimeSlot(draft.selectedTimeSlot);
    setImageFile(null);
    setImageFileName(draft.imageFileName);
  }, []);

  const saveDraft = (draft: CreateEventDraft, pendingSubmit: boolean) => {
    writeStoredDraft({ ...draft, pendingSubmit });
  };

  const resetForm = useCallback(() => {
    setDescription("");
    setEmail("");
    setImageFile(null);
    setImageFileName("");
    setMessage(null);
    setNom("");
    setParticipants(0);
    setPriceUnit(0);
    setSelectedSpace("");
    setSelectedTimeSlot("");
    setStartDate("");
    setTitre("");
    sessionStorage.removeItem(CREATE_EVENT_DRAFT_STORAGE_KEY);
  }, []);

  const submitEventRequest = useCallback(
    async (draft: CreateEventDraft): Promise<void> => {
      setIsSubmitting(true);

      try {
        const response = await apiFetch(
          "/api/dashboard/client/event-requests",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: draft.titre,
              description: draft.description,
              start_date: draft.startDate,
              end_date: draft.startDate,
              space_id: Number(draft.selectedSpace),
              time_slot_id: Number(draft.selectedTimeSlot),
              url_image: null,
              price_unit: draft.priceUnit,
            }),
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          setMessage({
            type: "error",
            text: data?.message ?? "Une erreur est survenue.",
          });
          return;
        }

        setMessage({
          type: "success",
          text: "Votre demande a bien été envoyée. Nous vous répondrons sous 48h.",
        });

        window.setTimeout(resetForm, 3000);
      } catch {
        setMessage({
          type: "error",
          text: "Une erreur est survenue. Veuillez réessayer.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [resetForm],
  );

  useEffect(() => {
    const storedDraft = readStoredDraft();

    if (!storedDraft) {
      return;
    }

    restoreDraft(storedDraft);

    if (
      !user ||
      user.role === "admin" ||
      !storedDraft.pendingSubmit ||
      hasAutoSubmittedDraft.current
    ) {
      return;
    }

    hasAutoSubmittedDraft.current = true;
    writeStoredDraft({ ...storedDraft, pendingSubmit: false });
    void submitEventRequest(storedDraft);
  }, [restoreDraft, submitEventRequest, user]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    const draft = getCurrentDraft();

    if (!user) {
      saveDraft(draft, true);
      window.location.href = getLoginRedirectUrl();
      return;
    }

    if (user.role === "admin") {
      setMessage({
        type: "error",
        text: "Les administrateurs créent des événements depuis le tableau de bord.",
      });
      return;
    }

    await submitEventRequest(draft);
  };

  const displayedImageName = imageFile?.name || imageFileName;

  return (
    <div className="create-event-page">
      <div className="create-event-sidebar">
        <p className="create-event-sidebar-subtitle">Vous avez un projet ?</p>
        <h1 className="create-event-sidebar-title">Proposez un événement</h1>
        <p className="create-event-sidebar-description">
          Le Local met ses espaces à disposition de la communauté pour organiser
          des ateliers, conférences, soirées et hackathons. Soumettez votre
          projet et notre équipe vous recontactera sous 48h.
        </p>
        <ul className="create-event-benefits-list">
          {[
            "Accès gratuit ou tarif communautaire",
            "Espaces de 8 à 100 personnes",
            "Sono, vidéo, Wi-Fi inclus",
            "Accompagnement logistique",
          ].map((item) => (
            <li key={item} className="create-event-benefit-item">
              <span className="create-event-benefit-icon" aria-hidden="true">
                ✓
              </span>
              <span className="create-event-benefit-text">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <form
        id="create-event-form"
        className="create-event-form-container"
        onSubmit={handleSubmit}
      >
        {!user && (
          <p className="create-event-message create-event-message--info">
            Vous pourrez vous connecter à l'étape finale pour envoyer votre
            demande.
          </p>
        )}

        {user?.role === "admin" && (
          <p className="create-event-message create-event-message--info">
            Les administrateurs créent des événements depuis le tableau de bord.
          </p>
        )}

        {message && (
          <p
            className={`create-event-message create-event-message--${message.type}`}
          >
            {message.text}
          </p>
        )}

        <div className="create-event-form-row">
          <div className="create-event-name-field">
            <label htmlFor="nom" className="create-event-name-label">
              Votre nom<span className="create-event-required">*</span>
            </label>
            <input
              id="nom"
              className="create-event-name-input"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Sophie Lefèvre"
              required
            />
          </div>

          <div className="create-event-email-field">
            <label htmlFor="email" className="create-event-email-label">
              E-mail<span className="create-event-required">*</span>
            </label>
            <input
              id="email"
              className="create-event-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sophie@studio.fr"
              required
            />
          </div>
        </div>

        <div className="create-event-title-field">
          <label htmlFor="titre" className="create-event-title-label">
            Titre de l'événement<span className="create-event-required">*</span>
          </label>
          <input
            id="titre"
            className="create-event-title-input"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Workshop Sérigraphie"
            required
          />
        </div>

        <div className="create-event-form-row">
          <div className="create-event-date-field">
            <label htmlFor="startDate" className="create-event-date-label">
              Date<span className="create-event-required">*</span>
            </label>
            <div className="create-event-date-input-wrapper">
              <span className="create-event-date-icon">📅</span>
              <input
                id="startDate"
                className="create-event-date-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>

          <div className="create-event-participants-field">
            <label
              htmlFor="participants"
              className="create-event-participants-label"
            >
              Participants estimés
            </label>
            <div className="create-event-participants-input-wrapper">
              <span className="create-event-participants-icon">👥</span>
              <input
                id="participants"
                required
                className="create-event-participants-input"
                type="number"
                min={1}
                max={300}
                value={participants || ""}
                onChange={(e) => setParticipants(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="create-event-price-field">
          <label htmlFor="priceUnit" className="create-event-price-label">
            Prix du ticket (€)
          </label>
          <input
            id="priceUnit"
            className="create-event-price-input"
            type="number"
            min={0}
            value={priceUnit || ""}
            onChange={(e) => setPriceUnit(Number(e.target.value))}
            placeholder="0 = gratuit"
          />
        </div>

        <div className="create-event-form-row">
          <div className="create-event-space-field">
            <label htmlFor="space" className="create-event-space-label">
              Salle souhaitée<span className="create-event-required">*</span>
            </label>
            <select
              id="space"
              className="create-event-space-select"
              value={selectedSpace}
              onChange={(e) => setSelectedSpace(e.target.value)}
              required
            >
              <option value="">Choisir une salle</option>
              {filteredSpaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.space_name}
                </option>
              ))}
            </select>
          </div>

          <div className="create-event-slot-field">
            <label htmlFor="slot" className="create-event-slot-label">
              Créneau souhaité<span className="create-event-required">*</span>
            </label>
            <select
              id="slot"
              className="create-event-slot-select"
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              required
            >
              <option value="">Choisir un créneau</option>
              {slot.map((timeSlot) => (
                <option key={timeSlot.id} value={timeSlot.id}>
                  {timeSlot.start_hour} - {timeSlot.end_hour}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="create-event-image-field">
          <label htmlFor="image" className="create-event-image-label">
            Image de l'événement
          </label>
          <label htmlFor="image" className="create-event-image-upload-label">
            <span className="create-event-image-upload-icon">🖼️</span>
            <span className="create-event-image-upload-text">
              {displayedImageName
                ? imageFile
                  ? displayedImageName
                  : `${displayedImageName} (à resélectionner si besoin)`
                : "Choisir une image (JPG, PNG, WEBP · 5 Mo max)"}
            </span>
            <input
              id="image"
              className="create-event-image-input"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
                setImageFileName(file?.name ?? "");
              }}
            />
          </label>
        </div>

        <div className="create-event-description-field">
          <label
            htmlFor="description"
            className="create-event-description-label"
          >
            Description du projet
            <span className="create-event-required">*</span>
          </label>
          <textarea
            id="description"
            className="create-event-description-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez votre événement, son objectif, son public cible…"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="create-event-submit-button"
          disabled={isSubmitting}
        >
          <span className="create-event-submit-icon">→</span>
          {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>

        <p className="create-event-form-footnote">
          Champs obligatoires marqués * · Réponse sous 48h
        </p>
      </form>
    </div>
  );
}
