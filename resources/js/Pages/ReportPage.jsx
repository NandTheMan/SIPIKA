import React, { useState, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt, faImage, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import MenuDropdown from '@/Components/MenuDropdown';

export default function ReportPage({ reports = [], auth, classrooms = [], flash = {} }) {
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        classroom_id: '',
        incident_date: new Date().toISOString().split('T')[0],
        incident_time: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        }),
        report_description: '',
        image: null
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/reports', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-lightGradient font-inter">
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
                    <FontAwesomeIcon
                        icon={faBell}
                        className="text-white cursor-pointer hover:text-gray-200"
                        onClick={() => setIsNotificationOpen(true)}
                    />
                    <MenuDropdown />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Head title="Submit Report" />

                <div className="max-w-4xl mx-auto">
                    {flash.success && (
                        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 rounded-lg text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg text-red-700">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Submit Report</h2>

                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Select Classroom
                                    </label>
                                    <select
                                        value={data.classroom_id}
                                        onChange={e => setData('classroom_id', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Choose a classroom...</option>
                                        {classrooms && classrooms.map((classroom) => (
                                            <option key={classroom.id} value={classroom.id}>
                                                {classroom.name} (Floor {classroom.floor})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.classroom_id && (
                                        <p className="text-red-500 text-xs mt-1">{errors.classroom_id}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Incident Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.incident_date}
                                        onChange={e => setData('incident_date', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {errors.incident_date && (
                                        <p className="text-red-500 text-xs mt-1">{errors.incident_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Incident Time
                                    </label>
                                    <input
                                        type="time"
                                        value={data.incident_time}
                                        onChange={e => setData('incident_time', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {errors.incident_time && (
                                        <p className="text-red-500 text-xs mt-1">{errors.incident_time}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.report_description}
                                    onChange={e => setData('report_description', e.target.value)}
                                    rows="4"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe the incident..."
                                />
                                {errors.report_description && (
                                    <p className="text-red-500 text-xs mt-1">{errors.report_description}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Evidence Photo
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                                        ${preview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
                                >
                                    {preview ? (
                                        <div className="space-y-4">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="mx-auto max-h-64 rounded-lg"
                                            />
                                            <p className="text-sm text-gray-600">Click to change image</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400"/>
                                            <p className="text-gray-600">Click to upload evidence photo</p>
                                            <p className="text-sm text-gray-500">
                                                (JPG, PNG, or GIF up to 2MB)
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </div>
                                {errors.image && (
                                    <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                                )}
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400"/>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-yellow-700">Important Notes:</p>
                                        <ul className="list-disc list-inside mt-2 text-yellow-600 text-sm space-y-1">
                                            <li>Please provide accurate date and time information</li>
                                            <li>Include clear photos of any damage or issues</li>
                                            <li>Be specific in your description</li>
                                            <li>Reports cannot be edited after submission</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Link
                                    href="/reports"
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                                >
                                    {processing ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            {/* NotificationPopover (if you have it) */}
            {/* <NotificationPopover
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
            /> */}
        </div>
    );
}
