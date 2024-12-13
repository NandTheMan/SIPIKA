import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faBars, faCheckCircle, faClipboardList, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";

export default function ReportList({ reports = [], auth }) {
    return (
        <div className="min-h-screen bg-lightGradient">
            {/* Header */}
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] px-6 py-10 sm:px-8 sm:py-12 flex justify-between items-center relative'>
                <div className="absolute top-8 left-4 sm:top-8 sm:left-8">
                    <Link href="/" className="text-4xl sm:text-5xl font-philosopher text-white hover:opacity-80">
                        SIPIKA
                    </Link>
                </div>
                <div className='absolute top-8 right-6 sm:top-8 sm:right-8 flex items-center gap-4 sm:gap-6'>
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <FontAwesomeIcon icon={faUser} className="text-white text-lg sm:text-xl" />
                        <p className='text-white text-sm sm:text-base'>
                            {auth.user.username} ({auth.user.major})
                        </p>
                    </div>
                    <FontAwesomeIcon icon={faBell} className="text-white text-lg sm:text-xl cursor-pointer hover:text-gray-300" />
                    <FontAwesomeIcon icon={faBars} className="text-white text-lg sm:text-xl cursor-pointer hover:text-gray-300" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Head title="Reports" />

                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
                        <Link
                            href="/reports/create"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faClipboardList} />
                            <span>Submit New Report</span>
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {reports.length > 0 ? (
                            reports.map((report) => (
                                <div
                                    key={report.report_id}
                                    className={`bg-white rounded-lg shadow-lg p-6 ${
                                        report.report_status ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'
                                    }`}
                                >
                                    <div className="flex justify-between">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Classroom</h3>
                                                <p className="mt-1">{report.classroom.classroom_name}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Reported By</h3>
                                                <p className="mt-1">{report.reporterUser.username}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Report Time</h3>
                                                <p className="mt-1">{report.report_time}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <FontAwesomeIcon
                                                        icon={report.report_status ? faCheckCircle : faHourglassHalf}
                                                        className={report.report_status ? 'text-green-500' : 'text-yellow-500'}
                                                    />
                                                    <span className={
                                                        report.report_status ? 'text-green-600' : 'text-yellow-600'
                                                    }>
                                                        {report.report_status ? 'Resolved' : 'Under Review'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                        <p className="mt-1 text-gray-700">
                                            {report.report_description.length > 200
                                                ? `${report.report_description.substring(0, 200)}...`
                                                : report.report_description
                                            }
                                        </p>
                                    </div>

                                    {report.url_image_report && (
                                        <div className="mt-4">
                                            <img
                                                src={`/storage/${report.url_image_report}`}
                                                alt="Report Evidence"
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <div className="mt-4 flex justify-end">
                                        <Link
                                            href={`/reports/${report.report_id}`}
                                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <FontAwesomeIcon
                                    icon={faClipboardList}
                                    className="text-gray-400 text-5xl mb-4"
                                />
                                <h3 className="text-xl font-medium text-gray-500">No Reports Found</h3>
                                <p className="text-gray-400 mt-2">There are currently no reports to display.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
