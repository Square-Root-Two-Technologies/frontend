import React from "react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";

const SalesforceExperiencePage = () => {
  const salesforceUrl =
    "https://curious-shark-5xe4cd-dev-ed.trailblaze.my.site.com/squareroottwo";

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 p-6 md:p-8 rounded-lg shadow-soft-lg border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 text-center sm:text-left">
          <div>
            <h1 className="text-heading mb-2">Salesforce Digital Experience</h1>
            <p className="text-lg text-subtle dark:text-dark-subtle">
              An interactive portal powered by Salesforce.
            </p>
          </div>
          <a
            href={salesforceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-4 sm:mt-0"
          >
            Open in New Tab <FaExternalLinkAlt className="ml-2" />
          </a>
        </div>

        {/* Iframe Container */}
        <div className="w-full h-[75vh] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-inner">
          <iframe
            src={salesforceUrl}
            title="Salesforce Digital Experience"
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms" // Basic sandboxing for security
          />
        </div>

        {/* Footer/Back Link */}
        <div className="mt-8">
          <Link
            to="/services/salesforce"
            className="inline-flex items-center text-sm font-medium text-primary dark:text-indigo-400 hover:underline"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Salesforce Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalesforceExperiencePage;
