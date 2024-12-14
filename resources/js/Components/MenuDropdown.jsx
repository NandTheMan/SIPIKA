import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { User, Calendar, FileText, LogOut, Menu } from 'lucide-react';

const MenuDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { label: 'Profile', icon: User, href: '/profile/edit' },
        { label: 'My Bookings', icon: Calendar, href: '/bookings' },
        { label: 'My Reports', icon: FileText, href: '/reports' },
    ];

    const handleLogout = () => {
        // Submit a POST request to /logout
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';

        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-gray-200 transition-colors p-1"
            >
                <Menu className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.label}
                        </Link>
                    ))}

                    <hr className="my-1" />

                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default MenuDropdown;
