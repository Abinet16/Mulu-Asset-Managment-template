import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_BASE=import.meta.env.REACT_APP_API_URL || "http://localhost:5001";

const AddAssetForm = () => {
    const { assetId } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        assetId: assetId || '',
        assetName: '',
        category: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        purchaseCost: '',
        vendor: '',
        scheduledDate: '',
        status: '',
        location: '',
        assignedTo: '',
        notes: ''
    });

    // Fetch categories and asset data if editing
    useEffect(() => {
        const fetchData = async () => {
            try {
                // In a real app, you would fetch categories from an API
                setCategories(['Laptop', 'Desktop', 'Monitor', 'Phone', 'Tablet', 'Server', 'Network Equipment', 'Printer']);
                
                if (assetId) {
                    setIsLoading(true);
                    // Fetch existing asset data
                    const response = await axios.get(`${API_BASE}/api/assets/assets/${assetId}`);
                    setFormData(response.data);
                }
            } catch (error) {
                toast.error('Failed to load data');
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [assetId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (assetId) {
                // Update existing asset
                await axios.put(`${API_BASE}/api/assets/assets/${assetId}`, formData);
                toast.success('Asset updated successfully!');
            } else {
                // Add new asset
                await axios.post(`${API_BASE}/api/assets/assets`, formData);
                toast.success('Asset added successfully!');
            }
            navigate('/technician-dashboard');
        } catch (error) {
            console.error('Error saving asset:', error);
            toast.error(error.response?.data?.message || 'Failed to save asset');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && assetId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 极速002-2V7a2 2 0 00-2-2极速7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {assetId ? 'Edit Asset' : 'Add New Asset'}
                        </h1>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/technician-dashboard')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Saving...' : 'Save Asset'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Asset Information</h2>
                        <p className="mt-1 text-sm text-gray-500">Enter the details of the IT asset.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
                                    Asset ID
                                </label>
                                <input
                                    type="text"
                                    id="assetId"
                                    name="assetId"
                                    value={formData.assetId}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                    readOnly={!!assetId}
                                    placeholder="e.g., AST-001"
                                />
                            </div>

                            <div>
                                <label htmlFor="assetName" className="block text-sm font-medium text-gray-700">
                                    Asset Name
                                </label>
                                <input
                                    type="text"
                                    id="assetName"
                                    name="assetName"
                                    value={formData.assetName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                    placeholder="e.g., Dell XPS 13"
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="block text-sm极速 font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                                    Model
                                </label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    value={formData.model}
                                    onChange极速={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g., XPS 13 9310"
                                />
                            </div>

                            <div>
                                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                                    Serial Number
                                </label>
                                <input
                                    type="text"
                                    id="serialNumber"
                                    name="serialNumber"
                                    value={formData.serialNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g., ABC123456789"
                                />
                            </div>

                            <div>
                                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700">
                                    Purchase Date
                                </label>
                                <input
                                    type="date"
                                    id="purchaseDate"
                                    name="purchaseDate"
                                    value={formData.purchaseDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="purchaseCost" className="block text-sm font-medium text-gray-700">
                                    Purchase Cost ($)
                                </label>
                                <input
                                    type="number"
                                    id="purchaseCost"
                                    name="purchaseCost"
                                    value={formData.purchaseCost}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
                                    Vendor
                                </label>
                                <input
                                    type="text"
                                    id="vendor"
                                    name="vendor"
                                    value={formData.vendor}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="e.g., Dell Inc."
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Status & Assignment</h3>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                                        Scheduled Date
                                    </label>
                                    <input
                                        type="date"
                                        id="scheduledDate"
                                        name="scheduledDate"
                                        value={formData.scheduledDate}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Retired">Retired</option>
                                        <option value="Lost/Stolen">Lost/Stolen</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="e.g., Building A, Floor 3"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
                                        Assigned To
                                    </label>
                                    <input
                                        type="text"
                                        id="assignedTo"
                                        name="assignedTo"
                                        value={formData.assignedTo}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Employee name or department"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                value={formData.notes}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Additional information about the asset"
                            />
                        </div>
                    </form>

                    <div className="px-6 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                            type="button"
                            onClick={() => navigate('/technician-dashboard')}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c极速 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Asset'
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AddAssetForm;