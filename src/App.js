import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

import './App.css';
import Settings from "./components/settings";
import SendSMS from "./components/sendsms";
import Report from "./components/report";

const DB_ADDRESS = "http://localhost:3020/";


function App() {
  let activeKeyID;

  const [activeKey, setActiveKey] = useState();
  const [APIKeys, setAPIKeys] = useState();

  function getReportData() {

  }



  function getActiveKeyFromDB() {
    axios.get(DB_ADDRESS + 'activekey')
      .then(response => {
        activeKeyID = response.data.id;
        getKeyDataFromDB()
      })
      .catch(error => {
        console.log("Error grabing API Keys data from JSON server: ", error);
      })
  }

  function getKeyDataFromDB() {
    return axios.get(DB_ADDRESS + 'apikeys')
      .then(response => {
        setAPIKeys(response.data);
        console.log("Response from db: ", response.data)
        console.log("Active Key ID: ", activeKeyID)
        if (!activeKeyID) {
          console.log("Did not find data for id: ", activeKey)
          activeKeyID = response.data[0].id;
        }

        setActiveKey(response.data.filter(key => key.id == activeKeyID)[0]);

      })
  }

  useEffect(() => {
    getActiveKeyFromDB();
  }, []);

  function updateKey(key) {
    console.log("Updating key in database. Key is: ", key.target.value);
    axios.patch(DB_ADDRESS + "activekey", { id: key.target.value })
    activeKeyID = key.target.value;
    getKeyDataFromDB();
  }

  function addAPIKey(event) {

    let apiKeyObject = {
      name: event.target[0].value,
      key: event.target[1].value,
      secret: event.target[2].value
    }

    console.log("Adding new key for name and apikey: ", apiKeyObject);

    axios.post(DB_ADDRESS + 'apikeys', apiKeyObject)
      .then(response => {
        console.log("Response from db insert, id: ", response.data.id);
        // setActiveKey(response.data.id);
        console.log("Setting active key to: ", response.data.id)
        axios.patch(DB_ADDRESS + "activekey", { id: response.data.id })
          .then(response => {
            console.log("Finished Setting active key and got response: ", response)
            setActiveKey(response.data.id)
            getActiveKeyFromDB()
          })

      })
      .catch(error => {
        console.log("Error ADDING API Key data to JSON server: ", error);
      });
  }

  function deleteKey(key_id) {
    axios.delete(DB_ADDRESS + "apikeys/" + key_id)
      .then(response => {
        console.log("deleted, response data is: ", response);
        getActiveKeyFromDB();
      })
  }


  return (
    <>
      <Container
        style={{
          width: "600px",
          display: "block",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <Navbar bg="light" variant="light">
          <Container>
            {/* <Navbar.Brand href="/">SMSGlobal</Navbar.Brand> */}
            <Nav className="me-auto">
              <Nav.Link href="/settings">Setings</Nav.Link>
              <Nav.Link href="/sendsms">Send SMS</Nav.Link>
              <Nav.Link href="/report">Report</Nav.Link>
            </Nav>
          </Container>
        </Navbar>



        <Routes >
          {/* <Route path="/" element={<Settings />} /> */}
          <Route path="settings" element={<Settings activeKey={activeKey} APIKeys={APIKeys} updateActiveKey={updateKey} addAPIKey={addAPIKey} deleteKeyFromDB={deleteKey} />} />
          <Route path="sendsms" element={<SendSMS />} />
          <Route path="report" element={<Report />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
