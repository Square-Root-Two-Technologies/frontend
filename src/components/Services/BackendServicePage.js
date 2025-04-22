import React from "react";
import { Link } from "react-router-dom";
import {
  FaServer,
  FaDatabase,
  FaPlug,
  FaLock,
  FaShippingFast,
  FaCheckCircle,
  FaCogs,
  FaNetworkWired,
  FaComments,
} from "react-icons/fa"; // Added more relevant icons

const BackendServicePage = () => {
  // Reusable card style for offerings
  const offeringCardStyle =
    "bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform transform hover:scale-105";
  const iconWrapperStyle =
    "flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 mb-4";

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-soft-lg border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center mb-8 text-center sm:text-left">
          <FaServer className="text-5xl text-primary dark:text-indigo-400 mr-0 sm:mr-5 mb-4 sm:mb-0 flex-shrink-0" />
          <div>
            <h1 className="text-heading mb-2">
              Backend Development & API Integration
            </h1>
            <p className="text-lg text-subtle dark:text-dark-subtle">
              Building secure, scalable, and reliable Node.js backends and APIs
              to power your applications and connect your systems.
            </p>
          </div>
        </div>

        {/* Introduction/Value Proposition */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            The Engine Behind Your Application
          </h2>
          <p className="text-neutral dark:text-gray-300 leading-relaxed mb-4">
            A robust backend is the critical foundation for any successful
            digital product. It handles data management, business logic,
            security, and communication between different parts of your system.
            We specialize in developing efficient and scalable backend solutions
            using Node.js, ensuring your application runs smoothly and reliably.
          </p>
          <p className="text-neutral dark:text-gray-300 leading-relaxed">
            From designing database schemas and building RESTful APIs to
            implementing authentication and integrating third-party services, we
            provide comprehensive backend development services tailored to your
            specific needs.
          </p>
        </section>

        {/* Specific Offerings */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Our Backend Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Offering 1 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaNetworkWired /> {/* Changed icon */}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Node.js API Development
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Creating fast, efficient, and scalable RESTful APIs using
                Node.js and frameworks like Express.js.
              </p>
            </div>
            {/* Offering 2 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaDatabase />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Database Design & Management
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Designing and implementing database schemas (MongoDB, SQL -
                specify experience) and managing data effectively.
              </p>
            </div>
            {/* Offering 3 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaLock />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Authentication & Authorization
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Implementing secure user authentication and authorization
                mechanisms using JWT, OAuth, or other standard practices.
              </p>
            </div>
            {/* Offering 4 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaPlug />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Third-Party API Integration
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Connecting your backend with external services like payment
                gateways, notification systems, or other essential APIs.
              </p>
            </div>
            {/* Offering 5 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaShippingFast /> {/* Changed icon */}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Scalability & Performance
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Designing backend architecture with scalability and performance
                in mind to handle growing user loads and data volumes.
              </p>
            </div>
            {/* Offering 6 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaCogs /> {/* Changed icon */}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Server Setup & Deployment
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Assisting with basic server setup and deployment strategies on
                platforms like Heroku or AWS (specify comfort level).
              </p>
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Our Backend Workflow
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center">
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>1</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Requirements & Architecture
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Defining data models, API endpoints, and system architecture.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>2</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                API & Logic Development
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Implementing core business logic, API endpoints, and database
                interactions.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>3</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Integration & Security
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Connecting with services, implementing authentication and
                security measures.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>4</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Testing & Deployment
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Thorough testing (unit, integration) and deploying the backend
                service.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Key Backend Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Node.js",
              "Express.js",
              "MongoDB",
              "Mongoose",
              "SQL (PostgreSQL, MySQL - specify)",
              "REST API",
              "GraphQL (if applicable)",
              "JWT",
              "Docker (Basic)",
              "Git",
              "AWS / Heroku (Basic Deployment)",
            ].map((tech) => (
              <span
                key={tech}
                className="bg-gray-100 dark:bg-gray-700 text-secondary dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-12 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Why Choose Our Backend Services?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Full-Stack Integration:
                </strong>{" "}
                Seamless integration with frontend applications (React) and
                Salesforce systems.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Scalability Focused:
                </strong>{" "}
                We design backends with future growth in mind, ensuring they can
                handle increasing demands.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Security Conscious:
                </strong>{" "}
                Implementing security best practices for authentication, data
                protection, and API security.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Reliable & Efficient:
                </strong>{" "}
                Building robust backend logic and efficient database queries for
                dependable performance.
              </span>
            </li>
          </ul>
        </section>

        {/* --- Placeholder for Case Studies --- */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Backend Project Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example Case Study Placeholder 1 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-neutral dark:text-white">
                Project: [Project Name, e.g., Content Management API]
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle mb-3">
                Developed a Node.js REST API for a React-based CMS, handling
                content creation, retrieval, updates, and user authentication.
              </p>
              <p className="text-sm font-medium text-primary dark:text-blue-400">
                Outcome: Enabled dynamic content updates for the client's
                website via a secure API.
              </p>
              <p className="text-xs text-secondary dark:text-gray-500 mt-2">
                Technologies: Node.js, Express, MongoDB, JWT
              </p>
            </div>
            {/* Example Case Study Placeholder 2 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-neutral dark:text-white">
                Project: [Project Name, e.g., Real-time Notification Service]
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle mb-3">
                Built a backend service to integrate with a third-party
                notification provider (e.g., Twilio), triggering alerts based on
                application events.
              </p>
              <p className="text-sm font-medium text-primary dark:text-blue-400">
                Outcome: Implemented real-time user notifications for critical
                updates.
              </p>
              <p className="text-xs text-secondary dark:text-gray-500 mt-2">
                Technologies: Node.js, Third-Party API Integration
              </p>
            </div>
          </div>
        </section>
        {/* --- End Placeholder --- */}

        {/* Call to Action */}
        <section className="text-center mt-12 py-8 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800/70 rounded-lg">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Need a Solid Backend Foundation?
          </h2>
          <p className="text-neutral dark:text-gray-300 mb-6 max-w-xl mx-auto">
            Ensure your application is powered by a reliable, secure, and
            scalable backend. Let's discuss your requirements and architect the
            right solution.
          </p>
          <a href="/#contact" className="btn-primary">
            {" "}
            {/* Links to contact form on LandingPage */}
            Discuss Your Backend Needs
          </a>
        </section>

        {/* Back Link */}
        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-primary dark:text-indigo-400 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BackendServicePage;
