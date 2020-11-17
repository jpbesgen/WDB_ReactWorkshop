import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { API, graphqlOperation } from "aws-amplify";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { Delete } from "@material-ui/icons";

import { listRestaurants } from "./graphql/queries";
import { createRestaurant, deleteRestaurant } from "./graphql/mutations";
import { onCreateRestaurant } from "./graphql/subscriptions";

import "./App.css";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: "", description: "", city: "" };

const App = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {}, []);

  const fetchRestaurants = async () => {};

  const createNewRestaurant = async () => {};

  const handleDelete = async (e) => {};

  const handleChange = (e) => {};

  return (
    <div className="App">
      <Container>
        <Row className="mt-4">
          <h2>Restaurants</h2>
        </Row>
        <Row className="mt-3">
          <Col md={4}>
            <Form>
              <Form.Group controlId="formDataName">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDataDescription">
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Description"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formDataCity">
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="City"
                  onChange={handleChange}
                />
              </Form.Group>
              <Button onClick={createNewRestaurant} className="float-left">
                Add New Restaurant
              </Button>
            </Form>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>City</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant, index) => (
                  <tr key={`restaurant-${index}`}>
                    <td>{index + 1}</td>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.description}</td>
                    <td>{restaurant.city}</td>
                    <td onClick={() => handleDelete(restaurant.id)}>
                      <Button>
                        <Delete />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
