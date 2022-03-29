import React from "react";
import { Form, Button, Container } from "react-bootstrap";

export default function SendSMS({ sendSMSRequest }) {

    function handleChange(element){
        // console.log(element.target.value.length)
        let messageLength = element.target.value.length
        let statusElement = document.getElementById("charCounter")
        let message;
        if(messageLength < 160){
            message = `${messageLength}/160 used`;
        } else {
            message = `A multiple of <strong>${Math.ceil(messageLength/160)}</strong> messages`;
        }
                
        statusElement.innerHTML = message 
    }


    return (
        <><Container
            style={{
                width: "800px",
                display: "block",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <Form style={{
                width: "400px",
                display: "block",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <Form.Group className="mb-3" controlId="formBasicFrom">
                    <Form.Label>Use this form to send SMS</Form.Label>
                    <Form.Control required type="text" placeholder="from" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicTo">
                    <Form.Control type="text" placeholder="To" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicTO">
                    <Form.Control as="textarea" type="textarea" placeholder="Message" onChange={handleChange}/>
                    <Form.Text className="text-muted" id="charCounter">
                        We will count your characters
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Send
                </Button>
            </Form>
        </Container>
        </>
    );

}