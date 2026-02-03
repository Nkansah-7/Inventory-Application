import React, { useState } from 'react';
import './InventoryChart.css';

/**
 * InventoryChart Component
 * Displays inventory data visualization using pure CSS/SVG (no external library needed!)
 */
const InventoryChart = ({ items = [] }) => {
    const [chartType, setChartType] = useState('category'); // 'category' or 'value'

    if (!items || items.length === 0) {
        return (
            <div className="chart-empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <p>No inventory data to visualize</p>
                <span>Add items to see charts and insights</span>
            </div>
        );
    }

    // Calculate category distribution
    const categoryData = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = {
                count: 0,
                value: 0,
                quantity: 0
            };
        }
        acc[item.category].count += 1;
        acc[item.category].value += item.price * item.quantity;
        acc[item.category].quantity += item.quantity;
        return acc;
    }, {});

    const categories = Object.keys(categoryData);
    const maxCount = Math.max(...categories.map(cat => categoryData[cat].count));
    const maxValue = Math.max(...categories.map(cat => categoryData[cat].value));

    // Color palette
    const colors = [
        '#6366f1', // Indigo
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#f59e0b', // Amber
        '#10b981', // Emerald
        '#3b82f6', // Blue
        '#f97316', // Orange
        '#14b8a6', // Teal
    ];

    const getChartData = () => {
        if (chartType === 'category') {
            return categories.map((cat, idx) => ({
                label: cat,
                value: categoryData[cat].count,
                percentage: ((categoryData[cat].count / items.length) * 100).toFixed(1),
                color: colors[idx % colors.length],
                height: (categoryData[cat].count / maxCount) * 100
            }));
        } else {
            return categories.map((cat, idx) => ({
                label: cat,
                value: categoryData[cat].value,
                percentage: ((categoryData[cat].value / maxValue) * 100).toFixed(1),
                color: colors[idx % colors.length],
                height: (categoryData[cat].value / maxValue) * 100
            }));
        }
    };

    const chartData = getChartData();

    return (
        <div className="inventory-chart">
            <div className="chart-header">
                <h3 className="chart-title">
                    {chartType === 'category' ? 'Items by Category' : 'Value by Category'}
                </h3>
                <div className="chart-toggle">
                    <button
                        className={`toggle-btn ${chartType === 'category' ? 'active' : ''}`}
                        onClick={() => setChartType('category')}
                    >
                        Count
                    </button>
                    <button
                        className={`toggle-btn ${chartType === 'value' ? 'active' : ''}`}
                        onClick={() => setChartType('value')}
                    >
                        Value
                    </button>
                </div>
            </div>

            <div className="chart-container">
                <div className="bar-chart">
                    {chartData.map((data, idx) => (
                        <div key={idx} className="bar-wrapper">
                            <div className="bar-column">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${data.height}%`,
                                        background: `linear-gradient(180deg, ${data.color} 0%, ${data.color}dd 100%)`,
                                        boxShadow: `0 4px 12px ${data.color}33`
                                    }}
                                    title={`${data.label}: ${chartType === 'value' ? `$${data.value.toFixed(2)}` : data.value} (${data.percentage}%)`}
                                >
                                    <span className="bar-value">
                                        {chartType === 'value' ? `$${data.value.toFixed(0)}` : data.value}
                                    </span>
                                </div>
                            </div>
                            <div className="bar-label">{data.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chart-legend">
                {chartData.map((data, idx) => (
                    <div key={idx} className="legend-item">
                        <span
                            className="legend-color"
                            style={{ background: data.color }}
                        />
                        <span className="legend-label">{data.label}</span>
                        <span className="legend-value">
                            {chartType === 'value'
                                ? `$${data.value.toLocaleString()}`
                                : `${data.value} items`
                            } ({data.percentage}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryChart;
