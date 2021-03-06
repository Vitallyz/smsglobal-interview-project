import ListGroup from 'react-bootstrap/ListGroup';
import { Form, Button, Container, CloseButton, Card } from 'react-bootstrap';


export default function Settings({ activeKey, APIKeys, updateActiveKey, addAPIKey, deleteKeyFromDB }) {
    function handleSubmit(element) {
        element.preventDefault();
        // console.log(element.target[0].value)
        addAPIKey(element)
    }

    function deleteKey(event) {
        // console.log("Deleting from DB api key id: ", event.target.value)
        deleteKeyFromDB(event.target.value)
    }

    if (activeKey && APIKeys)
        return (
            <><Container
                style={{
                    width: "800px",
                    display: "block",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Form style={{ width: 400 }} onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Add API Key</Form.Label>
                        <Form.Control type="Name" name="Name" placeholder="Name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAPIKey">
                        <Form.Control type="APIKey" name="API Key" placeholder="API Key" />
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicSecret">
                        <Form.Control type="password" name="Secret" placeholder="Secret" />
                    </Form.Group>
                    <Button variant="primary" type="Add">
                        Add
                    </Button>
                </Form>
                <hr style={{ width: 550 }}></hr>
                <ListGroup style={{ width: 550 }}>
                    {APIKeys.map((apikey, key) => (<ListGroup.Item key={key}
                        value={apikey.id}
                        active={activeKey.id == apikey.id}>
                        <span style={{ display: "inline-block", width: 400 }}><strong>{apikey.name}:</strong> {apikey.key}</span>
                        <span style={{ display: "inline-block", width: 80 }}><Button size='sm'
                            variant='outline-primary'
                            hidden={(apikey.id == activeKey.id)}
                            value={apikey.id}
                            onClick={updateActiveKey}>Select
                        </Button></span>
                        <CloseButton hidden={(apikey.id == activeKey.id)}
                            aria-label="Delete"
                            alt="Delete Key"
                            value={apikey.id}
                            onClick={deleteKey} />
                    </ListGroup.Item>))}
                </ListGroup>
            </Container>
            </>
        );
    else return <div> still rendering settings page</div>

}