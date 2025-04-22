import React from "react";
import { Link } from "react-router-dom";
import {
  FaCloud,
  FaCode,
  FaServer,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaArrowDown,
  FaLightbulb,
} from "react-icons/fa";
import ParticleSimulationScene from "../ParticleSimulationScene/ParticleSimulationScene";

const LandingPage = () => {
  const btnPrimary =
    "inline-block px-8 py-3 text-lg font-semibold text-white bg-primary " +
    "hover:bg-blue-900 dark:bg-indigo-500 dark:hover:bg-indigo-600 " +
    "rounded-lg shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    "focus:ring-primary dark:focus:ring-indigo-500 transition duration-200 ease-in-out";
  const btnSecondary =
    "inline-block px-6 py-2 text-sm font-medium text-neutral dark:text-gray-200 " +
    "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 " +
    "rounded-lg shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    "focus:ring-secondary transition duration-200 ease-in-out";

  // --- MODIFIED cardStyle ---
  // Added fixed height, overflow clipping, and hover effects
  const cardStyle =
    "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl " + // Increased hover shadow
    "border border-gray-100 dark:border-gray-700 flex flex-col h-96 overflow-hidden " +
    "transition-all duration-300 ease-in-out hover:-translate-y-1"; // Added transition and hover lift

  const cardIconStyle = "text-4xl text-primary dark:text-indigo-400 mb-4";
  const cardTitleStyle =
    "text-xl font-semibold text-neutral dark:text-white mb-2";
  const cardDescStyle =
    "text-sm text-subtle dark:text-dark-subtle flex-grow overflow-hidden text-ellipsis";
  const cardKeywordsStyle = "text-xs text-secondary dark:text-gray-500 mt-4";
  const sectionPadding = "py-16 md:py-20";

  const keyMetrics = [
    { metric: "Years Professional Exp.", value: "4+" },
    { metric: "Salesforce Certifications", value: "6" },
    { metric: "LWCs Developed (Example)", value: "26" },
    { metric: "Support Cases Resolved", value: "400+" },
    { metric: "Productivity (Peak)", value: ">120%" },
    { metric: "Proven CX Improvement", value: "+15%" },
    { metric: "Integration PoCs Led", value: "9" },
  ];

  // --- MODIFIED services array ---
  // Added 'link' property for routing
  const services = [
    {
      icon: <FaCloud className={cardIconStyle} />,
      title: "Salesforce Solutions",
      description:
        "Custom Apex/LWC development (26 LWCs built), Sales Cloud optimization " +
        "(Certified Consultant, MetLife exp.), API integrations (REST/SOAP), " +
        "performance tuning (400+ cases resolved), and strategic consulting.",
      keywords: "Apex, LWC, Sales Cloud, API, Consulting, Performance",
      link: "/services/salesforce", // Added link
    },
    {
      icon: <FaCode className={cardIconStyle} />,
      title: "Modern Frontend Development",
      description:
        "Building intuitive, responsive user interfaces with ReactJS. Expertise in " +
        "creating data visualizations (Chart.js, D3.js) and ensuring optimal user " +
        "experience across devices.",
      keywords: "Frontend, ReactJS, UI/UX, Responsive, JavaScript, HTML/CSS",
      link: "/services/frontend", // Added link
    },
    {
      icon: <FaServer className={cardIconStyle} />,
      title: "Backend & API Integration",
      description:
        "Developing scalable backend systems using Node.js. Expertise in REST/SOAP " +
        "API development, database management (SQL/SOQL/SOSL), and robust system " +
        "architecture.",
      keywords:
        "Backend, Node.js, API, Database, SQL, Integration, Scalability",
      link: "/services/backend", // Added link
    },
    {
      icon: <FaLightbulb className={cardIconStyle} />,
      title: "Knowledge Base & Tech Insights",
      description:
        "Explore a curated collection of articles, tutorials, and best practices " +
        "sharing insights from real-world experience. Covers Salesforce development " +
        "(Apex, LWC, API integration), modern web technologies (React, Node.js), " +
        "DevOps strategies, AI in tech, and effective problem-solving techniques.",
      keywords:
        "Blog, Knowledge Base, Salesforce, Apex, LWC, React, Node.js, DevOps, AI, Tutorials, Best Practices",
      link: "/categories", // Existing link
    },
  ];

  const certifications = [
    "Salesforce Certified Administrator",
    "Salesforce Certified Advanced Administrator",
    "Salesforce Certified Platform Developer 1",
    "Salesforce Certified Platform App Builder",
    "Salesforce Certified Sales Cloud Consultant",
    "Salesforce Certified AI Associate",
  ];

  return (
    <div className="bg-background dark:bg-dark text-neutral dark:text-gray-200">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
        {/* Left Side (Animation) */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto bg-black">
          <ParticleSimulationScene />
        </div>
        {/* Right Side (Text Content) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-indigo-400 mb-4">
            Expert Full-Stack Development & Salesforce Consulting
          </h1>
          <p className="text-lg md:text-xl text-neutral dark:text-gray-300 max-w-prose mb-8">
            Leveraging 4+ years of combined Salesforce (6x Certified) and
            Full-Stack (React, Node.js) expertise to architect robust,
            user-centric applications. Benefit from deep development skills
            (Apex, LWC, API) blended with direct customer support insights for
            solutions built for real-world success.
          </p>
          <a href="#contact" className={btnPrimary}>
            Get a Free Consultation
          </a>
          {/* Scroll Down Indicator */}
          <div className="mt-12 animate-bounce text-secondary dark:text-gray-500">
            <a href="#services" aria-label="Scroll to services">
              <FaArrowDown size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className={`${sectionPadding} bg-gray-50 dark:bg-gray-900/30`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-heading text-center mb-12">Our Core Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* --- MODIFIED map function --- */}
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link} // Use the link from the service object
                className="block group" // Use block to make link fill cell, group for potential future inner hover styles
              >
                <div className={cardStyle}>
                  {" "}
                  {/* Card styles applied here */}
                  {service.icon}
                  <h3 className={cardTitleStyle}>{service.title}</h3>
                  <p className={cardDescStyle}>{service.description}</p>
                  <p className={cardKeywordsStyle}>
                    <span className="font-medium">Keywords:</span>{" "}
                    {service.keywords}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section id="credibility" className={sectionPadding}>
        <div className="container mx-auto px-4">
          <h2 className="text-heading text-center mb-12">
            Proven Expertise & Track Record
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Certs & Experience */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-neutral dark:text-white">
                  Salesforce Certified (6x)
                </h3>
                <ul className="list-disc list-inside text-subtle dark:text-dark-subtle space-y-1">
                  {certifications.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
                <p className="text-xs text-secondary dark:text-gray-500 mt-2">
                  (Including the forward-looking AI Associate Certification)
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-neutral dark:text-white">
                  4+ Years of Proven Experience
                </h3>
                <p className="text-subtle dark:text-dark-subtle">
                  Combined experience as a Software Engineer (Capgemini) and
                  Salesforce Developer Support Engineer (Salesforce) provides a
                  unique perspective on building and maintaining robust
                  applications. Delivered solutions for diverse clients,
                  including in the Financial Services sector (MetLife Japan).
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-neutral dark:text-white">
                  Recognition & Achievements
                </h3>
                <ul className="list-disc list-inside text-subtle dark:text-dark-subtle space-y-1">
                  <li>
                    Operational Excellence Award: Achieved >120% productivity
                    peak.
                  </li>
                  <li>
                    Customer Satisfaction Kudos: Increased CX scores by 15%.
                  </li>
                  <li>
                    Consistently delivered high-quality, efficient solutions.
                  </li>
                </ul>
              </div>
            </div>
            {/* Right Column: Key Metrics Table */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-neutral dark:text-white lg:text-left text-center">
                Key Metrics At-a-Glance
              </h3>
              <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left text-neutral dark:text-gray-300">
                  <thead className="text-xs text-neutral uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Metric
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {keyMetrics.map((item, index) => (
                      <tr
                        key={index}
                        className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 font-medium">{item.metric}</td>
                        <td className="px-6 py-4 font-semibold text-primary dark:text-indigo-400 text-right">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-secondary dark:text-gray-500 mt-3 text-center lg:text-left">
                Demonstrating consistent delivery and impact across development
                and support roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className={`${sectionPadding} bg-gray-50 dark:bg-gray-900/30`}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-heading text-center mb-4">
            Let's Build Your Solution
          </h2>
          <p className="text-subtle dark:text-dark-subtle text-center mb-10">
            Ready to elevate your business with custom software or optimized
            Salesforce solutions? Contact me today using the form below or via
            direct details.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Contact Form */}
            <form className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-neutral dark:text-gray-200 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="form-input w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-primary focus:ring-primary"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-neutral dark:text-gray-200 mb-1"
                >
                  Company (Optional)
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="form-input w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-primary focus:ring-primary"
                  placeholder="Your Company"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral dark:text-gray-200 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="form-input w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-primary focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-neutral dark:text-gray-200 mb-1"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  required
                  className="form-textarea w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-primary focus:ring-primary"
                  placeholder="How can I help?"
                ></textarea>
              </div>
              <button type="submit" className={`${btnPrimary} w-full`}>
                Send Message
              </button>
            </form>

            {/* Contact Details */}
            <div className="space-y-6 pt-2 text-center md:text-left">
              <h3 className="text-xl font-semibold text-neutral dark:text-white mb-4">
                Direct Contact
              </h3>
              <p className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-3 text-primary dark:text-indigo-400" />
                <a
                  href="mailto:tanvirraihanislam2025@gmail.com"
                  className="text-neutral dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 hover:underline"
                >
                  tanvirraihanislam2025@gmail.com
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <FaPhone className="mr-3 text-primary dark:text-indigo-400" />
                <a
                  href="tel:+918017888305"
                  className="text-neutral dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 hover:underline"
                >
                  +91 8017888305 (Hyderabad, India)
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <FaLinkedin className="mr-3 text-primary dark:text-indigo-400" />
                <a
                  href="https://www.linkedin.com/in/tanvir-raihan-islam/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 hover:underline"
                >
                  LinkedIn Profile
                </a>
              </p>
              <div className="pt-6">
                <p className="text-subtle dark:text-dark-subtle">
                  Want to learn more?{" "}
                  <Link
                    to="/categories"
                    className="text-primary dark:text-indigo-400 hover:underline font-medium"
                  >
                    Explore Insights & Blog Posts
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-subtle dark:text-dark-subtle text-xs">
          © {new Date().getFullYear()} squareroottwotechnologies. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
