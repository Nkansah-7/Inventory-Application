import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../components/common/Toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner, { Skeleton } from '../components/common/LoadingSpinner';
import Navbar from '../components/layout/Navbar';
import inventoryService from '../services/inventoryService';
import { exportToCSV, exportToJSON, exportToHTML } from '../utils/exportUtils';
import './InventoryList.css';

const InventoryList = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [inventory, setInventory] = useState([]);
    const [filteredInventory, setFilteredInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);

    // Load inventory from backend
    useEffect(() => {
        const loadInventory = async () => {
            try {
                setLoading(true);
                const response = await inventoryService.getAllItems();

                // Backend returns { success: true, count: X, data: [...items] }
                // inventoryService returns response.data, so we get { success: true, data: [...] }
                const items = response.data?.data || response.data || [];

                setInventory(items);
                setFilteredInventory(items);
            } catch (error) {
                console.error('Failed to load inventory:', error);
                toast.error('Failed to load inventory items');
                setInventory([]);
                setFilteredInventory([]);
            } finally {
                setLoading(false);
            }
        };

        loadInventory();
    }, []);

    // Filter and search
    useEffect(() => {
        let filtered = [...inventory];

        // Search
        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (filterCategory !== 'all') {
            filtered = filtered.filter(item => item.category === filterCategory);
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];

            if (typeof aVal === 'string') {
                return sortOrder === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            } else {
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            }
        });

        setFilteredInventory(filtered);
    }, [inventory, searchQuery, filterCategory, sortBy, sortOrder]);

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const handleDelete = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            // Call backend API to delete
            await inventoryService.deleteItem(itemToDelete._id || itemToDelete.id);

            // Remove from local state
            const deletedId = itemToDelete.id || itemToDelete._id;
            setInventory(inventory.filter(item => (item.id || item._id) !== deletedId));

            toast.success(`${itemToDelete.name} deleted successfully`);
            setDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete item');
            setDeleteModalOpen(false);
        }
    };

    const getCategories = () => {
        const categories = [...new Set(inventory.map(item => item.category))];
        return categories;
    };

    const getStockBadge = (item) => {
        if (item.quantity === 0) {
            return <span className="stock-badge stock-out">Out of Stock</span>;
        } else if (item.quantity < 10) {
            return <span className="stock-badge stock-low">Low Stock</span>;
        } else {
            return <span className="stock-badge stock-good">In Stock</span>;
        }
    };

    const handleExport = (format) => {
        if (filteredInventory.length === 0) {
            toast.error('No data to export!');
            return;
        }

        try {
            const date = new Date().toISOString().split('T')[0];

            switch (format) {
                case 'csv':
                    exportToCSV(filteredInventory, `inventory-${date}.csv`);
                    toast.success('Data exported to CSV successfully!');
                    break;
                case 'json':
                    exportToJSON(filteredInventory, `inventory-${date}.json`);
                    toast.success('Data exported to JSON successfully!');
                    break;
                case 'html':
                    const stats = {
                        totalItems: filteredInventory.length,
                        lowStock: filteredInventory.filter(i => i.quantity < 10).length,
                        totalValue: filteredInventory.reduce((sum, i) => sum + (i.price * i.quantity), 0)
                    };
                    exportToHTML(filteredInventory, stats);
                    toast.success('Report exported to HTML successfully!');
                    break;
                default:
                    toast.error('Invalid export format');
            }

            setExportMenuOpen(false);
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export data');
        }
    };


    if (loading) {
        return (
            <>
                <Navbar />
                <div className="inventory-page">
                    <div className="inventory-container">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} height="80px" className="mb-4" />
                        ))}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="inventory-page">
                <div className="inventory-container">
                    <header className="inventory-header">
                        <div>
                            <h1 className="inventory-title">Inventory</h1>
                            <p className="inventory-subtitle">{filteredInventory.length} items total</p>
                        </div>
                        <div className="inventory-header-actions">
                            <div className="export-button-wrapper">
                                <Button
                                    variant="ghost"
                                    size="md"
                                    onClick={() => setExportMenuOpen(!exportMenuOpen)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Export
                                </Button>
                                {exportMenuOpen && (
                                    <div className="export-dropdown-inventory" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => handleExport('csv')}>Export as CSV</button>
                                        <button onClick={() => handleExport('json')}>Export as JSON</button>
                                        <button onClick={() => handleExport('html')}>Export as HTML</button>
                                    </div>
                                )}
                            </div>
                            <Link to="/inventory/add">
                                <Button variant="primary" size="md">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                    Add Item
                                </Button>
                            </Link>
                        </div>
                    </header>

                    <Card className="filters-card">
                        <div className="filters">
                            <div className="search-wrapper">
                                <Input
                                    type="text"
                                    placeholder="Search by name, SKU, or category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    icon={
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.35-4.35" />
                                        </svg>
                                    }
                                />
                            </div>

                            <div className="filter-select-wrapper">
                                <label htmlFor="category-filter">Category</label>
                                <select
                                    id="category-filter"
                                    className="filter-select"
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {getCategories().map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Card>

                    {filteredInventory.length === 0 ? (
                        <Card className="empty-state">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                                <line x1="9" y1="9" x2="9.01" y2="9" />
                                <line x1="15" y1="9" x2="15.01" y2="9" />
                            </svg>
                            <h3>No items found</h3>
                            <p>Try adjusting your search or filters</p>
                        </Card>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="inventory-table-wrapper">
                                <table className="inventory-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort('name')} className="sortable">
                                                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th onClick={() => handleSort('sku')} className="sortable">
                                                SKU {sortBy === 'sku' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th onClick={() => handleSort('category')} className="sortable">
                                                Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th onClick={() => handleSort('quantity')} className="sortable text-center">
                                                Quantity {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th onClick={() => handleSort('price')} className="sortable text-right">
                                                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                                            </th>
                                            <th className="text-center">Status</th>
                                            <th className="text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInventory.map(item => (
                                            <tr key={item.id || item._id}>
                                                <td className="item-name">{item.name}</td>
                                                <td className="item-sku">{item.sku}</td>
                                                <td>
                                                    <span className="category-badge">{item.category}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`quantity ${item.quantity < 10 ? 'low' : ''}`}>
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className="text-right item-price">${item.price.toFixed(2)}</td>
                                                <td className="text-center">{getStockBadge(item)}</td>
                                                <td className="actions-cell">
                                                    <div className="action-buttons">
                                                        <button
                                                            className="action-btn action-btn-edit"
                                                            onClick={() => navigate(`/inventory/edit/${item.id || item._id}`)}
                                                            title="Edit"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="action-btn action-btn-delete"
                                                            onClick={() => handleDelete(item)}
                                                            title="Delete"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="inventory-cards">
                                {filteredInventory.map(item => (
                                    <Card key={item.id || item._id} className="inventory-card" hover>
                                        <div className="card-header-row">
                                            <div>
                                                <h3 className="card-item-name">{item.name}</h3>
                                                <p className="card-item-sku">{item.sku}</p>
                                            </div>
                                            {getStockBadge(item)}
                                        </div>

                                        <div className="card-details">
                                            <div className="card-detail">
                                                <span className="detail-label">Category</span>
                                                <span className="category-badge">{item.category}</span>
                                            </div>
                                            <div className="card-detail">
                                                <span className="detail-label">Quantity</span>
                                                <span className={`quantity ${item.quantity < 10 ? 'low' : ''}`}>
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="card-detail">
                                                <span className="detail-label">Price</span>
                                                <span className="item-price">${item.price.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <div className="card-actions">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/inventory/edit/${item.id || item._id}`)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(item)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {deleteModalOpen && (
                    <div className="modal-overlay" onClick={() => setDeleteModalOpen(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3 className="modal-title">Confirm Delete</h3>
                            <p className="modal-message">
                                Are you sure you want to delete <strong>{itemToDelete?.name}</strong>?
                                This action cannot be undone.
                            </p>
                            <div className="modal-actions">
                                <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={confirmDelete}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default InventoryList;
