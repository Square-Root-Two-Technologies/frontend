// src/context/ConsultationRequest/ConsultationRequestState.js
import React, { useState, useCallback, useMemo, useContext } from "react";
import ConsultationRequestContext from "./ConsultationRequestContext";
import UserContext from "../user/UserContext"; // Needed to get the token

const ConsultationRequestState = (props) => {
  const host = process.env.REACT_APP_BACKEND || "http://localhost:5000";
  const { currentUser } = useContext(UserContext); // Get user context for token

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication required to view requests.");
      setIsLoading(false);
      setRequests([]); // Clear any stale data
      return;
    }
    // Only proceed if user is SuperAdmin (optional client-side check, backend enforces)
    // if (currentUser?.role !== 'SuperAdmin') {
    //     setError("Access denied.");
    //     setIsLoading(false);
    //     setRequests([]);
    //     return;
    // }

    console.log("ConsultationRequestState: Fetching requests...");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${host}/api/contact/requests`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token, // Send token for authentication/authorization
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to fetch requests (Status: ${response.status})`,
        );
      }

      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
        console.log(
          `ConsultationRequestState: Fetched ${data.requests.length} requests.`,
        );
      } else {
        throw new Error(data.error || "Invalid data received from server.");
      }
    } catch (err) {
      console.error("ConsultationRequestState: Error fetching requests:", err);
      setError(err.message || "Could not load consultation requests.");
      setRequests([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [host, currentUser]); // Depend on host and currentUser (to re-check role if needed)

  // --- Future Function Placeholder ---
  // const updateRequestStatus = useCallback(async (requestId, newStatus) => {
  //   // Logic to call PUT /api/contact/requests/:id/status
  //   // Update local state on success
  // }, [host]);

  const contextValue = useMemo(
    () => ({
      requests,
      isLoading,
      error,
      fetchRequests,
      // updateRequestStatus, // Add when implemented
    }),
    [requests, isLoading, error, fetchRequests /*, updateRequestStatus*/],
  );

  return (
    <ConsultationRequestContext.Provider value={contextValue}>
      {props.children}
    </ConsultationRequestContext.Provider>
  );
};

export default ConsultationRequestState;
