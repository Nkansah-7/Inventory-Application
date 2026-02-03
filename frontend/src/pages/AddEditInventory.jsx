import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../components/common/Toast';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Navbar from '../components/layout/Navbar';
import inventoryService from '../services/inventoryService';
import './AddEditInventory.css';

const AddEditInventory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const toast = useToast();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        quantity: '',
        price: '',
        description: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState(isEditMode);

    // Load item data if in edit mode
    useEffect(() => {
        const loadItem = async () => {
            if (isEditMode) {
                try {
                    setLoadingItem(true);
                    const response = await inventoryService.getItemById(id);

                    // Backend returns: { success: true, data: {...item} }
                    // The inventoryService returns response.data, which is { success: true, data: {...} }
                    // So the actual item is in response.data
                    let item;

                    if (response.data) {
                        item = response.data;
                    } else if (response.success && response.data) {
                        item = response.data;
                    } else {
                        item = response;
                    }

                    // Ensure item exists and has required properties
                    if (!item) {
                        throw new Error('Item not found - response was empty');
                    }

                    if (!item.name) {
                        throw new Error('Item data is invalid - missing required fields');
                    }

                    setFormData({
                        name: item.name || '',
                        sku: item.sku || '',
                        category: item.category || '',
                        quantity: item.quantity !== undefined ? item.quantity.toString() : '',
                        price: item.price !== undefined ? item.price.toString() : '',
                        description: item.description || '',
                    });
                } catch (error) {
                    console.error('Failed to load item:', error);
                    toast.error(`Failed to load item: ${error.message || error}`);
                    navigate('/inventory');
                } finally {
                    setLoadingItem(false);
                }
            }
        };

        loadItem();
    }, [isEditMode, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.sku.trim()) {
            newErrors.sku = 'SKU is required';
        }

        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        } else if (isNaN(formData.quantity) || Number(formData.quantity) < 0) {
            newErrors.quantity = 'Quantity must be a positive number';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            // Prepare data for API
            const itemData = {
                name: formData.name.trim(),
                sku: formData.sku.trim(),
                category: formData.category.trim(),
                quantity: parseInt(formData.quantity),
                price: parseFloat(formData.price),
                description: formData.description.trim(),
            };

            if (isEditMode) {
                // Update existing item
                await inventoryService.updateItem(id, itemData);
                toast.success('Item updated successfully!');
            } else {
                // Create new item
                await inventoryService.createItem(itemData);
                toast.success('Item added successfully!');
            }

            navigate('/inventory');
        } catch (error) {
            console.error('Submit failed:', error);
            toast.error(error || `Failed to ${isEditMode ? 'update' : 'add'} item`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/inventory');
    };

    if (loadingItem) {
        return (
            <>
                <Navbar />
                <div className="add-edit-page">
                    <div className="add-edit-container">
                        <div className="loading-placeholder">
                            <div className="spinner" style={{ width: '48px', height: '48px' }}>
                                <div className="spinner-ring"></div>
                                <div className="spinner-ring"></div>
                                <div className="spinner-ring"></div>
                            </div>
                            <p>Loading item...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="add-edit-page">
                <div className="add-edit-container">
                    <header className="add-edit-header">
                        <button className="back-button" onClick={() => navigate('/inventory')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Back to Inventory
                        </button>
                        <h1 className="add-edit-title">
                            {isEditMode ? 'Edit Item' : 'Add New Item'}
                        </h1>
                        <p className="add-edit-subtitle">
                            {isEditMode
                                ? 'Update the details of your inventory item'
                                : 'Fill in the details to add a new item to your inventory'}
                        </p>
                    </header>

                    <Card>
                        <form onSubmit={handleSubmit} className="add-edit-form">
                            <div className="form-section">
                                <h3 className="section-title">Basic Information</h3>
                                <div className="form-grid">
                                    <div className="form-col-full">
                                        <Input
                                            label="Product Name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g., Wireless Mouse"
                                            error={errors.name}
                                            required
                                            icon={
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                </svg>
                                            }
                                        />
                                    </div>

                                    <Input
                                        label="SKU (Stock Keeping Unit)"
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleChange}
                                        placeholder="e.g., TECH-001"
                                        error={errors.sku}
                                        required
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                                            </svg>
                                        }
                                    />

                                    <Input
                                        label="Category"
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g., Electronics"
                                        error={errors.category}
                                        required
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                            </svg>
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Inventory & Pricing</h3>
                                <div className="form-grid">
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        placeholder="0"
                                        error={errors.quantity}
                                        required
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="8.5" cy="7" r="4" />
                                                <polyline points="17 11 19 13 23 9" />
                                            </svg>
                                        }
                                    />

                                    <Input
                                        label="Price (USD)"
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        error={errors.price}
                                        required
                                        icon={
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="1" x2="12" y2="23" />
                                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                            </svg>
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="section-title">Additional Details</h3>
                                <div className="textarea-wrapper">
                                    <label htmlFor="description" className="textarea-label">
                                        Description <span className="optional-label">(Optional)</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Add any additional details about this product..."
                                        rows="4"
                                        className="textarea-field"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="lg"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" size="lg" loading={loading}>
                                    {loading
                                        ? (isEditMode ? 'Updating...' : 'Adding...')
                                        : (isEditMode ? 'Update Item' : 'Add Item')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default AddEditInventory;
