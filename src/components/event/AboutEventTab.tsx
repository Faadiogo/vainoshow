
import React from 'react';

interface AboutEventTabProps {
  description: string;
}

const AboutEventTab: React.FC<AboutEventTabProps> = ({ description }) => {
  return (
    <div className="space-y-4">
      <p>{description}</p>
    </div>
  );
};

export default AboutEventTab;
