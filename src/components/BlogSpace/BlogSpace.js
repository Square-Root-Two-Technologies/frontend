import React, { useState, Suspense } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import "./BlogSpace.css";

const Blogs = React.lazy(() => import("./Blogs"));

function BlogSpace() {
  const [selectedOption, setSelectedOption] = useState("all");

  const handleSelect = (eventKey) => {
    setSelectedOption(eventKey);
  };

  const dropdownOptions = [
    { key: "all", label: "All Topics" },
    { key: "JavaScript", label: "JavaScript" },
    { key: "Salesforce", label: "Salesforce" },
    { key: "Sociology", label: "Sociology" },
    { key: "Other Topics", label: "Other" },
  ];

  return (
    <Container fluid className="blogspace-container">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <div className="blogspace-header">
            <h1 className="blogspace-title">Blog Space</h1>
            <div className="blogspace-controls">
              <Dropdown onSelect={handleSelect}>
                <Dropdown.Toggle className="blogspace-dropdown">
                  {selectedOption.charAt(0).toUpperCase() +
                    selectedOption.slice(1)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {dropdownOptions.map((option) => (
                    <Dropdown.Item
                      key={option.key}
                      eventKey={option.key}
                      active={selectedOption === option.key}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <p className="blogspace-subtitle">
                Showing:{" "}
                {selectedOption.charAt(0).toUpperCase() +
                  selectedOption.slice(1)}
              </p>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="text-center">
                <h2 className="text-light fw-light">Loading...</h2>
              </div>
            }
          >
            <Blogs selectedOption={selectedOption} />
          </Suspense>
        </Col>
      </Row>
    </Container>
  );
}

export default BlogSpace;
