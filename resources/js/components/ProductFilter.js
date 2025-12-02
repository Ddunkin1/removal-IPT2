import React from 'react';

function ProductFilter({ value, onChange }) {
    return (
        <div className="inventory-filter">
            <input
                type="text"
                className="inventory-input"
                placeholder="Search products by name..."
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}

export default ProductFilter;
