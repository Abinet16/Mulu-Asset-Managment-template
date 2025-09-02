import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';
const AssetInventory = () => {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [locationFilter, setLocationFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterAndSortAssets();
    }, [searchQuery, statusFilter, locationFilter, assets, sortConfig]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            // In a real app, you would fetch from your API
            const response = await fetch(`${API_BASE}/api/assets/assets`);
            if (!response.ok) throw new Error('Failed to fetch assets');
            
            const data = await response.json();
            setAssets(data);
            setFilteredAssets(data);
        } catch (error) {
            console.error('Error fetching assets:', error);
            toast.error('Failed to load assets');
        } finally {
            setIsLoading(false);
        }
    };

    const filterAndSortAssets = () => {
        let result = [...assets];
        
        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(asset => 
                asset.assetId.toLowerCase().includes(query) ||
                asset.assetName.toLowerCase().includes(query) ||
                asset.assetType.toLowerCase().includes(query) ||
                asset.model.toLowerCase().includes(query) ||
                asset.serialNumber.toLowerCase().includes(query) ||
                asset.location.toLowerCase().includes(query)
            );
        }
        
        // Apply status filter
        if (statusFilter !== 'All') {
            result = result.filter(asset => asset.status === statusFilter);
        }
        
        // Apply location filter
        if (locationFilter !== 'All') {
            result = result.filter(asset => asset.location === locationFilter);
        }
        
        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        
        setFilteredAssets(result);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDeleteAsset = async (assetId, assetName) => {
        if (window.confirm(`Are you sure you want to delete "${assetName}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(`${API_BASE}/api/assets/assets/${assetId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Failed to delete asset');
                
                setAssets(assets.filter(asset => asset.assetId !== assetId));
                toast.success('Asset deleted successfully');
            } catch (error) {
                console.error('Error deleting asset:', error);
                toast.error('Failed to delete asset');
            }
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Inactive': return 'bg-gray-100 text-gray-800';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
            case 'Retired': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const getUniqueLocations = () => {
        const locations = [...new Set(assets.map(asset => asset.location))];
        return locations.filter(location => location);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading asset inventory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="bg-blue-600 p-2 rounded-lg mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19极速2m6-2v2M5 9H3m2 6H3m18-6h-2极速2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Asset Inventory</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link 
                                to="/admin-dashboard" 
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Asset Inventory</h2>
                    <p className="text-gray-600">View and manage all assets in your organization</p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Assets</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 极速 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search by ID, name, type, model, serial number, or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="status-filter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Retired">Retired</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                                id="location-filter"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="All">All Locations</option>
                                {getUniqueLocations().map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Showing {filteredAssets.length} of {assets.length} assets
                        </p>
                        <Link
                            to="/add-newAsset"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add New Asset
                        </Link>
                    </div>
                </div>

                {/* Assets Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('assetId')}
                                    >
                                        <div className="flex items-center">
                                            ID
                                            {sortConfig.key === 'assetId' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortConfig.direction === 'ascending' ? '' : 'transform rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Asset Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Specifications
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Purchase Info
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status & Location
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAssets.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9极速6v6H9V9z" />
                                            </svg>
                                            <p className="mt-4 text-gray-500">No assets found matching your criteria</p>
                                            <Link
                                                to="/add-newAsset"
                                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Add Your First Asset
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAssets.map(asset => (
                                        <tr key={asset.assetId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{asset.assetId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{asset.assetName}</div>
                                                <div className="text-sm text-gray-500">{asset.assetType}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{asset.model}</div>
                                                <div className="text-sm text-gray-500">SN: {asset.serialNumber || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">{asset.warranty || 'No warranty'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(asset.status)}`}>
                                                    {asset.status || 'Unknown'}
                                                </span>
                                                <div className="text-sm text-gray-500 mt-1">{asset.location || 'Unassigned'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/edit-asset/${asset.assetId}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAsset(asset.assetId, asset.assetName)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/asset-details/${asset.assetId}`)}
                                                        className="text-gray-600 hover:text-gray-900"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetInventory;