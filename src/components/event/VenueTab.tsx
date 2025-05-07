
import React from 'react';

interface VenueTabProps {
  location: string;
}

const VenueTab: React.FC<VenueTabProps> = ({ location }) => {
  return (
    <div className="space-y-4">
      <p>
        <strong>{location}</strong>
      </p>
      <p>
        Informações sobre o local do evento, como chegar, estacionamento, etc.
      </p>
      <div className="aspect-[16/9] bg-muted rounded-md overflow-hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14646.329535827474!2d-45.905534965675244!3d-23.40332045224688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cdb7f24d84e071%3A0x6f4dbdc1c68d4ada!2sSanta%20Branca%2C%20SP%2C%2012380-000!5e0!3m2!1spt-BR!2sbr!4v1746567089255!5m2!1spt-BR!2sbr"
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default VenueTab;

