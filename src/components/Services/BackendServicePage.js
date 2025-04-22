import React from "react";
import { Link } from "react-router-dom";
import { FaServer } from "react-icons/fa";

const BackendServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FaServer className="text-4xl text-primary dark:text-indigo-400 mr-4" />
          <h1 className="text-3xl font-bold text-neutral dark:text-white">
            Backend & API Integration
          </h1>
        </div>
        <p className="text-lg text-subtle dark:text-dark-subtle mb-6">
          Building robust, scalable, and secure backend systems and APIs to
          power your applications. We focus on efficient data management,
          seamless integrations, and reliable server-side logic.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-neutral dark:text-gray-300">
          <li>Node.js Backend Development (Express.js)</li>
          <li>RESTful API Design and Development</li>
          <li>Database Design and Management (MongoDB, SQL)</li>
          <li>Authentication and Authorization (JWT)</li>
          <li>Third-Party API Integration</li>
          <li>Server Setup and Deployment (Basic)</li>
          <li>Scalability and Performance Considerations</li>
        </ul>
        <p className="text-subtle dark:text-dark-subtle mb-6">
          From designing database schemas to implementing complex business logic
          and creating powerful APIs, we build the reliable foundation your
          application needs.
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

export default BackendServicePage;
