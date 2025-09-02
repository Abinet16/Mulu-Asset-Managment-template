import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';

const EditUsers = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing] = useState(!!id);

    const [userData, setUserData] = useState({
        userId: '',
        username: '',
        email: '',
        role: 'employee',
        password: '',
        confirmPassword: '',
        department: '',
        position: '',
        phone: '',
        status: 'active'
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (id) {
            fetchUserData();
        }
    }, [id]);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE}/api/users/${id}`);
            if (!response.ok) throw new Error('Failed to fetch user data');
            
            const user = await response.json();
            setUserData({
                userId: user.userId || '',
                username: user.username || '',
                email: user.email || '',
                role: user.role || 'employee',
                password: '',
                confirmPassword: '',
                department: user.department || '',
                position: user.position || '',
                phone: user.phone || '',
                status: user.status || 'active'
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Failed to load user data');
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!userData.userId.trim()) newErrors.userId = 'User ID is required';
        if (!userData.username.trim()) newErrors.username = 'Username is required';
        if (!userData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(userData.email)) newErrors.email = 'Email is invalid';
        
        if (!isEditing || userData.password) {
            if (userData.password && userData.password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
            
            if (userData.password !== userData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData({
            ...userData,
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
            const url = isEditing ? `${API_BASE}/api/admin/users/${id}` :  `${API_BASE}/api/admin/users`;
            const method = isEditing ? 'PUT' : 'POST';
            
            // Prepare data for submission (don't send confirmPassword)
            const { confirmPassword, ...submitData } = userData;
            if (!submitData.password) delete submitData.password;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save user');
            }

            toast.success(isEditing ? 'User updated successfully!' : 'User created successfully!');
            navigate('/user-management');
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error(error.message || 'Failed to save user. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/user-management');
    };

    if (isLoading && isEditing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="极速 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7极速14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {isEditing ? 'Edit User' : 'Add New User'}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing ? 'Update user information' : 'Create a new user account'}
                    </p>
                </div>

                {/* Form Container */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h2 className="text-lg font-medium text极速-gray-800">User Information</h2>
                        <p className="mt-1 text-sm text-gray-500">Enter the user's details below</p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* User ID */}
                            <div>
                                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                                    User ID *
                                </label>
                                <input
                                    type="text"
                                    id="userId"
                                    name="userId"
                                    placeholder="e.g., EMP-001"
                                    value={userData.userId}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.userId ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    disabled={isEditing}
                                    required
                                />
                                {errors.userId && <p className="mt-1 text-sm text-red-600">{errors.userId}</p>}
                            </div>

                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="e.g., johndoe"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.username ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="e.g., john.doe@company.com"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                        errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Department */}
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    placeholder="e.g., IT Department"
                                    value={userData.department}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Position */}
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                                    Position
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    placeholder="e.g., Software Developer"
                                    value={userData.position}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="e.g., +1 (555) 123-4567"
                                    value={userData.phone}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Role *
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={userData.role}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                >
                                    <option value="employee">Employee</option>
                                    <option value="admin">Administrator</option>
                                    <option value="manager">Manager</option>
                                    <option value="technician">Technician</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={userData.status}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Password */}
                            <div className="sm:col-span-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {isEditing ? '(leave blank to keep current)' : '*'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder={isEditing ? "Enter new password" : "Enter password"}
                                        value={userData.password}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            errors.password ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                            </div>

                            {/* Confirm Password */}
                            {userData.password && (
                                <div className="sm:col-span-2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password *
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={userData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                                            errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                </div>
                            )}
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
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    isEditing ? 'Update User' : 'Create User'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUsers;