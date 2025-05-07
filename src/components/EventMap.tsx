
import React from 'react';

interface Sector {
  id: string;
  name: string;
  price: number;
  capacity: number;
  available: number;
  color: string;
}

interface EventMapProps {
  sectors: Sector[];
  selectedSector?: string;
  onSectorSelect: (sectorId: string) => void;
  mapImageUrl?: string;
}

const EventMap: React.FC<EventMapProps> = ({
  sectors,
  selectedSector,
  onSectorSelect,
  mapImageUrl
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="relative border rounded-md overflow-hidden">
        {mapImageUrl ? (
          <img 
            src={mapImageUrl} 
            alt="Mapa do evento" 
            className="w-full object-cover aspect-video"
          />
        ) : (
          <div className="w-full aspect-video bg-muted/50 flex items-center justify-center">
            <p className="text-muted-foreground">Mapa do evento não disponível</p>
          </div>
        )}
      
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            onClick={() => onSectorSelect(sector.id)}
            className={`
              border rounded-md p-3 cursor-pointer transition-all
              ${selectedSector === sector.id ? 'border-2 border-primary' : ''}
              hover:border-primary/70
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: sector.color }}
                  />
                  <p className="font-medium">{sector.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {sector.available} de {sector.capacity} disponíveis
                </p>
              </div>
              <p className="font-semibold">
                R$ {sector.price.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventMap;
