import { useState } from "react";
import "./CreateEventForm.css";
import { apiFetch } from "../../hooks/apiFetch";
import useSpaces from "../../hooks/useSpaces";
import useTimeSlot from "../../hooks/useTimeSlot";

export default function CreateEventForm() {
  const spaces = useSpaces();
  const slot = useTimeSlot();
  const [participants, setParticipants] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [nom, setNom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [titre, setTitre] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedSpace, setSelectedSpace] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const filteredSpaces = spaces.filter(
    (space) => space.space_type === "Evenements",
  );

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("nom", nom);
    formData.append("email", email);
    formData.append("titre", titre);
    formData.append("description", description);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("participants", participants.toString());
    formData.append("salle", selectedSpace);
    formData.append("creneau", selectedTimeSlot);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await apiFetch("/api/createEvent", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Erreur serveur :", errorText);

        setMessage({
          type: "error",
          text: "Une erreur est survenue",
        });

        return;
      }

      const result = await response.json();

      console.log("Succès :", result);

      setMessage({
        type: "success",
        text: "Votre demande a bien été envoyée. Nous vous répondrons sous 48h.",
      });
    } catch (error) {
      console.error("Erreur :", error);

      setMessage({
        type: "error",
        text: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
    const resetForm = () => {
      setDescription("");
      setEmail("");
      setEndDate("");
      setImageFile(null);
      setMessage(null);
      setNom("");
      setParticipants(0);
      setSelectedSpace("");
      setSelectedTimeSlot("");
      setStartDate("");
      setTitre("");
    };
    setTimeout(resetForm, 3000);
  };

  return (
    <div className="create-event-page">
      {/* Colonne de présentation */}
      <div className="create-event-sidebar">
        <p className="create-event-sidebar-subtitle">Vous avez un projet ?</p>
        <h2 className="create-event-sidebar-title">Proposez un événement</h2>
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

      {/* Formulaire */}
      <form
        className="create-event-form-container"
        onSubmit={handleSubmit}
        noValidate
      >
        {message && (
          <p
            className={`create-event-message create-event-message--${message.type}`}
          >
            {message.text}
          </p>
        )}

        <div className="create-event-form-row">
          {/* Nom */}
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

          {/* Email */}
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

        {/* Titre */}
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
          {/* Date début */}
          <div className="create-event-date-field">
            <label htmlFor="startDate" className="create-event-date-label">
              Date de début
              <span className="create-event-required">*</span>
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
              />
            </div>
          </div>

          {/* Date fin */}
          <div className="create-event-date-field">
            <label htmlFor="endDate" className="create-event-date-label">
              Date de fin
              <span className="create-event-required">*</span>
            </label>
            <div className="create-event-date-input-wrapper">
              <span className="create-event-date-icon">📅</span>
              <input
                id="endDate"
                className="create-event-date-input"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Participants */}
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
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <div className="create-event-form-row">
          {/* Salle */}
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

          {/* Créneau */}
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

        {/* Image */}
        <div className="create-event-image-field">
          <label htmlFor="image" className="create-event-image-label">
            Image de l'événement<span className="create-event-required">*</span>
          </label>
          <label htmlFor="image" className="create-event-image-upload-label">
            <span className="create-event-image-upload-icon">🖼️</span>
            <span className="create-event-image-upload-text">
              {imageFile
                ? imageFile.name
                : "Choisir une image (JPG, PNG, WEBP · 5 Mo max)"}
            </span>
            <input
              id="image"
              className="create-event-image-input"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setImageFile(e.target.files?.[0] ?? null)
              }
              required
            />
          </label>
        </div>

        {/* Description */}
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

        {/* Bouton */}
        <button type="submit" className="create-event-submit-button">
          <span className="create-event-submit-icon">→</span>
          Envoyer ma demande
        </button>

        <p className="create-event-form-footnote">
          Champs obligatoires marqués * · Réponse sous 48h
        </p>
      </form>
    </div>
  );
}
