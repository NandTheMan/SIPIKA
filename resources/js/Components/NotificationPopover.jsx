import React from 'react';
import { Link } from '@inertiajs/react';
import { Bell, Heart, XCircle, Pin } from 'lucide-react';

const NotificationPopover = ({ isOpen, onClose, pinnedClassroomData = [], onPin, onUnpin }) => {
    // Tidak perlu state notifications dan loading lagi karena data di-fetch di parent

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose} />

            <div className="absolute right-4 top-20 w-96 max-h-[80vh] bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Notifications</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
                    {pinnedClassroomData.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Pin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p>No pinned classrooms yet.</p>
                            <p className="text-sm mt-1">Pin your favorite classrooms to get quick availability updates.</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {pinnedClassroomData.map((notification) => (
                                <div key={notification.id} className="p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {notification.classroom_name}
                                            </h3>
                                            <p className={`text-sm ${
                                                notification.is_available
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}>
                                                {notification.is_available
                                                    ? 'Available'
                                                    : 'Currently in use'}
                                            </p>
                                            {notification.current_booking && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Until: {notification.current_booking.end_time}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onUnpin(notification.classroom_id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Heart className="w-5 h-5 fill-current" />
                                            </button>
                                            <Link
                                                href={`/book-room/details?roomId=${notification.classroom_id}`}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Book
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationPopover;