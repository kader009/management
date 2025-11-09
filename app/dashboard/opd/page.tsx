'use client';

export default function OPDPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          OPD Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Outpatient Department Services
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-indigo-600 dark:text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            OPD Module
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            This section will manage outpatient department services, patient
            registration, appointments, and consultations.
          </p>
          <div className="mt-8">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
