import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterAndSortUsers();
    }, [searchQuery, roleFilter, statusFilter, users, sortConfig]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/api/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            
            const data = await response.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const filterAndSortUsers = () => {
        let result = [...users];
        
        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(user => 
                user.userId.toLowerCase().includes(query) ||
                user.username.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query) ||
                (user.department && user.department.toLowerCase().includes(query)) ||
                (user.position && user.position.toLowerCase().includes(query))
            );
        }
        
        // Apply role filter
        if (roleFilter !== 'All') {
            result = result.filter(user => user.role === roleFilter);
        }
        
        // Apply status filter
        if (statusFilter !== 'All') {
            result = result.filter(user => user.status === statusFilter);
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
        
        setFilteredUsers(result);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDeleteUser = async (userId, username) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
            try {
                const response = await fetch(`${API_BASE}/api/users/users/${userId}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) throw new Error('Failed to delete user');
                
                setUsers(users.filter(user => user.userId !== userId));
                toast.success('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800';
            case 'manager': return 'bg-blue-100 text-blue-800';
            case 'technician': return 'bg-yellow-100 text-yellow-800';
            case 'employee': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getUniqueRoles = () => {
        const roles = [...new Set(users.map(user => user.role))];
        return roles.filter(role => role);
    };

    const getUniqueStatuses = () => {
        const statuses = [...new Set(users.map(user => user.status))];
        return statuses.filter(status => status);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate极速 rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m极速 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-极速 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage Users</h2>
                    <p className="text-gray-600">View and manage all users in your organization</p>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Search by ID, name, email, department, or position..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="role-filter" className="block text-sm font-medium极速 text-gray-700 mb-1">Role</label>
                            <select
                                id="role-filter"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="All">All Roles</option>
                                {getUniqueRoles().map(role => (
                                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                ))}
                            </select>
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
                                {getUniqueStatuses().map(status => (
                                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Showing {filteredUsers.length} of {users.length} users
                        </p>
                        <Link
                            to="/create-user"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m极速 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create New User
                        </Link>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        scope="col" 
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('userId')}
                                    >
                                        <div className="flex items-center">
                                            User ID
                                            {sortConfig.key === 'userId' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 ${sortConfig.direction === 'ascending' ? '' : 'transform rotate-180'}`} fill="none" viewBox="极速 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 极速 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Details
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact Information
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role & Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="mt-4 text-gray-500">No users found matching your criteria</p>
                                            <Link
                                                to="/create-user"
                                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Create Your First User
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={user.userId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.userId}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                                <div className="text-sm text-gray-500">
                                                    {user.department && user.position 
                                                        ? `${user.department} • ${user.position}`
                                                        : user.department || user.position || 'No department assigned'
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                                <div className="text-sm text-gray-500">{user.phone || 'No phone number'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-2">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'No role'}
                                                    </span>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                                                        {user.status?.charAt(0).toUpperCase() + user.status?.slice(1) || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/edit-user/${user.userId}`)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.userId, user.username)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/user-details/${user.userId}`)}
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

export default UserManagement;