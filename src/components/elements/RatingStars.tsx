import React, { useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';

interface RatingStarsProps {
  onRatingChange: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ onRatingChange }) => {
  const [rating, setRating] = useState<number>(0);

  const handleValueChange = (value: string) => {
    const numValue = parseInt(value);
    setRating(numValue);
    onRatingChange(numValue);
  };

  return (
    <RadioGroup.Root 
      className="flex gap-1" 
      value={rating.toString()} 
      onValueChange={handleValueChange}
      aria-label="Avalie o álbum de 1 a 10"
    >
      {[...Array(10)].map((_, i) => {
        const value = (i + 1).toString();
        return (
          <RadioGroup.Item
            key={value}
            value={value}
            className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${
              i < rating ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-400'
            }`}
          >
            {i + 1}
          </RadioGroup.Item>
        );
      })}
    </RadioGroup.Root>
  );
};