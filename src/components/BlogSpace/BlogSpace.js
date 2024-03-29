import React, { useState, Suspense } from "react";
//import Blogs from "./Blogs";
import "./BlogSpace.css";
import { Dropdown, DropdownButton } from "react-bootstrap";

const Blogs = React.lazy(() => import("./Blogs"));

function BlogSpace() {
  const [selectedOption, setSelectedOption] = useState("all");

  function handleSelect(eventKey) {
    setSelectedOption(eventKey);
  }

  return (
    <>
      <DropdownButton
        variant="primary"
        title="Select an option"
        style={{ padding: "10px", margin: "20px" }}
        onSelect={handleSelect}
      >
        <Dropdown.Item eventKey="all">All Topics</Dropdown.Item>
        <Dropdown.Item eventKey="JavaScript">JavaScript</Dropdown.Item>
        <Dropdown.Item eventKey="Salesforce">Salesforce</Dropdown.Item>
        <Dropdown.Item eventKey="Sociology">Sociology</Dropdown.Item>
        <Dropdown.Item eventKey="other">Other</Dropdown.Item>
      </DropdownButton>
      <p>You selected: {selectedOption}</p>
      <Suspense
        fallback={
          <div>
            <h1>Loading, please wait :)</h1>
          </div>
        }
      >
        <Blogs selectedOption={selectedOption} />
      </Suspense>
    </>
  );
}

export default BlogSpace;
