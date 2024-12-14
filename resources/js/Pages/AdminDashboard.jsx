import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBell,
    faSignOutAlt,
    faUsers,
    faClipboardList,
    faSearch,
    faFilter,
    faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import {
    Check,
    X,
    AlertTriangle,
    UserCog,
    BookX,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import MenuDropdown from '@/Components/MenuDropdown';

const TabButton = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 text-sm font-medium rounded-lg transition-colors ${
            active
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
    >
        {children}
    </button>
);

const StatusBadge = ({ status, type = 'report' }) => {
    let config;

    if (type === 'report') {
        config = status ? {
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle,
            text: 'Resolved'
        } : {
            color: 'bg-yellow-100 text-yellow-800',
            icon: Clock,
            text: 'Pending'
        };
    } else { // user status
        config = status ? {
            color: 'bg-red-100 text-red-800',
            icon: BookX,
            text: 'Penalized'
        } : {
            color: 'bg-green-100 text-green-800',
            icon: Check,
            text: 'Active'
        };
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color}`}>
            <config.icon size={14} />
            {config.text}
        </span>
    );
};

const AdminDashboard = ({ auth, users = [], reports = [] }) => {
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [reportFilter, setReportFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filterItems = (items, type) => {
        // First apply search filter
        let filtered = items.filter(item => {
            if (type === 'users') {
                return item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.major.toLowerCase().includes(searchTerm.toLowerCase());
            } else {
                return item.reportedUser.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase());
            }
        });

        // Then apply status filter
        if (type === 'users' && userFilter !== 'all') {
            filtered = filtered.filter(user =>
                userFilter === 'penalized' ? user.is_penalized : !user.is_penalized
            );
        } else if (type === 'reports' && reportFilter !== 'all') {
            filtered = filtered.filter(report =>
                reportFilter === 'resolved' ? report.status : !report.status
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handlePenalize = async (userId) => {
        try {
            await router.put(`/admin/users/${userId}/penalize`);
            // The page will automatically refresh due to Inertia
        } catch (error) {
            console.error('Error penalizing user:', error);
        }
    };

    const handleResolveReport = async (reportId) => {
        try {
            await router.put(`/admin/reports/${reportId}/resolve`);
            // The page will automatically refresh due to Inertia
        } catch (error) {
            console.error('Error resolving report:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Admin Dashboard" />

            {/* Header */}
            <header className='w-full bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-6 flex justify-between items-center'>
                <div>
                    <Link href="/">
                        <img src="/images/logo.png" alt="logo-sipika" width={146} />
                    </Link>
                </div>
                <div className='flex items-center gap-6'>
                    <div className='text-white font-sfproreg'>
                        {auth.user.username} ({auth.user.major})
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                    </button>
                    <MenuDropdown />
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <TabButton
                            active={activeTab === 'users'}
                            onClick={() => setActiveTab('users')}
                        >
                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                            Users
                        </TabButton>
                        <TabButton
                            active={activeTab === 'reports'}
                            onClick={() => setActiveTab('reports')}
                        >
                            <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                            Reports
                        </TabButton>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
                            <select
                                value={activeTab === 'users' ? userFilter : reportFilter}
                                onChange={(e) => activeTab === 'users'
                                    ? setUserFilter(e.target.value)
                                    : setReportFilter(e.target.value)
                                }
                                className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All</option>
                                {activeTab === 'users' ? (
                                    <>
                                        <option value="active">Active</option>
                                        <option value="penalized">Penalized</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="pending">Pending</option>
                                        <option value="resolved">Resolved</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {activeTab === 'users' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Username
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Major
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {filterItems(users, 'users').map((user) => (
                                    <tr key={user.user_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user.major}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={user.is_penalized} type="user" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handlePenalize(user.user_id)}
                                                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                                    user.is_penalized
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                {user.is_penalized ? (
                                                    <>
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Remove Penalty
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                                        Penalize
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reporter
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reported User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Classroom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {filterItems(reports, 'reports').map((report) => (
                                    <tr key={report.report_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.reporterUser.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.reportedUser.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.classroom.classroom_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {report.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={report.status} type="report" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/reports/${report.report_id}`}
                                                    className="inline-flex items-center px-3 py-1 rounded-md bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm font-medium"
                                                >
                                                    View Details
                                                </Link>
                                                {!report.status && (
                                                    <button
                                                        onClick={() => handleResolveReport(report.report_id)}
                                                        className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 text-green-800 hover:bg-green-200 text-sm font-medium"
                                                    >
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Resolve
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Empty States */}
                {activeTab === 'users' && filterItems(users, 'users').length === 0 && (
                    <div className="text-center py-12">
                        <UserCog className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Users Found</h3>
                        <p className="mt-2 text-gray-500">No users match your current filters.</p>
                    </div>
                )}

                {activeTab === 'reports' && filterItems(reports, 'reports').length === 0 && (
                    <div className="text-center py-12">
                        <AlertTriangle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Reports Found</h3>
                        <p className="mt-2 text-gray-500">No reports match your current filters.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
