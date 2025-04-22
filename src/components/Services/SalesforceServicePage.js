import React from "react";
import { Link } from "react-router-dom";
import { FaCloud } from "react-icons/fa";

const SalesforceServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FaCloud className="text-4xl text-primary dark:text-indigo-400 mr-4" />
          <h1 className="text-3xl font-bold text-neutral dark:text-white">
            Salesforce Solutions
          </h1>
        </div>
        <p className="text-lg text-subtle dark:text-dark-subtle mb-6">
          Leveraging the power of the Salesforce platform to build custom
          solutions, optimize processes, and drive business growth. Our
          expertise includes custom development, administration, and strategic
          consulting.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-neutral dark:text-gray-300">
          <li>Custom Apex & Lightning Web Component (LWC) Development</li>
          <li>
            Sales Cloud, Service Cloud, and Experience Cloud Implementation
          </li>
          <li>API Integration (REST/SOAP)</li>
          <li>Process Automation (Flow, Process Builder)</li>
          <li>Data Migration and Management</li>
          <li>Performance Tuning and Org Health Checks</li>
          <li>Admin Support and Training</li>
        </ul>
        <p className="text-subtle dark:text-dark-subtle mb-6">
          Whether you need a complex application built from scratch or expert
          guidance on optimizing your existing Salesforce org, we provide
          tailored solutions to meet your unique business needs.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 text-sm font-medium text-primary dark:text-indigo-400 hover:underline"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SalesforceServicePage;
