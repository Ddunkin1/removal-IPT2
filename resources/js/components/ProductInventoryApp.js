import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ProductFilter from './ProductFilter';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const API_BASE_URL = '/api/product';

function ProductInventoryApp() {
    const [products, setProducts] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(API_BASE_URL);
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleCreate = async (productData) => {
        setSaving(true);
        setError('');

        try {
            await axios.post(API_BASE_URL, productData);
            await loadProducts();
            setEditingProduct(null);
        } catch (err) {
            setError('Failed to create product. Please check the data and try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (productData) => {
        if (!editingProduct) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            await axios.put(`${API_BASE_URL}/${editingProduct.id}`, productData);
            await loadProducts();
            setEditingProduct(null);
        } catch (err) {
            setError('Failed to update product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        if (!product || !product.id) {
            return;
        }

        const confirmed = window.confirm(`Delete product "${product.name}"?`);

        if (!confirmed) {
            return;
        }

        setError('');

        try {
            await axios.delete(`${API_BASE_URL}/${product.id}`);
            setProducts((current) => current.filter((item) => item.id !== product.id));
        } catch (err) {
            setError('Failed to delete product. Please try again.');
        }
    };

    const handleSave = (productData) => {
        if (editingProduct) {
            handleUpdate(productData);
        } else {
            handleCreate(productData);
        }
    };

    const filteredProducts = useMemo(() => {
        const term = filterText.trim().toLowerCase();

        if (!term) {
            return products;
        }

        return products.filter((product) => {
            if (!product || typeof product.name !== 'string') {
                return false;
            }

            return product.name.toLowerCase().includes(term);
        });
    }, [products, filterText]);

    return (
        <div className="inventory-app">
            <header className="inventory-header">
                <h1 className="inventory-title">Product Inventory Manager</h1>
                <p className="inventory-subtitle">
                    Manage your products: add, update, delete, and filter by name.
                </p>
            </header>

            <main className="inventory-main">
                <section className="inventory-main-content">
                    <div className="inventory-toolbar">
                        <ProductFilter value={filterText} onChange={setFilterText} />
                    </div>

                    <ProductList
                        products={filteredProducts}
                        loading={loading}
                        error={error}
                        onEdit={setEditingProduct}
                        onDelete={handleDelete}
                    />
                </section>

                <aside className="inventory-sidebar">
                    <h2 className="inventory-sidebar-title">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>

                    <ProductForm
                        key={editingProduct ? editingProduct.id : 'new'}
                        initialProduct={editingProduct}
                        onSave={handleSave}
                        onCancel={() => setEditingProduct(null)}
                        saving={saving}
                    />
                </aside>
            </main>
        </div>
    );
}

export default ProductInventoryApp;
