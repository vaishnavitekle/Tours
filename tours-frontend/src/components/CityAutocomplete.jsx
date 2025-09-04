// src/components/CityAutocomplete.jsx
import { useState } from 'react';
import './CityAutocomplete.css';

const CityAutocomplete = ({ 
  value = '', 
  onChange, 
  tours = [],
  className = '', 
  placeholder = 'Search tours by city...' 
}) => {
  // Extract unique titles from tours
  const tourTitles = [...new Set(
    tours
      .map(tour => tour.title)
      .filter(Boolean)
      .sort()
  )];

  return (
    <div className={`city-autocomplete ${className}`}>
      <input
        type="text"
        list="tourTitles"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        autoComplete="off"
      />
      <datalist id="tourTitles">
        {tourTitles.map((title, index) => (
          <option key={`${title}-${index}`} value={title} />
        ))}
      </datalist>
    </div>
  );
};

export default CityAutocomplete;