// src/components/LandingPage/LandingPage.js
import React, { useState } from "react"; // Ensure useState is imported
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
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"; // Import LoadingSpinner

const LandingPage = () => {
  // --- State for Contact Form ---
  const [contactForm, setContactForm] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: "",
  });
  // Ensure your backend URL is correctly sourced, using environment variables is best practice
  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";
  // --- End State ---

  // --- Styles ---
  const btnPrimary =
    "inline-block px-8 py-3 text-lg font-semibold text-white bg-primary " +
    "hover:bg-blue-900 dark:bg-indigo-500 dark:hover:bg-indigo-600 " +
    "rounded-lg shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    "focus:ring-primary dark:focus:ring-indigo-500 transition duration-200 ease-in-out disabled:opacity-50";
  const btnSecondary =
    "inline-block px-6 py-2 text-sm font-medium text-neutral dark:text-gray-200 " +
    "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 " +
    "rounded-lg shadow-soft focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    "focus:ring-secondary transition duration-200 ease-in-out";
  const cardStyle =
    "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl " +
    "border border-gray-100 dark:border-gray-700 flex flex-col h-96 overflow-hidden " + // Fixed height for alignment
    "transition-all duration-300 ease-in-out hover:-translate-y-1";
  const cardIconStyle = "text-4xl text-primary dark:text-indigo-400 mb-4";
  const cardTitleStyle =
    "text-xl font-semibold text-neutral dark:text-white mb-2";
  const cardDescStyle =
    "text-sm text-subtle dark:text-dark-subtle flex-grow overflow-hidden text-ellipsis"; // Ensure this allows text wrapping if needed
  const cardKeywordsStyle = "text-xs text-secondary dark:text-gray-500 mt-4";
  const sectionPadding = "py-16 md:py-20";
  const formInputClasses = // Defined styles for form inputs
    "form-input w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white " +
    "focus:border-primary dark:focus:border-indigo-400 focus:ring focus:ring-primary focus:ring-opacity-50 dark:focus:ring-indigo-400 dark:focus:ring-opacity-50 " + // Adjusted focus colors
    "disabled:opacity-50 disabled:bg-gray-200 dark:disabled:bg-gray-700/50";
  const formTextareaClasses = // Defined styles specifically for textarea
    "form-textarea w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white " +
    "focus:border-primary dark:focus:border-indigo-400 focus:ring focus:ring-primary focus:ring-opacity-50 dark:focus:ring-indigo-400 dark:focus:ring-opacity-50 " +
    "disabled:opacity-50 disabled:bg-gray-200 dark:disabled:bg-gray-700/50 min-h-[100px]"; // Ensure min height
  const labelClasses =
    "block text-sm font-medium text-neutral dark:text-gray-200 mb-1"; // Added label class
  const requiredMarkClasses = "text-error ml-1"; // For the asterisk

  // --- Data ---
  const keyMetrics = [
    {
      metric:
        "Years Professional Experience in Salesforce Development and Consultation",
      value: "4+",
    },
    {
      metric: "Years Professional Experience in Web Development",
      value: "4+",
    },
    { metric: "Salesforce Certifications", value: "6" },
    { metric: "LWCs Developed", value: "26" },
    { metric: "Support Cases Resolved", value: "400+" },
    { metric: "Integration PoCs Led", value: "9" },
  ];
  const services = [
    {
      icon: <FaCloud className={cardIconStyle} />,
      title: "Salesforce Solutions",
      description:
        "Custom Apex/LWC development (26 LWCs built), Sales Cloud optimization " +
        "(Certified Consultant, MetLife exp.), API integrations (REST/SOAP), " +
        "performance tuning (400+ cases resolved), and strategic consulting.",
      keywords: "Apex, LWC, Sales Cloud, API, Consulting, Performance",
      link: "/services/salesforce",
    },
    {
      icon: <FaCode className={cardIconStyle} />,
      title: "Modern Frontend Development",
      description:
        "Building intuitive, responsive user interfaces with ReactJS. Expertise in " +
        "creating data visualizations (Chart.js, D3.js) and ensuring optimal user " +
        "experience across devices.",
      keywords: "Frontend, ReactJS, UI/UX, Responsive, JavaScript, HTML/CSS",
      link: "/services/frontend",
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
      link: "/services/backend",
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
      link: "/categories",
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

  // --- Form Change Handler ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear status message on new input
    if (submitStatus.message) {
      setSubmitStatus({ success: false, error: false, message: "" });
    }
  };

  // --- Form Submit Handler ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Basic client-side validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setSubmitStatus({
        success: false,
        error: true,
        message: "Please fill in all required fields.",
      });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(contactForm.email)) {
      setSubmitStatus({
        success: false,
        error: true,
        message: "Please enter a valid email address.",
      });
      return;
    }
    if (contactForm.message.length < 10) {
      setSubmitStatus({
        success: false,
        error: true,
        message: "Message must be at least 10 characters long.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ success: false, error: false, message: "" }); // Clear previous status

    try {
      const response = await fetch(`${host}/api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          company: contactForm.company, // Send empty string if not filled, backend handles null
          message: contactForm.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific errors if backend provides them, otherwise general error
        const errorMsg = result.errors
          ? result.errors.map((e) => e.msg).join(", ")
          : result.error || `Submission failed (Status: ${response.status})`;
        throw new Error(errorMsg);
      }

      if (result.success) {
        setSubmitStatus({
          success: true,
          error: false,
          message:
            result.message || "Message sent successfully! We'll be in touch.",
        });
        setContactForm({ name: "", company: "", email: "", message: "" }); // Reset form
      } else {
        throw new Error(result.error || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus({
        success: false,
        error: true,
        message: error.message || "An error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- JSX ---
  return (
    <div className="bg-background dark:bg-dark text-neutral dark:text-gray-200">
      {/* --- Hero Section --- */}
      <section className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full">
        {/* Left Side (Animation) */}
        <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto bg-black">
          <ParticleSimulationScene />
        </div>
        {/* Right Side (Text) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary dark:text-indigo-400 mb-4">
            Finite Problems | Infinite Solutions
          </h1>
          <br></br>
          <h3 className="text-3xl md:text-3xl lg:text-3xl font-bold text-primary dark:text-indigo-400 mb-4">
            Your friendly neighborhood Full Stack Developer!
          </h3>
          <p className="text-lg md:text-xl text-neutral dark:text-gray-300 max-w-prose mb-8">
            Leveraging 4+ years of combined Salesforce (6x Certified) and
            Full-Stack (React, Node.js) expertise to architect robust,
            user-centric applications. Benefit from deep development skills
            (Apex, LWC, API) blended with direct customer support insights for
            solutions built for real-world success.
          </p>
          <a href="#contact" className={btnPrimary}>
            What's on your mind?
          </a>
          {/* Scroll Down Arrow */}
          <div className="mt-12 animate-bounce text-secondary dark:text-gray-500">
            <a href="#services" aria-label="Scroll to services">
              <FaArrowDown size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* --- Services Section --- */}
      <section
        id="services"
        className={`${sectionPadding} bg-gray-50 dark:bg-gray-900/30`}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-heading text-center mb-12">Our Core Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service Cards */}
            {services.map((service, index) => (
              <Link key={index} to={service.link} className="block group">
                <div className={cardStyle}>
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

      {/* --- Credibility Section --- */}
      <section id="credibility" className={sectionPadding}>
        <div className="container mx-auto px-4">
          <h2 className="text-heading text-center mb-12">
            Proven Expertise & Track Record
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Side: Certs & Experience */}
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
            </div>
            {/* Right Side: Key Metrics Table */}
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

      {/* --- Contact Section --- */}
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

          {/* Submission Status Message */}
          {submitStatus.message && (
            <div
              className={`mb-6 p-3 rounded text-center text-sm font-medium ${
                submitStatus.success
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200"
                  : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* Contact Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className={labelClasses}>
                  Name<span className={requiredMarkClasses}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className={formInputClasses}
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  minLength={2}
                />
              </div>
              <div>
                <label htmlFor="company" className={labelClasses}>
                  Company (Optional)
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  className={formInputClasses}
                  placeholder="Your Company"
                  value={contactForm.company}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email<span className={requiredMarkClasses}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className={formInputClasses}
                  placeholder="you@example.com"
                  value={contactForm.email}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="message" className={labelClasses}>
                  Message<span className={requiredMarkClasses}>*</span>
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  required
                  minLength={10}
                  className={formTextareaClasses}
                  placeholder="How can I help?"
                  value={contactForm.message}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <button
                type="submit"
                className={`${btnPrimary} w-full flex items-center justify-center`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    {/* Use the LoadingSpinner component */}
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Sending...</span>
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>

            {/* Direct Contact Info */}
            <div className="space-y-6 pt-2 text-center md:text-left">
              <h3 className="text-xl font-semibold text-neutral dark:text-white mb-4">
                Direct Contact
              </h3>
              <p className="flex items-center justify-center md:justify-start">
                <FaEnvelope className="mr-3 text-primary dark:text-indigo-400" />
                <a
                  href="mailto:tanvirraihanislam2025@gmail.com"
                  className="text-neutral dark:text-gray-200 hover:text-primary dark:hover:text-indigo-400 hover:underline break-all"
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

      {/* --- Footer --- */}
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
