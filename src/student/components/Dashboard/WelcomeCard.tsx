import React from 'react';

interface WelcomeCardProps {
  name: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ name }) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-2">
        <span className="bg-gradient-to-r from-[#42bff5] to-[#93e9f5] bg-clip-text text-transparent">
          Hi {name}
        </span>
        <span className="ml-2 inline-block transform transition-transform hover:scale-110">👋</span>
      </h2>
      <p className="text-gray-600">
        Nice to have you back, what an exciting day!<br />
        Get ready and continue your lesson.
      </p>
    </div>
  );
};

export default WelcomeCard;