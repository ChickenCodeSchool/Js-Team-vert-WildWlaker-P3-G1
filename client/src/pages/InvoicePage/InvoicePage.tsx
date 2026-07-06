import { useParams } from "react-router";
import useInvoice from "../../hooks/useInvoice";
import "./InvoicePage.css";

function InvoicePage() {
  const { bookingId } = useParams();
  const invoice = useInvoice(Number(bookingId));

  if (!invoice) return <p className="invoice-page__loading">Chargement...</p>;

  return (
    <div className="invoice-page">
      <div className="invoice-page__container">
        <header className="invoice-page__header">
          <div className="invoice-page__logo">
            Le Local
            <span>Tiers-lieu · Paris</span>
          </div>
          <div className="invoice-page__ref">
            <h2 className="invoice-page__ref-number">
              Facture FAC-{invoice.bills_number}
            </h2>
            <p className="invoice-page__ref-date">
              Date : {invoice.start_date.slice(0, 10)}
            </p>
            <p className="invoice-page__ref-status">
              Statut :{" "}
              {invoice.payment_status === "paid"
                ? "Payé"
                : "En attente de paiement sur place"}
            </p>
          </div>
        </header>

        <div className="invoice-page__parties">
          <div className="invoice-page__party">
            <h3 className="invoice-page__party-label">Émetteur</h3>
            <p className="invoice-page__party-info">
              Le Local
              <br />
              14 rue de la République
              <br />
              75011 Paris
              <br />
              contact@lelocal.fr
            </p>
          </div>
          <div className="invoice-page__party">
            <h3 className="invoice-page__party-label">Client</h3>
            <p className="invoice-page__party-info">
              {invoice.firstname} {invoice.lastname}
              <br />
              {invoice.email}
            </p>
          </div>
        </div>

        <table className="invoice-page__table">
          <thead>
            <tr>
              <th>Espace</th>
              <th>Date</th>
              <th>Nb de tickets</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{invoice.space_name}</td>
              <td>{invoice.start_date.slice(0, 10)}</td>
              <td>{invoice.quantity}</td>
              <td>{Number(invoice.total_price).toFixed(2)} €</td>
            </tr>
          </tbody>
        </table>

        <div className="invoice-page__total">
          <strong className="invoice-page__total-amount">
            Total : {Number(invoice.total_price).toFixed(2)} €
          </strong>
        </div>

        <footer className="invoice-page__footer">
          Le Local · 14 rue de la République, 75011 Paris · contact@lelocal.fr ·
          SIRET 123 265 958 00001
        </footer>

        <button
          type="button"
          className="invoice-page__print"
          onClick={() => window.print()}
        >
          Télécharger en PDF
        </button>
      </div>
    </div>
  );
}

export default InvoicePage;
