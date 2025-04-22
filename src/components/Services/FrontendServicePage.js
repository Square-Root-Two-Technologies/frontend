import React from "react";
import { Link } from "react-router-dom";
import {
  FaCode,
  FaReact,
  FaMobileAlt,
  FaTachometerAlt,
  FaPalette,
  FaCheckCircle,
  FaTools,
  FaAccessibleIcon,
  FaPlug,
  FaComments,
} from "react-icons/fa"; // Added more relevant icons

const FrontendServicePage = () => {
  // Reusable card style for offerings
  const offeringCardStyle =
    "bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform transform hover:scale-105";
  const iconWrapperStyle =
    "flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 mb-4";

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-soft-lg border border-gray-200 dark:border-gray-700">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center mb-8 text-center sm:text-left">
          <FaCode className="text-5xl text-primary dark:text-indigo-400 mr-0 sm:mr-5 mb-4 sm:mb-0 flex-shrink-0" />
          <div>
            <h1 className="text-heading mb-2">Modern Frontend Development</h1>
            <p className="text-lg text-subtle dark:text-dark-subtle">
              Building intuitive, responsive, and high-performance user
              interfaces with React and the latest web technologies.
            </p>
          </div>
        </div>

        {/* Introduction/Value Proposition */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Engage Your Users with Exceptional UI/UX
          </h2>
          <p className="text-neutral dark:text-gray-300 leading-relaxed mb-4">
            In today's digital landscape, a seamless and engaging user interface
            is crucial for success. Your website or application's frontend is
            the first impression you make. We specialize in crafting modern,
            performant, and visually appealing frontends using ReactJS that
            captivate users and deliver results.
          </p>
          <p className="text-neutral dark:text-gray-300 leading-relaxed">
            We focus on clean, maintainable code, pixel-perfect implementation,
            and ensuring your application works flawlessly across all devices
            and browsers. From complex single-page applications (SPAs) to
            interactive dashboards, we bring your vision to life.
          </p>
        </section>

        {/* Specific Offerings */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Our Frontend Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Offering 1 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaReact />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                React Application Development
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Building dynamic and interactive SPAs and component-based UIs
                with React, Hooks, and Context API/Redux.
              </p>
            </div>
            {/* Offering 2 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaMobileAlt />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Responsive Web Design
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Ensuring your application looks and functions perfectly on
                desktops, tablets, and smartphones using Tailwind CSS or other
                CSS methodologies.
              </p>
            </div>
            {/* Offering 3 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaPlug />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                API Integration
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Effectively fetching, displaying, and managing data from your
                backend APIs within the frontend application.
              </p>
            </div>
            {/* Offering 4 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaTachometerAlt />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Performance Optimization
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Analyzing and improving load times, rendering speed, and overall
                frontend performance for a smoother user experience.
              </p>
            </div>
            {/* Offering 5 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaPalette />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                UI/UX Implementation
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Translating design mockups and prototypes (Figma, Sketch, etc.)
                into pixel-perfect, functional code.
              </p>
            </div>
            {/* Offering 6 */}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaAccessibleIcon />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Accessibility (a11y)
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Building interfaces that are usable by everyone, adhering to
                WCAG guidelines and best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Our Development Flow
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center">
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>1</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Planning & Design Review
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Understanding requirements, reviewing designs, and planning
                components.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>2</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Component Development
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Building reusable React components and implementing UI logic.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>3</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Integration & State Management
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Connecting to APIs and managing application state effectively.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>4</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Testing & Refinement
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Ensuring cross-browser compatibility, responsiveness, and
                performance.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Core Frontend Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "React",
              "JavaScript (ES6+)",
              "HTML5",
              "CSS3",
              "Tailwind CSS",
              "Context API",
              "Redux Toolkit",
              "Axios / Fetch API",
              "Jest",
              "React Testing Library",
              "Vite / Webpack",
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
            Why Choose Our Frontend Services?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Modern Expertise:
                </strong>{" "}
                Proficient in React and the latest frontend ecosystem tools and
                best practices.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Performance Focused:
                </strong>{" "}
                We prioritize optimizing code for fast load times and smooth
                user interactions.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Responsive & Accessible:
                </strong>{" "}
                Commitment to creating interfaces that work for everyone, on any
                device.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Clean & Maintainable Code:
                </strong>{" "}
                Writing code that is easy to understand, scale, and maintain
                long-term.
              </span>
            </li>
          </ul>
        </section>

        {/* --- Placeholder for Case Studies --- */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Featured Frontend Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example Case Study Placeholder 1 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-neutral dark:text-white">
                Project: [Project Name, e.g., Interactive Dashboard]
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle mb-3">
                Built a real-time data visualization dashboard using React and
                Chart.js, connecting to a Node.js backend API.
              </p>
              <p className="text-sm font-medium text-primary dark:text-blue-400">
                Outcome: Provided client with actionable insights through an
                intuitive interface.
              </p>
              <p className="text-xs text-secondary dark:text-gray-500 mt-2">
                Technologies: React, Chart.js, Tailwind CSS
              </p>
            </div>
            {/* Example Case Study Placeholder 2 */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-neutral dark:text-white">
                Project: [Project Name, e.g., E-commerce UI]
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle mb-3">
                Developed a fully responsive product Browse and checkout
                experience for an e-commerce platform, focusing on mobile-first
                design.
              </p>
              <p className="text-sm font-medium text-primary dark:text-blue-400">
                Outcome: Improved user engagement and conversion rates on mobile
                devices.
              </p>
              <p className="text-xs text-secondary dark:text-gray-500 mt-2">
                Technologies: React, Context API, Responsive Design
              </p>
            </div>
          </div>
        </section>
        {/* --- End Placeholder --- */}

        {/* Call to Action */}
        <section className="text-center mt-12 py-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800/70 rounded-lg">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Need an Engaging Frontend?
          </h2>
          <p className="text-neutral dark:text-gray-300 mb-6 max-w-xl mx-auto">
            Let's build a user interface that delights your users and achieves
            your business objectives. Contact us to discuss your project needs.
          </p>
          <a href="/#contact" className="btn-primary">
            {" "}
            {/* Links to contact form on LandingPage */}
            Discuss Your Project
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

export default FrontendServicePage;
