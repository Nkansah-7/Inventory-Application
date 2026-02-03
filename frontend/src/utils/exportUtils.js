/**
 * Export Utility Functions
 * Handles export of inventory data to various formats
 */

/**
 * Export inventory data to CSV format
 * @param {Array} items - Array of inventory items
 * @param {string} filename - Name of the file to download
 */
export const exportToCSV = (items, filename = 'inventory-export.csv') => {
    if (!items || items.length === 0) {
        alert('No data to export!');
        return;
    }

    // Define CSV headers
    const headers = ['Name', 'SKU', 'Category', 'Quantity', 'Price', 'Total Value', 'Description', 'Created At'];

    // Convert items to CSV rows
    const csvRows = [
        headers.join(','), // Header row
        ...items.map(item => {
            const totalValue = (item.price * item.quantity).toFixed(2);
            const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A';

            return [
                `"${item.name || ''}"`,
                `"${item.sku || ''}"`,
                `"${item.category || ''}"`,
                item.quantity || 0,
                item.price || 0,
                totalValue,
                `"${(item.description || '').replace(/"/g, '""')}"`, // Escape quotes
                createdAt
            ].join(',');
        })
    ];

    // Create CSV content
    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, filename);
};

/**
 * Export inventory data to JSON format
 * @param {Array} items - Array of inventory items
 * @param {string} filename - Name of the file to download
 */
export const exportToJSON = (items, filename = 'inventory-export.json') => {
    if (!items || items.length === 0) {
        alert('No data to export!');
        return;
    }

    // Clean data for export (remove unnecessary fields)
    const exportData = items.map(item => ({
        name: item.name,
        sku: item.sku,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        totalValue: (item.price * item.quantity).toFixed(2),
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
    }));

    // Create JSON content with pretty printing
    const jsonContent = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadFile(blob, filename);
};

/**
 * Export inventory summary as PDF-ready HTML
 * @param {Array} items - Array of inventory items
 * @param {Object} stats - Dashboard statistics
 */
export const exportToHTML = (items, stats) => {
    if (!items || items.length === 0) {
        alert('No data to export!');
        return;
    }

    const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const currentDate = new Date().toLocaleDateString();

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Report - ${currentDate}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #7f8c8d;
            margin-bottom: 30px;
            font-size: 14px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #34495e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
        }
        @media print {
            body { padding: 0; background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📦 Inventory Report</h1>
        <p class="subtitle">Generated on ${currentDate}</p>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Items</div>
                <div class="stat-value">${items.length}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Low Stock Items</div>
                <div class="stat-value">${items.filter(i => i.quantity < 10).length}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Total Inventory Value</div>
                <div class="stat-value">$${totalValue.toLocaleString()}</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Value</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.sku}</td>
                        <td>${item.category}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="footer">
            <p>This report contains ${items.length} items with a total value of $${totalValue.toLocaleString()}</p>
            <p>© ${new Date().getFullYear()} Inventory Management System</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    downloadFile(blob, `inventory-report-${currentDate}.html`);
};

/**
 * Helper function to download a file
 * @param {Blob} blob - File blob
 * @param {string} filename - Name of the file
 */
const downloadFile = (blob, filename) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export default {
    exportToCSV,
    exportToJSON,
    exportToHTML
};
