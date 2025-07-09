import React from "react";
import { Link } from "react-router-dom";
import {
  FaCloud,
  FaCode,
  FaCog,
  FaExchangeAlt,
  FaCheckCircle,
  FaRocket,
  FaUsers,
  FaChartLine,
  FaTools,
  FaShieldAlt,
  FaFileAlt,
  FaComments,
} from "react-icons/fa";
const SalesforceServicePage = () => {
  const offeringCardStyle =
    "bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg shadow-soft border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform transform hover:scale-105";
  const iconWrapperStyle =
    "flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 text-primary dark:text-blue-300 mb-4";
  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-160px)]">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-lg shadow-soft-lg border border-gray-200 dark:border-gray-700">
        {}
        <div className="flex flex-col sm:flex-row items-center mb-8 text-center sm:text-left">
          <FaCloud className="text-5xl text-primary dark:text-indigo-400 mr-0 sm:mr-5 mb-4 sm:mb-0 flex-shrink-0" />
          <div>
            <h1 className="text-heading mb-2">
              Expert Salesforce Solutions & Consulting
            </h1>
            <p className="text-lg text-subtle dark:text-dark-subtle">
              Unlock the full potential of your Salesforce investment with our
              6x Certified expertise in custom development, optimization, and
              strategic guidance.
            </p>
          </div>
        </div>
        {}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Transform Your Business with Salesforce
          </h2>
          <p className="text-neutral dark:text-gray-300 leading-relaxed mb-4">
            Salesforce is more than just a CRM; it's a powerful platform that
            can revolutionize how you connect with customers, manage processes,
            and drive growth. However, maximizing its value requires tailored
            solutions and expert implementation. We bridge the gap between
            Salesforce's capabilities and your unique business needs, drawing on
            4+ years of hands-on experience including development at Capgemini
            and direct Developer Support at Salesforce.
          </p>
          <p className="text-neutral dark:text-gray-300 leading-relaxed">
            Whether you need to streamline sales processes, enhance customer
            service, build custom applications, or integrate with other systems,
            our certified consultants and developers deliver solutions that are
            scalable, efficient, and user-friendly.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Explore Our Live Demo Portal
          </h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
            <p className="text-neutral dark:text-gray-300 mb-4">
              See our Salesforce Digital Experience capabilities in action.
              Explore a live, interactive portal built on the Salesforce
              platform.
            </p>
            <Link to="/services/salesforce-experience" className="btn-primary">
              Explore the Portal
            </Link>
          </div>
        </section>
        {}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Our Salesforce Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaCode />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Custom Development
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Building bespoke solutions with Apex, Lightning Web Components
                (LWCs - 26+ built example), and Visualforce to meet your exact
                requirements.
              </p>
            </div>
            {}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaCog />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Cloud Implementation
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Expert implementation and optimization for Sales Cloud
                (Certified Consultant), Service Cloud, and Experience Cloud.
              </p>
            </div>
            {}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaExchangeAlt />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                API & Integration
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Seamlessly connecting Salesforce with your other critical
                business systems using REST/SOAP APIs for unified data flow.
              </p>
            </div>
            {}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaRocket />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Process Automation
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Streamlining your workflows using Salesforce Flow, Process
                Builder, and Approval Processes to boost efficiency.
              </p>
            </div>
            {}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaChartLine />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Performance & Health
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Diagnosing and resolving performance bottlenecks, conducting org
                health checks, and ensuring optimal operation (400+ support
                cases resolved).
              </p>
            </div>
            {}
            <div className={offeringCardStyle}>
              <div className={iconWrapperStyle}>
                <FaUsers />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral dark:text-white">
                Admin & Support
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Providing ongoing administration, user support, training, and
                managed services to keep your Salesforce org running smoothly.
              </p>
            </div>
          </div>
        </section>
        {}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Our Approach
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center">
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>1</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Discovery
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Understanding your goals, challenges, and existing processes.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>2</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Solution Design
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Architecting a tailored Salesforce solution to meet your needs.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>3</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Implementation
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Developing, configuring, and integrating your solution.
              </p>
            </div>
            <div className="text-gray-300 dark:text-gray-600 text-xl">
              &rarr;
            </div>
            <div className="flex-1">
              <div className={iconWrapperStyle + " mx-auto"}>4</div>
              <h3 className="font-semibold mb-1 text-neutral dark:text-white">
                Testing & Launch
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle">
                Ensuring quality and deploying the solution effectively.
              </p>
            </div>
          </div>
        </section>
        {}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Technologies We Use
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Apex",
              "LWC",
              "SOQL",
              "SOSL",
              "Salesforce Flow",
              "REST API",
              "SOAP API",
              "Salesforce DX",
              "Git",
              "Visualforce",
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
        {}
        <section className="mb-12 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Why Partner With Us for Salesforce?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Deep Certified Expertise:
                </strong>{" "}
                Holding 6 Salesforce certifications (Admin, Advanced Admin, PD1,
                App Builder, Sales Cloud Consultant, AI Associate) ensures
                best-practice solutions.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Proven Track Record:
                </strong>{" "}
                Successfully delivered complex projects, resolved 400+ support
                cases, and improved CX scores by 15% in previous roles.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Developer & Support Insight:
                </strong>{" "}
                Unique background combining software engineering and Salesforce
                developer support means we build solutions that are robust *and*
                maintainable.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-neutral dark:text-gray-300">
                <strong className="text-neutral dark:text-white">
                  Full-Stack Perspective:
                </strong>{" "}
                Ability to handle complex integrations and understand the entire
                application lifecycle beyond just Salesforce.
              </span>
            </li>
          </ul>
        </section>
        {}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-6 text-center">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-neutral dark:text-white">
                Challenge: [Client's Problem, e.g., Inefficient Sales Process]
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle mb-3">
                Solution: Implemented custom Sales Cloud automation using Flow
                and Apex triggers, reducing manual data entry by X%.
              </p>
              <p className="text-sm font-medium text-primary dark:text-blue-400">
                Outcome: Increased sales team productivity and improved data
                accuracy.
              </p>
              <p className="text-xs text-secondary dark:text-gray-500 mt-2">
                Industry: [Client Industry]
              </p>
            </div>
            {}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-2 text-neutral dark:text-white">
                Challenge: [Client's Problem, e.g., Disconnected Customer
                Service]
              </h3>
              <p className="text-sm text-subtle dark:text-dark-subtle mb-3">
                Solution: Developed custom LWCs for Service Console providing a
                360-degree customer view, integrated with external knowledge
                base.
              </p>
              <p className="text-sm font-medium text-primary dark:text-blue-400">
                Outcome: Reduced average handling time and improved agent
                efficiency.
              </p>
              <p className="text-xs text-secondary dark:text-gray-500 mt-2">
                Industry: [Client Industry]
              </p>
            </div>
            {}
          </div>
          {}
        </section>
        {}
        {}
        <section className="text-center mt-12 py-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/70 rounded-lg">
          <h2 className="text-2xl font-semibold text-neutral dark:text-white mb-4">
            Ready to Optimize Your Salesforce?
          </h2>
          <p className="text-neutral dark:text-gray-300 mb-6 max-w-xl mx-auto">
            Let's discuss how our Salesforce expertise can help you achieve your
            business goals. Schedule a free, no-obligation consultation today.
          </p>
          <a href="/#contact" className="btn-primary">
            {" "}
            {}
            Request Free Consultation
          </a>
        </section>
        {}
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
export default SalesforceServicePage;
