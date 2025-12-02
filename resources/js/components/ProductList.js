import React from 'react';

function ProductList({ products, loading, error, onEdit, onDelete }) {
    if (loading) {
        return <div className="inventory-state">Loading products...</div>;
    }

    if (error) {
        return <div className="inventory-state inventory-state--error">{error}</div>;
    }

    if (!products || products.length === 0) {
        return <div className="inventory-state">No products found.</div>;
    }

    return (
        <div className="product-list">
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.description}</td>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ProductList;
