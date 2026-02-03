import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Navbar from '../components/layout/Navbar';
import InventoryChart from '../components/charts/InventoryChart';
import inventoryService from '../services/inventoryService';
import { exportToCSV, exportToJSON, exportToHTML } from '../utils/exportUtils';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStock: 0,
        totalValue: 0,
        recentActivity: 0,
    });
    const [items, setItems] = useState([]); // Store items for export and chart
    const [loading, setLoading] = useState(true);
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setLoading(true);
                // Fetch all inventory items
                const response = await inventoryService.getAllItems();
                const fetchedItems = response.data?.data || response.data || [];

                // Calculate stats from inventory
                const totalItems = fetchedItems.length;
                const lowStock = fetchedItems.filter(item => item.quantity < 10).length;
                const totalValue = fetchedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                setItems(fetchedItems); // Store for chart and export
                setStats({
                    totalItems,
                    lowStock,
                    totalValue: Math.round(totalValue),
                    recentActivity: fetchedItems.length, // Could be enhanced with actual activity tracking
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
                // Set default stats on error
                setStats({
                    totalItems: 0,
                    lowStock: 0,
                    totalValue: 0,
                    recentActivity: 0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const handleExport = (format) => {
        if (items.length === 0) {
            toast.error('No data to export!');
            return;
        }

        try {
            const date = new Date().toISOString().split('T')[0];

            switch (format) {
                case 'csv':
                    exportToCSV(items, `inventory-${date}.csv`);
                    toast.success('Data exported to CSV successfully!');
                    break;
                case 'json':
                    exportToJSON(items, `inventory-${date}.json`);
                    toast.success('Data exported to JSON successfully!');
                    break;
                case 'html':
                    exportToHTML(items, stats);
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
                <LoadingSpinner fullscreen message="Loading dashboard..." />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <header className="dashboard-header">
                        <div>
                            <h1 className="dashboard-title">Dashboard</h1>
                            <p className="dashboard-subtitle">Welcome back, {user?.name || 'User'}!</p>
                        </div>
                        <Link to="/inventory/add" className="dashboard-action-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="16" />
                                <line x1="8" y1="12" x2="16" y2="12" />
                            </svg>
                            Add New Item
                        </Link>
                    </header>

                    <div className="stats-grid">
                        <Card hover className="stat-card">
                            <div className="stat-icon stat-icon-primary">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" />
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Items</p>
                                <h3 className="stat-value">{stats.totalItems}</h3>
                                <span className="stat-change stat-change-positive">
                                    +12% from last month
                                </span>
                            </div>
                        </Card>

                        <Card hover className="stat-card">
                            <div className="stat-icon stat-icon-warning">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Low Stock Alerts</p>
                                <h3 className="stat-value">{stats.lowStock}</h3>
                                <span className="stat-change stat-change-warning">
                                    Requires attention
                                </span>
                            </div>
                        </Card>

                        <Card hover className="stat-card">
                            <div className="stat-icon stat-icon-success">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="1" x2="12" y2="23" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Total Value</p>
                                <h3 className="stat-value">${stats.totalValue.toLocaleString()}</h3>
                                <span className="stat-change stat-change-positive">
                                    +8.2% from last month
                                </span>
                            </div>
                        </Card>

                        <Card hover className="stat-card">
                            <div className="stat-icon stat-icon-info">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                </svg>
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">Recent Activity</p>
                                <h3 className="stat-value">{stats.recentActivity}</h3>
                                <span className="stat-change stat-change-neutral">
                                    Updates this week
                                </span>
                            </div>
                        </Card>
                    </div>

                    <div className="dashboard-content">
                        <Card title="Quick Actions" className="quick-actions-card">
                            <div className="quick-actions">
                                <Link to="/inventory" className="quick-action">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="8" y1="6" x2="21" y2="6" />
                                        <line x1="8" y1="12" x2="21" y2="12" />
                                        <line x1="8" y1="18" x2="21" y2="18" />
                                        <line x1="3" y1="6" x2="3.01" y2="6" />
                                        <line x1="3" y1="12" x2="3.01" y2="12" />
                                        <line x1="3" y1="18" x2="3.01" y2="18" />
                                    </svg>
                                    <span>View All Inventory</span>
                                </Link>
                                <Link to="/inventory/add" className="quick-action">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="16" />
                                        <line x1="8" y1="12" x2="16" y2="12" />
                                    </svg>
                                    <span>Add New Item</span>
                                </Link>
                                <button
                                    className="quick-action"
                                    onClick={() => setExportMenuOpen(!exportMenuOpen)}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    <span>Export Data</span>
                                    {exportMenuOpen && (
                                        <div className="export-dropdown" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleExport('csv')}>Export as CSV</button>
                                            <button onClick={() => handleExport('json')}>Export as JSON</button>
                                            <button onClick={() => handleExport('html')}>Export as HTML</button>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </Card>

                        <Card title="Inventory Overview" className="overview-card">
                            <InventoryChart items={items} />
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
