// import logo from "./logo.svg";
// import "./App.css";
// import Amplify from "aws-amplify";
// import awsExports from "./aws-exports";
// Amplify.configure(awsExports);

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import React, { useEffect, useReducer, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";

import "./App.css";
import awsConfig from "./aws-exports";

Amplify.configure(awsConfig);

const App = () => {
  return (
    <div className="App">
      <Container>
        <Row className="mt-3">
          <Col md={4}>
            <Form>
              <Form.Group controlId="formDataName">
                <Form.Control type="text" name="name" placeholder="Name" />
              </Form.Group>
              <Form.Group controlId="formDataDescription">
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Description"
                />
              </Form.Group>
              <Form.Group controlId="formDataCity">
                <Form.Control type="text" name="city" placeholder="City" />
              </Form.Group>
              <Button className="float-left">Add New Restaurant</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
