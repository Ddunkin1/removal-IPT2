import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import ProductFilter from './ProductFilter';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

const API_BASE_URL = '/api/product';

function ProductInventoryApp() {
    const [products, setProducts] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [stockFilter] = useState('all');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

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
            setIsFormOpen(false);
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
            setIsFormOpen(false);
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

    const handleToolbarSearch = () => {
        setFilterText((current) => current.trim());
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingProduct(null);
        setIsFormOpen(false);
    };

    const filteredProducts = useMemo(() => {
        const term = filterText.trim().toLowerCase();

        return products.filter((product) => {
            if (!product || typeof product.name !== 'string') {
                return false;
            }

            const matchesName = term ? product.name.toLowerCase().includes(term) : true;

            const quantity =
                typeof product.quantity === 'number'
                    ? product.quantity
                    : product.quantity != null
                    ? Number(product.quantity)
                    : null;

            let matchesStock = true;

            if (stockFilter === 'in_stock') {
                matchesStock = quantity != null && quantity > 0;
            } else if (stockFilter === 'out_of_stock') {
                matchesStock = quantity != null && quantity === 0;
            }

            return matchesName && matchesStock;
        });
    }, [products, filterText, stockFilter]);

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

    const stats = useMemo(() => {
        let totalProducts = products.length;
        let totalValue = 0;
        let lowStock = 0;
        const categorySet = new Set();

        products.forEach((product) => {
            const price =
                typeof product.price === 'number'
                    ? product.price
                    : product.price != null
                    ? Number(product.price)
                    : 0;

            const quantity =
                typeof product.quantity === 'number'
                    ? product.quantity
                    : product.quantity != null
                    ? Number(product.quantity)
                    : 0;

            const category =
                product && typeof product.category === 'string'
                    ? product.category.trim()
                    : '';

            // Total value should match the Item Cost column, so sum price only
            totalValue += price;

            if (quantity > 0 && quantity <= 5) {
                lowStock += 1;
            }

            if (category) {
                categorySet.add(category);
            }
        });

        return {
            totalProducts,
            totalValue,
            lowStock,
            categories: categorySet.size,
        };
    }, [products]);

    const hasProducts = filteredProducts.length > 0;

    return (
        <div className="inventory-app">
            <header className="inventory-header">
                <div className="inventory-header-main">
                    <div className="inventory-header-icon">
                        <span className="inventory-header-icon-text">PI</span>
                    </div>
                    <div>
                        <h1 className="inventory-title">Product Inventory Manager</h1>
                        <p className="inventory-subtitle">Manage your product catalog</p>
                    </div>
                </div>
            </header>

            <section className="inventory-stats-row">
                <div className="inventory-stat-card">
                    <div className="inventory-stat-icon inventory-stat-icon--products" />
                    <div className="inventory-stat-content">
                        <div className="inventory-stat-value">{stats.totalProducts}</div>
                        <div className="inventory-stat-label">Total Products</div>
                    </div>
                </div>
                <div className="inventory-stat-card">
                    <div className="inventory-stat-icon inventory-stat-icon--value" />
                    <div className="inventory-stat-content">
                        <div className="inventory-stat-value">
                            {formatCurrency(stats.totalValue)}
                        </div>
                        <div className="inventory-stat-label">Total Value</div>
                    </div>
                </div>
                <div className="inventory-stat-card">
                    <div className="inventory-stat-icon inventory-stat-icon--low-stock" />
                    <div className="inventory-stat-content">
                        <div className="inventory-stat-value">{stats.lowStock}</div>
                        <div className="inventory-stat-label">Low Stock</div>
                    </div>
                </div>
                <div className="inventory-stat-card">
                    <div className="inventory-stat-icon inventory-stat-icon--categories" />
                    <div className="inventory-stat-content">
                        <div className="inventory-stat-value">{stats.categories}</div>
                        <div className="inventory-stat-label">Categories</div>
                    </div>
                </div>
            </section>

            <section className="inventory-toolbar-row">
                <div className="inventory-search-wrapper">
                    <ProductFilter
                        value={filterText}
                        onChange={setFilterText}
                        onSearch={handleToolbarSearch}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-add-main"
                    onClick={handleAddClick}
                >
                    + Add Product
                </button>
            </section>

            <section className="inventory-content-card">
                {loading && <div className="inventory-state">Loading products...</div>}

                {!loading && error && (
                    <div className="inventory-state inventory-state--error">{error}</div>
                )}

                {!loading && !error && hasProducts && (
                    <ProductList
                        products={filteredProducts}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                    />
                )}

                {!loading && !error && !hasProducts && (
                    <div className="inventory-empty">
                        <h2 className="inventory-empty-title">No products found</h2>
                        <p className="inventory-empty-subtitle">
                            Get started by adding your first product to the inventory.
                        </p>
                        <button
                            type="button"
                            className="btn btn-add-main"
                            onClick={handleAddClick}
                        >
                            + Add Product
                        </button>
                    </div>
                )}
            </section>

            {isFormOpen && (
                <div className="inventory-modal-backdrop">
                    <div className="inventory-modal">
                        <h2 className="inventory-modal-title">
                            {editingProduct ? 'Edit Product' : 'Add Product'}
                        </h2>
                        <ProductForm
                            key={editingProduct ? editingProduct.id : 'new'}
                            initialProduct={editingProduct}
                            onSave={handleSave}
                            onCancel={handleCloseForm}
                            saving={saving}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductInventoryApp;
