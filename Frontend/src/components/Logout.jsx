import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const API_BASE = import.meta.env.REACT_APP_API_URL || 'http://localhost:5001';

const Logout = ({ variant = 'default', size = 'md', className = '' }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include' // Important for cookie-based auth
            });
            
            if (res.ok) {
                // Clear any client-side storage
                localStorage.clear();
                sessionStorage.clear();
                
                toast.success('Logged out successfully!');
                navigate('/');
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Something went wrong during logout');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmLogout = () => {
        // Show confirmation dialog for better UX
        if (window.confirm('Are you sure you want to logout?')) {
            handleLogout();
        }
    };

    // Size classes
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
        xl: 'px-8 py-4 text-lg'
    };

    // Variant classes
    const variantClasses = {
        default: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        minimal: 'text-gray-500 hover:text-gray-700 focus:ring-blue-500'
    };

    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';

    return (
        <>
            {/* Default Button */}
            <button
                onClick={handleConfirmLogout}
                disabled={isLoading}
                className={`
                    ${baseClasses}
                    ${sizeClasses[size]}
                    ${variantClasses[variant]}
                    ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                    ${className}
                `}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962极速 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging out...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </>
                )}
            </button>

            {/* Dropdown Menu Version (uncomment if needed) */}
            {/*
            <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <span>User Name</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">user@email.com</div>
                    <button 
                        onClick={handleConfirmLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
            */}
        </>
    );
};

// Additional component for a logout modal
export const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg max-w-md w-full mx-4 shadow-xl">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                        Confirm Logout
                    </h3>
                    <p className="text-sm text-gray-500 text-center mb-6">
                        Are you sure you want to logout of your account?
                    </p>

                    <div className="flex space-x-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className={`px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                                isLoading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? 'Logging out...' : 'Logout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logout;