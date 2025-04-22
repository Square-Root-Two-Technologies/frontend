import React from "react";
import { Link } from "react-router-dom";
import { FaCode } from "react-icons/fa";

const FrontendServicePage = () => {
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <FaCode className="text-4xl text-primary dark:text-indigo-400 mr-4" />
          <h1 className="text-3xl font-bold text-neutral dark:text-white">
            Modern Frontend Development
          </h1>
        </div>
        <p className="text-lg text-subtle dark:text-dark-subtle mb-6">
          Crafting engaging, responsive, and high-performance user interfaces
          using modern web technologies. We focus on creating intuitive user
          experiences that look great on all devices.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-neutral dark:text-gray-300">
          <li>ReactJS Application Development</li>
          <li>Responsive Web Design (Tailwind CSS, CSS Modules)</li>
          <li>State Management (Context API, Redux Toolkit)</li>
          <li>API Integration and Data Fetching</li>
          <li>Component Library Development</li>
          <li>Performance Optimization</li>
          <li>Cross-Browser Compatibility</li>
        </ul>
        <p className="text-subtle dark:text-dark-subtle mb-6">
          We build beautiful and functional frontends that bring your ideas to
          life, focusing on clean code, maintainability, and optimal user
          experience.
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

export default FrontendServicePage;
