import React from "react";
import { Link, useSearchParams } from "react-router-dom";

const ConnectCallback = () => {
  const [params] = useSearchParams();
  const connected = params.get("connected");
  const error = params.get("error");

  return (
    <div style={{ maxWidth: 480, margin: "3rem auto", padding: "0 1.5rem", textAlign: "center" }}>
      {connected ? (
        <>
          <h2 style={{ fontFamily: "var(--font-serif)", color: "var(--text)" }}>Org connected</h2>
          <p style={{ color: "var(--text2)" }}>You can head back and submit your solution.</p>
        </>
      ) : (
        <>
          <h2 style={{ fontFamily: "var(--font-serif)", color: "#c94b2b" }}>Couldn't connect</h2>
          <p style={{ color: "var(--text2)" }}>{error || "Something went wrong connecting your org."}</p>
        </>
      )}
      <Link to="/apexjudge" className="btn-primary" style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
        Back to ApexJudge
      </Link>
    </div>
  );
};

export default ConnectCallback;
