import React from "react";
import { Form, Button, Container } from "react-bootstrap";

export default function SendSMS({ sendSMSMessage }) {

    function handleChange(element) {
        // console.log(element.target.value.length)
        let messageLength = element.target.value.length
        let statusElement = document.getElementById("charCounter")
        let message;
        if (messageLength <= 160) {
            message = `${messageLength}/160 used`;
        } else {
            message = `A multiple of <strong>${Math.ceil(messageLength / 160)}</strong> messages`;
        }

        statusElement.innerHTML = message
    }

    function handleSubmit(element) {
        element.preventDefault()
        // console.log("We are trying to send SMS using these data: ", element)
        sendSMSMessage(element);
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
            }} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicFrom">
                    <Form.Label>Use this form to send SMS</Form.Label>
                    <Form.Control required type="text" placeholder="from" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicTo">
                    <Form.Control required type="text" placeholder="To" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicTO">
                    <Form.Control required as="textarea" type="textarea" placeholder="Message" onChange={handleChange} />
                    <Form.Text className="text-muted" id="charCounter">
                        0/160 used
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