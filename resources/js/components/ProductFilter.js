import React from 'react';

function ProductFilter({ value, onChange, onSearch }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && onSearch) {
            onSearch();
        }
    };

    return (
        <div className="inventory-filter">
            <input
                type="text"
                className="inventory-input"
                placeholder="Search products by name..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
}

export default ProductFilter;
