// src/components/ManageOrganisation/ManageOrganisationPage.js
import React, { useContext, useEffect } from "react";
import ConsultationRequestContext from "../../context/ConsultationRequest/ConsultationRequestContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import {
  FaEnvelope,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa"; // Example icons

const ManageOrganisationPage = () => {
  const { requests, isLoading, error, fetchRequests } = useContext(
    ConsultationRequestContext,
  );

  useEffect(() => {
    console.log("ManageOrganisationPage: Fetching requests on mount...");
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch only once on component mount

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata", // Adjust timezone as needed
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
      case "Closed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-160px)]">
      <h1 className="text-heading mb-8">Manage Consultation Requests</h1>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="card text-center max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-error mb-4">Error</h2>
          <p className="text-error mb-6">{error}</p>
          <button onClick={fetchRequests} className="btn-primary">
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && requests.length === 0 && (
        <div className="card text-center py-12">
          <h3 className="text-lg font-semibold text-neutral dark:text-gray-100 mb-4">
            No Requests Found
          </h3>
          <p className="mt-2 text-subtle">
            There are currently no consultation requests to display.
          </p>
        </div>
      )}

      {!isLoading && !error && requests.length > 0 && (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Received
                </th>
                <th scope="col" className="py-3 px-6">
                  Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Email
                </th>
                <th scope="col" className="py-3 px-6">
                  Company
                </th>
                <th scope="col" className="py-3 px-6">
                  Message Snippet
                </th>
                <th scope="col" className="py-3 px-6">
                  Status
                </th>
                {/* <th scope="col" className="py-3 px-6">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req._id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600/50"
                >
                  <td className="py-4 px-6 whitespace-nowrap">
                    {formatDate(req.createdAt)}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                    {req.name}
                  </td>
                  <td className="py-4 px-6">
                    <a href={`mailto:${req.email}`} className="hover:underline">
                      {req.email}
                    </a>
                  </td>
                  <td className="py-4 px-6">{req.company || "-"}</td>
                  <td
                    className="py-4 px-6 max-w-xs truncate"
                    title={req.message}
                  >
                    {req.message}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        req.status,
                      )}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  {/* <td className="py-4 px-6">
                       {/* Placeholder for future actions like 'Mark as Contacted' * /}
                       <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                   </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrganisationPage;
