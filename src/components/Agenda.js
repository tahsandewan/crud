import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import { Button, Row, Col, Table, FloatingLabel } from "react-bootstrap";
import { AgendaService } from '../services/AgendaService';
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import {validateNull} from "../services/validation";
import { CSVLink, CSVDownload } from "react-csv";
import ReactFileReader from "react-file-reader";
import Papa from "papaparse";
class Agenda extends Component {
  constructor(props) {
    super(props);
    this.agendaService = AgendaService.instance;
    this.state = {
      flag: false,
      id: 0,
      mode: "ADD",
      title: "",
      description: "",
      status: "Active",
      date: "",
      csvfile: undefined,
    };
    this.updateData = this.updateData.bind(this);
  }

  setStateEx(state, callback) {
    this.setState(state, callback);
  }

  componentDidMount() {}
  handleChange = (event) => {
    this.setState({
      csvfile: event.target.files[0],
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true,
    });
    this.setState({ csvfile: null, flag: !this.state.flag });
     this.filesInput.value ="";
  };

  updateData(result) {
    var data = result.data[0];
     console.log("data",data.title,data.description,data.status,data.date);
     this.agendaService.post(data);
    console.log(data);
    this.setState({ csvfile: null, flag: !this.state.flag });

  }


  onAddFormSubmitted(event) {
    event.preventDefault();
    //
    // const formData = new FormData(event.target);
    if (this.state.mode === "ADD") {
      if (
        validateNull(this.state.title) &&
        validateNull(this.state.description) &&
        validateNull(this.state.date)
      ) {
        console.log("submit data", this.state);
        this.agendaService.post(this.state);
        this.setState({
          flag: !this.state.flag,
          title: "",
          description: "",
          date: "",
          status: "Active",
        });
      } else {
        if (validateNull(this.state.title) === false) {
          alert("Missing field title");
        } else if (validateNull(this.state.description) === false) {
          alert("Missing field description");
        } else if (validateNull(this.state.date) === false) {
          alert("Missing field date");
        }
      }
    } else if (this.state.mode === "EDIT") {
      if (
        validateNull(this.state.title) &&
        validateNull(this.state.description) &&
        validateNull(this.state.date)
      ) {
        this.agendaService.updateById(this.state.id, this.state);

        this.setState({
          mode: "ADD",
          id: 0,
          title: "",
          description: "",
          date: "",
          status: "Active",
        });
      } else {
        if (validateNull(this.state.title) === false) {
          alert("Missing field title");
        } else if (validateNull(this.state.description) === false) {
          alert("Missing field description");
        } else if (validateNull(this.state.date) === false) {
          alert("Missing field date");
        }
      }
    }
  }
  handleChangeStatus = (status) => {
    this.setState({ status });
  };
  render() {
    // let d = new Date();
    // var today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    console.log("all data", this.agendaService.getAll().length);

    return (
      <div>
        <h2>Add Agenda</h2>
        <Row>
          <Col xs={5} style={{ margin: "auto" }}>
            <Form onSubmit={this.onAddFormSubmitted.bind(this)}>
              <input type="hidden" value={this.state.flag} />
              <Form.Group className="mb-3">
                <FloatingLabel
                  controlId="floatingInput"
                  style={{
                    textAlign: "left",
                    paddingTop: "30px",
                    paddingBottom: "10px",
                  }}
                >
                  Title
                </FloatingLabel>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  value={this.state.title}
                  onChange={(e) => {
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                />
                <FloatingLabel
                  controlId="floatingInput"
                  style={{
                    textAlign: "left",
                    paddingTop: "30px",
                    paddingBottom: "10px",
                  }}
                >
                  Description
                </FloatingLabel>
                <Form.Control
                  type="text"
                  name="description"
                  placeholder="Enter Description"
                  value={this.state.description}
                  onChange={(e) => {
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                />
                <FloatingLabel
                  controlId="floatingInput"
                  style={{
                    textAlign: "left",
                    paddingTop: "30px",
                    paddingBottom: "10px",
                  }}
                >
                  Status
                </FloatingLabel>

                <Form.Select
                  aria-label="Floating label select example"
                  onChange={(e) => {
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                  value={this.state.status}
                  name="status"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
                <FloatingLabel
                  controlId="floatingInput"
                  style={{
                    textAlign: "left",
                    paddingTop: "30px",
                    paddingBottom: "10px",
                  }}
                >
                  Date
                </FloatingLabel>

                <Form.Control
                  type="date"
                  name="date"
                  placeholder="Enter Date"
                  value={this.state.date}
                  onChange={(e) => {
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                />
              </Form.Group>
              {this.state.mode === "ADD" ? (
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  Update
                </Button>
              )}
              {/* <Button variant="primary" type="submit">
                Submit
              </Button> */}
            </Form>
          </Col>
        </Row>

        <Row style={{ marginTop: "100px" }}>
          <Col xs={10} style={{ margin: "auto" }}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Created at</th>
                  <th>Updated at</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.agendaService.getAll().map((agenda, index) => {
                  if (!agenda) {
                    return null;
                  }

                  return (
                    <tr key={index}>
                      <td>{agenda.id}</td>
                      <td>{agenda.title}</td>
                      <td>{agenda.description}</td>
                      <td>{agenda.status}</td>
                      <td>{agenda.date}</td>{" "}
                      {console.log("create date", agenda.date)}
                      <td>{agenda.createdAt}</td>
                      <td>{agenda.updatedAt}</td>
                      <td>
                        <Button
                          onClick={(e) => {
                            console.log("edit", agenda.title);
                            this.setState({
                              mode: "EDIT",
                              ...agenda,
                            });
                          }}
                        >
                          <AiFillEdit />
                        </Button>{" "}
                        &nbsp;
                        <Button
                          onClick={(e) => {
                            const deletedAgenda = this.agendaService.deleteById(
                              agenda.id
                            );

                            this.setState({ flag: !this.state.flag });
                          }}
                        >
                          <AiFillDelete />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Row>
              <Col>
                <input
                  className="csv-input"
                  type="file"
                  ref={(input) => {
                    this.filesInput = input;
                  }}
                  name="file"
                  placeholder={null}
                  onChange={this.handleChange}
                />

                <button onClick={this.importCSV}> Upload now!</button>
              </Col>
              <Col>
                {this.agendaService.getAll().length > 0 && (
                  <CSVLink
                    target="_blank"
                    data={this.agendaService.getAll()}
                    style={{
                      cursor: "pointer",
                      border: "2px solid gray",
                      textDecoration: "none",
                    }}
                  >
                    Download me
                  </CSVLink>
                )}
              </Col>
            </Row>
            ;
          </Col>
        </Row>
      </div>
    );
  }
}

export default Agenda;