import "bootstrap/dist/css/bootstrap.min.css";

import Amplify, { API, graphqlOperation, Storage } from "aws-amplify";
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

const initialState = { name: "", description: "", city: "", file: null };

const imgStyle = {
  height: 40,
  width: 40,
};

const App = () => {
  const [formState, setFormState] = useState(initialState);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();

    const subscription = API.graphql(
      graphqlOperation(onCreateRestaurant)
    ).subscribe({
      next: (restaurantData) => {
        const {
          city,
          description,
          name,
          image,
        } = restaurantData.value.data.onCreateRestaurant;
        const restaurant = { name, description, city, image };
        setRestaurants((r) => [...r, restaurant]);
      },
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const restaurantData = await API.graphql(
        graphqlOperation(listRestaurants)
      );
      const restaurants = restaurantData.data.listRestaurants.items;
      setRestaurants(restaurants);
      console.log(restaurants);
    } catch (err) {
      console.log("Error fetching restaurants: ", err);
    }
  };

  const createNewRestaurant = async () => {
    if (!formState.city || !formState.description || !formState.name) return;

    const { name, description, city } = formState;
    const restaurant = {
      name,
      description,
      city,
    };

    if (formState.file) {
      Storage.put(formState.file.name, formState.file, {
        contentType: "image/png",
      })
        .then(async (result) => {
          const imageURL = await Storage.get(result.key);
          const r = {
            name,
            description,
            city,
            image: imageURL,
          };
          await API.graphql(
            graphqlOperation(createRestaurant, {
              input: r,
            })
          ).then(() => {
            setFormState(initialState);
          });
        })
        .catch((err) => console.log(err));
    } else {
      await API.graphql(
        graphqlOperation(createRestaurant, {
          input: restaurant,
        })
      ).then(() => {
        setFormState(initialState);
      });
    }
  };

  const handleDelete = async (e) => {
    const restaurant = {
      id: e,
    };
    await API.graphql(
      graphqlOperation(deleteRestaurant, {
        input: restaurant,
      })
    ).then(() => fetchRestaurants());
  };

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormState({ ...formState, file: e.target.files[0] });
  };

  return (
    <AmplifyAuthenticator>
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
                <input
                  type="file"
                  accept="image/png"
                  onChange={(e) => handleFileChange(e)}
                />
                <Button
                  onClick={createNewRestaurant}
                  className="float-left mt-3"
                >
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
                    <th>Image</th>
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
                      <td>
                        {restaurant.image ? (
                          <img src={restaurant.image} style={imgStyle} />
                        ) : (
                          restaurant.image
                        )}
                      </td>
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
      <AmplifySignOut />
    </AmplifyAuthenticator>
  );
};

export default App;
