import "./Contact.scss";

const CONTACT = {
  first_name:  "Steve",
  last_name:   "Rogers",
  title:       "Diététicien nutritionniste",
  email:       "steve.rogers@dietetica.fr",
  phone:       "06 00 00 00 00",
  address:     "106 Av. Pierre de Coubertin, 53000 Laval",
  description: "Spécialisée en nutrition clinique et sportive, j'accompagne mes patients vers une alimentation équilibrée et durable.",
};

export default function ContactPage() {
  return (
    <div className="cp">
      <div className="cp__top">
        <div>
          <h1 className="cp__title">Contact</h1>
        </div>
      </div>

      <div className="cp__card">
        <div className="cp__card-header">
          <div className="cp__avatar">
            {CONTACT.first_name[0]}{CONTACT.last_name[0]}
          </div>
          <div>
            <h2 className="cp__fullname">{CONTACT.first_name} {CONTACT.last_name}</h2>
            <p className="cp__role-title">{CONTACT.title}</p>
          </div>
        </div>

        {CONTACT.description && (
          <p className="cp__description">{CONTACT.description}</p>
        )}

        <div className="cp__infos">
          {CONTACT.email && (
            <a href={`mailto:${CONTACT.email}`} className="cp__info-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              {CONTACT.email}
            </a>
          )}
          {CONTACT.phone && (
            <a href={`tel:${CONTACT.phone}`} className="cp__info-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.09 2.18 2 2 0 012.08 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
              </svg>
              {CONTACT.phone}
            </a>
          )}
          {CONTACT.address && (
            <div className="cp__info-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {CONTACT.address}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
