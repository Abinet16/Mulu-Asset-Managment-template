import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';

const AddNewAsset = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [assetData, setAssetData] = useState({
        assetId: '',
        assetName: '',
        assetType: '',
        category: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        warranty: '',
        warrantyExpiry: '',
        location: '',
        status: 'Active',
        assignedTo: '',
        purchaseCost: '',
        supplier: '',
        notes: ''
    });

    const assetTypes = ['Laptop', 'Desktop', 'Monitor', 'Phone', 'Tablet', 'Server', 'Network Equipment', 'Printer', 'Other'];
    const statusOptions = ['Active', 'Inactive', 'Maintenance', 'Retired', 'Lost/Stolen'];
    const locations = ['Head Office', 'Branch Office', 'Remote', 'Warehouse', 'In Transit'];

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAssetData({
            ...assetData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/assets/assets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assetData)
            });

            if (!response.ok) {
                throw new Error('Failed to add asset');
            }

            // Show success message
            toast.success('Asset added successfully!');
            
            // Redirect after a short delay
            setTimeout(() => {
                navigate('/asset-inventory');
            }, 1500);
        } catch (error) {
            console.error('Error adding asset:', error);
            toast.error('Failed to add asset. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/asset-inventory');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2极速2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6极速6H9V9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Asset</h1>
                    <p className="text-gray-600">Fill in the details below to add a new asset to the inventory</p>
                </div>

                {/* Form Container */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Asset Information</h2>
                        <p className="mt-1 text-sm text-gray-500">Enter the basic details of the asset</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Asset ID */}
                            <div>
                                <label htmlFor="assetId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Asset ID *
                                </label>
                                <input
                                    type="text"
                                    id="assetId"
                                    name="assetId"
                                    placeholder="e.g., AST-001"
                                    value={assetData.assetId}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>

                            {/* Asset Name */}
                            <div>
                                <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Asset Name *
                                </label>
                                <input
                                    type="text"
                                    id极速="assetName"
                                    name="assetName"
                                    placeholder="e.g., Dell XPS 13"
                                    value={assetData.assetName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>

                            {/* Asset Type */}
                            <div>
                                <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 mb-1">
                                    Asset Type *
                                </label>
                                <select
                                    id="assetType"
                                    name="assetType"
                                    value={assetData.assetType}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Select Asset Type</option>
                                    {assetTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Model */}
                            <div>
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                                    Model
                                </label>
                                <input
                                    type="text"
                                    id="model"
                                    name="model"
                                    placeholder="e.g., XPS 13 9310"
                                    value={assetData.model}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Serial Number */}
                            <div>
                                <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Serial Number
                                </label>
                                <input
                                    type="text"
                                    id="serialNumber"
                                    name="serialNumber"
                                    placeholder="e.g., ABC123456789"
                                    value={assetData.serialNumber}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Purchase Date */}
                            <div>
                                <label htmlFor="purchaseDate" className="block text-sm font-medium text极速-gray-700 mb-1">
                                    Purchase Date
                                </label>
                                <input
                                    type="date"
                                    id="purchaseDate"
                                    name="purchaseDate"
                                    value={assetData.purchaseDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Warranty */}
                            <div>
                                <label htmlFor="warranty" className="block text-sm font-medium text-gray-700 mb-1">
                                    Warranty Period
                                </label>
                                <input
                                    type="text"
                                    id="warranty"
                                    name="warranty"
                                    placeholder="e.g., 3 years"
                                    value={assetData.warranty}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Warranty Expiry */}
                            <div>
                                <label htmlFor="warrantyExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                                    Warranty Expiry Date
                                </label>
                                <input
                                    type="date"
                                    id="warrantyExpiry"
                                    name="warrantyExpiry"
                                    value={assetData.warrantyExpiry}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={assetData.status}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <select
                                    id="location"
                                    name="location"
                                    value={assetData.location}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Location</option>
                                    {locations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Purchase Cost */}
                            <div>
                                <label htmlFor="purchaseCost" className="block text-sm font-medium text-gray-700 mb-1">
                                    Purchase Cost ($)
                                </label>
                                <input
                                    type="number"
                                    id="purchaseCost"
                                    name="purchaseCost"
                                    placeholder="0.00"
                                    value={assetData.purchaseCost}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            {/* Supplier */}
                            <div>
                                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                                    Supplier/Vendor
                                </label>
                                <input
                                    type="text"
                                    id="supplier"
                                    name="supplier"
                                    placeholder="e.g., Dell Inc."
                                    value={assetData.supplier}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {/* Assigned To */}
                        <div className="mt-6">
                            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned To
                            </label>
                            <input
                                type="text"
                                id="assignedTo"
                                name="assignedTo"
                                placeholder="Employee name or department"
                                value={assetData.assignedTo}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Notes */}
                        <div className="mt-6">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                placeholder="Additional information about the asset"
                                value={assetData.notes}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        {/* Form Actions */}
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    'Save Asset'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddNewAsset;