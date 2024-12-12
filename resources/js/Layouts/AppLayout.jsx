import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ title, children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-blue-900 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-philosopher">SIPIKA</h1>
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/classrooms"
                            className="hover:text-blue-200"
                        >
                            Classrooms
                        </Link>
                        <Link
                            href="/bookings"
                            className="hover:text-blue-200"
                        >
                            Bookings
                        </Link>
                        <Link
                            href="/reports"
                            className="hover:text-blue-200"
                        >
                            Reports
                        </Link>
                        <div className="relative group">
                            <button className="flex items-center space-x-1">
                                <span>{auth.user.username}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto mt-6 px-4">
                {title && (
                    <h2 className="text-2xl font-bold mb-6">{title}</h2>
                )}
                {children}
            </main>
        </div>
    );
}
