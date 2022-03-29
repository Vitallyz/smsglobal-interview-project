import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Crypto from 'crypto-js';

import './App.css';
import Settings from "./components/settings";
import SendSMS from "./components/sendsms";
import Report from "./components/report";

const DB_ADDRESS = "http://localhost:3020/";

const uri = "/v2/sms/";
const host = "api.smsglobal.com";
const port = 80;


function App() {
  let activeKeyID;

  const [activeKey, setActiveKey] = useState();
  const [APIKeys, setAPIKeys] = useState();

  const [smsData, setSMSData] = useState();

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
    console.log("Loading page, APIKeys: ", APIKeys)
    getActiveKeyFromDB();


  }, []);

  function updateKey(key) {
    console.log("Updating key in database. Key is: ", key.target.value);
    axios.patch(DB_ADDRESS + "activekey", { id: key.target.value })
    activeKeyID = key.target.value;
    setSMSData();
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

  function getAuthHeader(requestMethod) {
    console.log("trying to construct Auth Header. ActiveKey is: ", activeKey)
    let id = activeKey.key;
    let ts = Math.floor(new Date().getTime() / 1000);
    let nonce = getNonce(10);
    let method = requestMethod;

    let strings = [ts, nonce, method, uri, host, port];
    let macString = strings.join('\n') + "\n\n";
    console.log("macString is: ", macString);
    let macHash = Crypto.HmacSHA256(macString, activeKey.secret);
    let macBase64 = Crypto.enc.Base64.stringify(macHash);

    return `MAC id="${id}", ts="${ts}", nonce="${nonce}", mac="${macBase64}"`;

  }


   

  function getNonce(length) {
    let nonce = "";
    let charOptions = "qazwsxedcrfvtgbyhnujmikolpQAZWSXEDCRFVTGBYHNUJMIKOLP1234567890";
    for(let i = 0; i < length; i++) {
      nonce += charOptions.charAt(Math.floor(Math.random() * charOptions.length));
    }
    console.log("Nonce this time is: ", nonce);
    return nonce;
  }

  function handleRequestSMSData () {
    console.log("Requesting SMS data from server! with Key and Secret: ", activeKey.key, activeKey.secret)
    let method = "GET";
    let authHeader = getAuthHeader(method);
    console.log("authHeader is: ", authHeader)
    let data = {};
    let headers = "";

    axios({
      url: `http://${host}${uri}`,
      method,
      data,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...headers
      }
    })
    .then(response => {
      console.log("Successfully got SMS data from server: ", response.data.messages)
      setSMSData(response.data.messages)
    })
    .catch(error => {
      console.log("Error getting SMS Data from server", error);
    });
  }

  function handleRequestSendSMSMessage(smsData){
    let outNumber = smsData.target[0].value;
    let inNumber = smsData.target[1].value;
    let message = smsData.target[2].value;

    console.log("Sending SMS message request to server! with Key and Secret: ", activeKey.key, activeKey.secret)
    let method = "POST";
    let authHeader = getAuthHeader(method);
    console.log("authHeader is: ", authHeader)
    let data = { message:message, origin:outNumber, destination:inNumber };
    let headers = "";

    axios({
      url: `http://${host}${uri}`,
      method,
      data,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...headers
      }
    })
    .then(response => {
      console.log("Successfully sent SMS message to server with response: ", response)
      setSMSData()
    })
    .catch(error => {
      console.log("Error sending SMS message to server", error);
    });
  }


  return (
    <>
      <Container
        style={{
          width: "800px",
          display: "block",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <Navbar bg="light" variant="light" >
          <Container>
            {/* <Navbar.Brand href="/">SMSGlobal</Navbar.Brand> */}
            <Nav className="me-auto" defaultActiveKey="/settings">
              <Nav.Link  as={Link} to="/settings">Setings</Nav.Link>
              <Nav.Link as={Link} to="/sendsms">Send SMS</Nav.Link>
              <Nav.Link as={Link} to="/report">Report</Nav.Link>
            </Nav>
          </Container>
        </Navbar>



        <Routes >
          <Route path="/" element={<Settings activeKey={activeKey} APIKeys={APIKeys} updateActiveKey={updateKey} addAPIKey={addAPIKey} deleteKeyFromDB={deleteKey} /> } />
          <Route path="settings" element={<Settings activeKey={activeKey} APIKeys={APIKeys} updateActiveKey={updateKey} addAPIKey={addAPIKey} deleteKeyFromDB={deleteKey} />} />
          <Route path="sendsms" element={<SendSMS sendSMSMessage={handleRequestSendSMSMessage}/>} />
          <Route path="report" element={<Report activeKey={activeKey} requestSMSData={handleRequestSMSData} smsData={smsData}/>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
