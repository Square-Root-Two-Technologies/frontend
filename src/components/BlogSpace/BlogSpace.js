import React, { useState } from "react";
import Blogs from "./Blogs";
import "./BlogSpace.css";
import { Dropdown, DropdownButton } from "react-bootstrap";

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
        <Dropdown.Item eventKey="JavaScript">JavaScript</Dropdown.Item>
        <Dropdown.Item eventKey="Salesforce">Salesforce</Dropdown.Item>
        <Dropdown.Item eventKey="Sociology">Sociology</Dropdown.Item>
        <Dropdown.Item eventKey="other">Other</Dropdown.Item>
      </DropdownButton>
      <p>You selected: {selectedOption}</p>
      <Blogs selectedOption={selectedOption} />
    </>
  );
}

export default BlogSpace;
