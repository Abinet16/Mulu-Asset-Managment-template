import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';

const AddNewAsset = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing] = useState(!!id);

    const [assetData, setAssetData] = useState({
        assetId: '',
        assetName: '',
        assetType: '',
        category: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        purchaseCost: '',
        warranty: '',
        warrantyExpiry: '',
        location: '',
        status: 'Active',
        assignedTo: '',
        supplier: '',
        notes: ''
    });

    const [errors, setErrors] = useState({});

    // Predefined options for dropdowns
    const assetTypes = ['Laptop', 'Desktop', 'Monitor', 'Phone', 'Tablet', 'Server', 'Network Equipment', 'Printer', 'Other'];
    const statusOptions = ['Active', 'Inactive', 'Maintenance', 'Retired', 'Lost/Stolen'];
    const locations = ['Head Office', 'Branch Office', 'Remote', 'Warehouse', 'In Transit'];

    useEffect(() => {
        if (id) {
            fetchAssetDetails();
        }
    }, [id]);

    const fetchAssetDetails = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/api/assets/assets/${id}`);
            if (!response.ok) throw new Error('Failed to fetch asset details');
            
            const data = await response.json();
            setAssetData({
                assetId: data.assetId || '',
                assetName: data.assetName || '',
                assetType: data.assetType || '',
                category: data.category || '',
                model: data.model || '',
                serialNumber: data.serialNumber || '',
                purchaseDate: data.purchaseDate || '',
                purchaseCost: data.purchaseCost || '',
                warranty: data.warranty || '',
                warrantyExpiry: data.warrantyExpiry || '',
                location: data.location || '',
                status: data.status || 'Active',
                assignedTo: data.assignedTo || '',
                supplier: data.supplier || '',
                notes: data.notes || ''
            });
        } catch (error) {
            console.error('Error fetching asset details:', error);
            toast.error('Failed to load asset details');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!assetData.assetId.trim()) newErrors.assetId = 'Asset ID is required';
        if (!assetData.assetName.trim()) newErrors.assetName = 'Asset name is required';
        if (!assetData.assetType) newErrors.assetType = 'Asset type is required';
        if (!assetData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
        if (!assetData.location) newErrors.location = 'Location is required';
        if (!assetData.status) newErrors.status = 'Status is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAssetData({
            ...assetData,
            [name]: value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const url = isEditing ? `${API_BASE}/api/assets/assets${id}` : `${API_BASE}/api/assets/assets`;
            const method = isEditing ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(assetData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'create'} asset`);
            }

            toast.success(isEditing ? 'Asset updated successfully!' : 'Asset created successfully!');
            navigate('/asset-inventory');
        } catch (error) {
            console.error('Error saving asset:', error);
            toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} asset. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/asset-inventory');
    };

    if (isLoading && isEditing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading asset data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16极速 h-16 bg-blue-100 rounded-2xl mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isEditing ? 'Edit Asset' : 'Add New Asset'}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing ? 'Update asset information' : 'Add a new asset to the inventory'}
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-800">Asset Information</h2>
                        <p className="mt-1 text-sm text-gray-500">Enter the asset details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
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
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.assetId ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    disabled={isEditing}
                                    required
                                />
                                {errors.assetId && <p className="mt-1 text-sm text-red-600">{errors.assetId}</p>}
                            </div>

                            {/* Asset Name */}
                            <div>
                                <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Asset Name *
                                </label>
                                <input
                                    type="text"
                                    id="assetName"
                                    name="assetName"
                                    placeholder="e.g., Dell XPS 13"
                                    value={assetData.assetName}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.assetName ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.assetName && <p className="mt-1 text-sm text-red-600">{errors.assetName}</p>}
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
                                    className={`mt-1 block w-full bg-white border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.assetType ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Select Asset Type</option>
                                    {assetTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.assetType && <p className="mt-1 text-sm text-red-600">{errors.assetType}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    id="category"
                                    name="category"
                                    placeholder="e.g., IT Equipment"
                                    value={assetData.category}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
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
                                    onChange极速={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Purchase Date */}
                            <div>
                                <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Purchase Date *
                                </label>
                                <input
                                    type="date"
                                    id="purchaseDate"
                                    name="purchaseDate"
                                    value={assetData.purchaseDate}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.purchaseDate ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.purchaseDate && <p className="mt-1 text极速 text-red-600">{errors.purchaseDate}</p>}
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
                                    id="warranty极速iry"
                                    name="warrantyExpiry"
                                    value={assetData.warrantyExpiry}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location *
                                </label>
                                <select
                                    id="location"
                                    name="location"
                                    value={assetData.location}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full bg-white border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.location ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Select Location</option>
                                    {locations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
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
                                    className={`mt-1 block w-full bg-white border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.status ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                            </div>

                            {/* Assigned To */}
                            <div>
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

                        {/* Notes */}
                        <div>
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
                        <div className="flex justify-end space-x-3 pt-6">
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
                                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="极速" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H极速c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    isEditing ? 'Update Asset' : 'Create Asset'
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