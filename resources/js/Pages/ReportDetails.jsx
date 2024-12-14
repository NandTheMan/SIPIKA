import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faBars, faCheckCircle, faHourglassHalf } from "@fortawesome/free-solid-svg-icons";

export default function ReportDetails({ report, auth }) {
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
                <Head title="Report Details" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        {/* Status Banner */}
                        <div className={`mb-6 p-4 rounded-lg flex items-center ${
                            report.report_status
                                ? 'bg-green-50 border-l-4 border-green-500'
                                : 'bg-yellow-50 border-l-4 border-yellow-500'
                        }`}>
                            <FontAwesomeIcon
                                icon={report.report_status ? faCheckCircle : faHourglassHalf}
                                className={report.report_status ? 'text-green-500 mr-3' : 'text-yellow-500 mr-3'}
                            />
                            <div>
                                <h2 className={`font-bold ${
                                    report.report_status ? 'text-green-700' : 'text-yellow-700'
                                }`}>
                                    {report.report_status ? 'Resolved' : 'Under Review'}
                                </h2>
                                {report.report_status && (
                                    <p className="text-green-600 text-sm">
                                        Resolved on {report.report_resolved_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Report Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Classroom</h3>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    {report.classroom.classroom_name}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Report Time</h3>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    {report.report_time}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Reported By</h3>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    {report.reporterUser.username}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">User Reported</h3>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    {report.reportedUser.username}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Description</h3>
                            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                                {report.report_description}
                            </div>
                        </div>

                        {/* Evidence Image */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Evidence Photo</h3>
                            {report.url_image_report ? (
                                <div className="mt-2">
                                    <img
                                        src={`/storage/${report.url_image_report}`}
                                        alt="Report Evidence"
                                        className="max-w-full rounded-lg shadow-lg"
                                    />
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-lg text-gray-500 text-center">
                                    No evidence photo provided
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex justify-end">
                            <Link
                                href="/reports"
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Back to Reports
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}