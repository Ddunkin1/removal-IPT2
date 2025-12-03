import React from 'react';

const formatCurrency = (value) => {
    const number =
        typeof value === 'number'
            ? value
            : value != null
            ? Number(value)
            : 0;

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};

function ProductList({ products, onEdit, onDelete }) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="product-list">
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Item Cost</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Available</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => {
                        const quantity =
                            typeof product.quantity === 'number'
                                ? product.quantity
                                : product.quantity != null
                                ? Number(product.quantity)
                                : 0;

                        const available = quantity;

                        const id = product.id != null ? product.id : index + 1;

                        return (
                            <tr key={id}>
                                <td>{id}</td>
                                <td>{product.name}</td>
                                <td>{product.category || '—'}</td>
                                <td>
                                    <span className="price-badge">{formatCurrency(product.price)}</span>
                                </td>
                                <td>{product.description}</td>
                                <td>{quantity}</td>
                                <td>{available}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => onEdit(product)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => onDelete(product)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;
