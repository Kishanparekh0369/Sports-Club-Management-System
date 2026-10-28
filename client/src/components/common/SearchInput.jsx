import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search records...',
  className = ''
}) => {
  return (
    <div className={`search-input-wrapper ${className}`}>
      <Search size={18} />
      <input
        type="text"
        className="form-control-custom"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
