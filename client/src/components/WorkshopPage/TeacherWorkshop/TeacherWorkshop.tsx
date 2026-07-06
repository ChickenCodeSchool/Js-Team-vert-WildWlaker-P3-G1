import "./TeacherWorkshop.css";

function TeacherWorkshop() {
  const teachers = [
    {
      initials: "LR",
      specialityClass: "ceramique",
      name: "Lucie Rambaud",
      speciality: "Céramique & Terres",
      description:
        "Céramiste professionnelle depuis 12 ans, ancienne de l'École de Limoges. Atelier propre à Montauban.",
      workshopCount: 8,
    },
    {
      initials: "TC",
      specialityClass: "numerique",
      name: "Thomas Curet",
      speciality: "Numérique & Code",
      description:
        "Développeur freelance spécialisé Python & automatisation. Pédagogie par le projet, pas la théorie.",
      workshopCount: 12,
    },
    {
      initials: "ML",
      specialityClass: "photographie",
      name: "Marie Lassalle",
      speciality: "Photographie",
      description:
        "Photographe de reportage, formatrice AFPA. Spécialiste portrait et paysage industriel.",
      workshopCount: 6,
    },
    {
      initials: "CR",
      specialityClass: "artisanat",
      name: "Camille Roux",
      speciality: "Artisanat textile",
      description:
        "Artiste textile, sérigraphiste indépendante. Collabore avec des marques locales sur leur édition limitée.",
      workshopCount: 9,
    },
  ];

  return (
    <section className="teacher-workshop">
      <h2 className="teacher-workshop__title">NOS FORMATEURS</h2>
      <div className="teacher-workshop__grid">
        {teachers.map((teacher) => (
          <div
            key={teacher.name}
            className={`teacher-workshop__card ${teacher.specialityClass}`}
          >
            <div className="teacher-workshop__avatar">
              <span>{teacher.initials}</span>
            </div>
            <p className="teacher-workshop__name">{teacher.name}</p>
            <p className="teacher-workshop__speciality">{teacher.speciality}</p>
            <p className="teacher-workshop__description">
              {teacher.description}
            </p>
            <p className="teacher-workshop__count">
              <em>{teacher.workshopCount}</em> ateliers animés
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TeacherWorkshop;
