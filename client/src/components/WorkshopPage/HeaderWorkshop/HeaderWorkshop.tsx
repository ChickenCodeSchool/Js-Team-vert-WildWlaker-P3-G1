import "./HeaderWorkshop.css";
import type { FirstArticleProps } from "../../../types/firstarticleprops";
import FirstArticle from "../../SpacesPage/Header/FirstArticle/FirstArticle";

function HeaderWorkshop() {
  const WorkshopHeaderFirstArticle: FirstArticleProps = {
    bigtitle: "APPRENDRE & CREER ENSEMBLE",
    sloganBegin: "Des",
    sloganItalic: "ateliers",
    sloganEnd: "qui vous font grandir",
    description:
      "Sérigraphie, code, poterie, podcast, cuisine, photographie… Des formations courtes animées par des experts passionnés, dans nos espaces.",
    info1: 4,
    info1text: "Ateliers",
    info2: 1400,
    info2text: "M² TOTAL",
    info3: "580+",
    info3text: "Participants / an",
  };

  return (
    <section className="header-workshop-page-global-section">
      <div className="header-spaces-page-container-articles">
        <FirstArticle pageData={WorkshopHeaderFirstArticle} />
      </div>
    </section>
  );
}

export default HeaderWorkshop;
