import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';

const AssignedAssets = () => {
    const navigate = useNavigate();
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [formData, setFormData] = useState({
        userId: '',
        assetId: '',
        assignmentDate: '',
        dueDate: '',
        notes: ''
    });
    const [users, setUsers] = useState([]);
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Fetch assigned assets
            const assignmentsResponse = await fetch(`${API_BASE}/api/assignments/assignments`);
            if (!assignmentsResponse.ok) throw new Error('Failed to fetch assignments');
            const assignmentsData = await assignmentsResponse.json();
            setAssignedAssets(assignmentsData);

            // Fetch users
            const usersResponse = await fetch(`${API_BASE}/api/admin/users`);
            if (!usersResponse.ok) throw new Error('Failed to fetch users');
            const usersData = await usersResponse.json();
            setUsers(usersData);

            // Fetch assets
            const assetsResponse = await fetch(`${API_BASE}/api/assets/assets`);
            if (!assetsResponse.ok) throw new Error('Failed to fetch assets');
            const assetsData = await assetsResponse.json();
            setAssets(assetsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                // Update existing assignment
                const response = await fetch(`${API_BASE}/api/assignments/${currentAssignment._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) throw new Error('Failed to update assignment');
                
                const updatedAssignment = await response.json();
                setAssignedAssets(prev => prev.map(a => 
                    a._id === currentAssignment._id ? updatedAssignment : a
                ));
                toast.success('Assignment updated successfully');
            } else {
                // Create new assignment
                const response = await fetch(`${API_BASE}/api/assignments/assignments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) throw new Error('Failed to create assignment');
                
                const newAssignment = await response.json();
                setAssignedAssets(prev => [...prev, newAssignment]);
                toast.success('Asset assigned successfully');
            }
            
            closeModal();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.message || 'Error submitting form');
        }
    };

    const handleEdit = (assignment) => {
        setCurrentAssignment(assignment);
        setFormData({
            userId: assignment.userId,
            assetId: assignment.assetId,
            assignmentDate: new Date(assignment.assignmentDate).toISOString().split('T')[0],
            dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '',
            notes: assignment.notes || ''
        });
        setEditMode(true);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                const response = await fetch(`${API_BASE}/api/assignments/${id}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Failed to delete assignment');
                
                setAssignedAssets(prev => prev.filter(assignment => assignment._id !== id));
                toast.success('Assignment deleted successfully');
            } catch (error) {
                console.error('Error deleting assignment:', error);
                toast.error('Failed to delete assignment');
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditMode(false);
        setCurrentAssignment(null);
        setFormData({
            userId: '',
            assetId: '',
            assignmentDate: '',
            dueDate: '',
            notes: ''
        });
    };

    const getUserName = (userId) => {
        const user = users.find(u => u.userId === userId);
        return user ? user.username : 'Unknown User';
    };

    const getAssetName = (assetId) => {
        const asset = assets.find(a => a.assetId === assetId);
        return asset ? asset.assetName : 'Unknown Asset';
    };

    const filteredAssets = assignedAssets.filter(assignment => {
        const matchesSearch = searchQuery === '' || 
            getUserName(assignment.userId).toLowerCase().includes(searchQuery.toLowerCase()) ||
            getAssetName(assignment.assetId).toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.assetId.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading assigned assets...</p>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Asset Assignments</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => navigate('/admin-dashboard')}
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Asset Assignments</h2>
                    <p className="text-gray-600">Track and manage all asset assignments in your organization</p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search assignments..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6极速0-6h6m-6 0H6" />
                            </svg>
                            Assign Asset
                        </button>
                    </div>
                </div>

                {/* Assignments Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Asset
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assignment Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Due Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <p className="mt-4 text-gray-500">No assignments found</p>
                                            <button
                                                onClick={() => setModalOpen(true)}
                                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Create Your First Assignment
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAssets.map(assignment => (
                                        <tr key={assignment._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {getUserName(assignment.userId)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {assignment.userId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {getAssetName(assignment.assetId)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {assignment.assetId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(assignment.assignmentDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(assignment)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(assignment._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
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

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editMode ? 'Edit Assignment' : 'Assign Asset'}
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
                            <div>
                                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                                    User
                                </label>
                                <select
                                    id="userId"
                                    value={formData.userId}
                                    onChange={(e) => setFormData({...formData, userId: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map(user => (
                                        <option key={user._id} value={user.userId}>
                                            {user.username} ({user.userId})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
                                    Asset
                                </label>
                                <select
                                    id="assetId"
                                    value={formData.assetId}
                                    onChange={(e) => setFormData({...formData, assetId: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                >
                                    <option value="">Select Asset</option>
                                    {assets.map(asset => (
                                        <option key={asset._id} value={asset.assetId}>
                                            {asset.assetName} ({asset.assetId})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="assignmentDate" className="block text-sm font-medium text-gray-700">
                                    Assignment Date
                                </label>
                                <input
                                    type="date"
                                    id="assignmentDate"
                                    value={formData.assignmentDate}
                                    onChange={(e) => setFormData({...formData, assignmentDate: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                                    Due Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    id="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Additional notes about this assignment"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {editMode ? 'Update Assignment' : 'Assign Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignedAssets;