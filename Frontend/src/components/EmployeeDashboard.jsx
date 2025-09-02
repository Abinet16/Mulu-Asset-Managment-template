import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [employee, setEmployee] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('assets');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(`${API_BASE}/api/employees/getEmployees`, {
                    credentials: 'include' // Important for cookie-based auth
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                console.log(data, "employee data");
                setEmployee(data);
                fetchAssignedAssets(data.userId);  // Fetch assigned assets after setting employee state
            } catch (error) {
                setError('Failed to fetch employee details');
                console.error('Error fetching employee details:', error);
            }
            finally {
                setIsLoading(false);
            }

        };

        const fetchAssignedAssets = async (userId) => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE}/api/assignments/employee/${userId}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                console.log(data, "assigned assets");
                setAssignedAssets(Array.isArray(data) ? data : []);
            } catch (error) {
                setError('Failed to fetch assigned assets');
                console.error('Error fetching assigned assets:', error);
                toast.error('Failed to load dashboard data');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchEmployeeDetails();
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('employeeId');
        toast.info('Logged out successfully');
        navigate('/login');
    };

    const handleRequestAsset = () => {
        navigate('/request-asset');
    };

    const handleReportIssue = (assetId) => {
        navigate(`/report-issue/${assetId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800">Employee Portal</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleRequestAsset}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Request Asset
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Welcome Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8 text-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                    Welcome back, {employee.username || 'Valued Employee'}!
                                </h2>
                                <p className="text-blue-100">
                                    Here's your assigned equipment and resources.
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 bg-white bg-opacity-20 p-3 rounded-lg">
                                <p className="text-sm">Employee ID: <span className="font-semibold">{employee.employeeId || 'EMP-001'}</span></p>
                                <p className="text-sm">Department: <span className="font-semibold">{employee.department || 'IT'}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-lg shadow-sm mb-6">
                            <nav className="flex space-x-8 px-6">
                                <button
                                    onClick={() => setActiveTab('assets')}
                                    className={`py-4 px-1 text-sm font-medium border-b-2 ${activeTab === 'assets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    My Assets
                                </button>
                                <button
                                    onClick={() => setActiveTab('requests')}
                                    className={`py-4 px-1 text-sm font-medium border-b-2 ${activeTab === 'requests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    My Requests
                                </button>
                                <button
                                    onClick={() => setActiveTab('issues')}
                                    className={`py-4 px-1 text-sm font-medium border-b-2 ${activeTab === 'issues' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                                >
                                    Reported Issues
                                </button>
                            </nav>
                        </div>

                        {/* Assets Tab Content */}
                        {activeTab === 'assets' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800">Assigned Assets</h3>
                                    <p className="mt-1 text-sm text-gray-500">Equipment and resources assigned to you</p>
                                </div>
                                <div className="overflow-x-auto">
                                    {assignedAssets.length === 0 ? (
                                        <div className="text-center py-12">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2极速6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                            </svg>
                                            <p className="mt-4 text-gray-500">No assets assigned to you yet.</p>
                                            <button
                                                onClick={handleRequestAsset}
                                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                Request an Asset
                                            </button>
                                        </div>
                                    ) : (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium极速 text-gray-500 uppercase tracking-wider">Assigned Date</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {assignedAssets.map(asset => (
                                                    <tr key={asset.assetId} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2极速10a2 2 0 002 2zM极速 9h6v6H9V9z" />
                                                                    </svg>
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">{asset.assetName || `Asset ${asset.assetId}`}</div>
                                                                    <div className="text-sm text-gray-500">ID: {asset.assetId}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.category || 'Not specified'}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(asset.assignmentDate).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asset.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {asset.status || 'Active'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() => handleReportIssue(asset.assetId)}
                                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                            >
                                                                Report Issue
                                                            </button>
                                                            <button className="text-gray-600 hover:text-gray-900">
                                                                View Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Other tabs would be implemented similarly */}
                        {activeTab === 'requests' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800">My Requests</h3>
                                    <p className="mt-1 text-sm text-gray-500">Your asset requests and their status</p>
                                </div>
                                <div className="text-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="mt-4 text-gray-500">No requests found.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'issues' && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-800">Reported Issues</h3>
                                    <p className="mt-1 text-sm text-gray-500">Issues you have reported for your assets</p>
                                </div>
                                <div className="text-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="mt-4 text-gray-500">No issues reported yet.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Assigned Assets</p>
                                    <p className="text-2xl font-bold text-blue-600">{assignedAssets.length}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Active Assets</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {assignedAssets.filter(a => a.status === 'Active').length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Pending Requests</p>
                                    <p className="text-2xl font-bold text-yellow-600">0</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={handleRequestAsset}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Request New Asset
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Download Asset List
                                </button>
                                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    View IT Policies
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;