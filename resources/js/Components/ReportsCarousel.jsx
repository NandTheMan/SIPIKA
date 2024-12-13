import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ReportsCarousel = ({ reports }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Auto-advance the carousel every 5 seconds
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? reports.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === reports.length - 1 ? 0 : prevIndex + 1
        );
    };

    if (!reports || reports.length === 0) return null;

    return (
        <div className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-extrabold text-center text-blue-900 mb-12">Recent Reports</h2>
                <div className="relative">
                    {/* Carousel Navigation */}
                    <button
                        onClick={handlePrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 bg-white hover:bg-blue-600 text-gray-800 hover:text-white p-3 rounded-full shadow-lg z-10 transition-transform duration-300"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 bg-white hover:bg-blue-600 text-gray-800 hover:text-white p-3 rounded-full shadow-lg z-10 transition-transform duration-300"
                    >
                        <FontAwesomeIcon icon={faChevronRight} size="lg" />
                    </button>

                    {/* Carousel Content */}
                    <div className="overflow-hidden rounded-lg">
                        <div className="flex transition-transform duration-500 ease-in-out"
                             style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                            {reports.map((report) => (
                                <div key={report.id} className="w-full flex-shrink-0 relative">
                                    <div className="bg-white p-8 rounded-lg shadow-md mx-4">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-800">{report.classroom}</h3>
                                                <p className="text-gray-600 text-sm mt-1">{report.time}</p>
                                            </div>
                                            <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2
                                                ${report.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                <FontAwesomeIcon icon={report.status ? faCheckCircle : faExclamationCircle} />
                                                {report.status ? 'Resolved' : 'Under Review'}
                                            </span>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div>
                                                <div className="mb-6">
                                                    <p className="text-gray-500 text-sm">Reported by:</p>
                                                    <p className="font-semibold text-gray-800 text-lg">
                                                        {report.reportedBy}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{report.reportedByMajor}</p>
                                                </div>
                                                <div className="mb-6">
                                                    <p className="text-gray-500 text-sm">Description:</p>
                                                    <p className="text-gray-800 mt-2">{report.description}</p>
                                                </div>
                                                {report.status === false && (
                                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                                        <p className="text-yellow-600 text-sm flex items-center">
                                                            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                                                            Note: This report is under review and may be subject to change.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {report.image && (
                                                <div className="relative h-64">
                                                    <img
                                                        src={`/storage/${report.image}`}
                                                        alt="Report evidence"
                                                        className="w-full h-full object-contain rounded-lg shadow"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex justify-center mt-8 gap-3">
                        {reports.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentIndex
                                        ? 'bg-blue-600 w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsCarousel;
