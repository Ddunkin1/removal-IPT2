import React, { useEffect, useState } from 'react';

function ProductForm({ initialProduct, onSave, onCancel, saving }) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (initialProduct) {
            setName(initialProduct.name || '');
            setCategory(initialProduct.category || '');
            setPrice(initialProduct.price != null ? String(initialProduct.price) : '');
            setQuantity(initialProduct.quantity != null ? String(initialProduct.quantity) : '');
            setDescription(initialProduct.description || '');
        } else {
            setName('');
            setCategory('');
            setPrice('');
            setQuantity('');
            setDescription('');
        }
    }, [initialProduct]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const cleanedPrice = price.replace(/,/g, '');

        const payload = {
            name: name.trim(),
            category: category || null,
            price: cleanedPrice !== '' ? parseFloat(cleanedPrice) : null,
            quantity: quantity !== '' ? parseInt(quantity, 10) : null,
            description: description.trim(),
        };

        onSave(payload);
    };

    const isEditMode = Boolean(initialProduct && initialProduct.id);

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    type="text"
                    className="inventory-input"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                    id="category"
                    className="inventory-input"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing & Apparel">Clothing & Apparel</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Automotive">Automotive</option>
                </select>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="price">Price (USD)</label>
                    <input
                        id="price"
                        type="number"
                        className="inventory-input"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        step="0.01"
                        min="0"
                        placeholder="$0.00"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        id="quantity"
                        type="number"
                        className="inventory-input"
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        min="0"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    className="inventory-input inventory-input--textarea"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={3}
                />
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
                </button>
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ProductForm;
