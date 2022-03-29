import React, { useEffect } from "react";
import { Table } from "react-bootstrap";

export default function Report({ activeKey, requestSMSData, smsData }) {

    useEffect(() => {
        if (activeKey && !smsData) {
            requestSMSData();
        }
    });

    if (smsData) {
        return (
            <>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Message</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>{smsData.map((dataRow, key) => (
                        <tr key={key}>
                            <td>{dataRow.dateTime}</td>
                            <td>{dataRow.origin}</td>
                            <td>{dataRow.destination}</td>
                            <td>{dataRow.message}</td>
                            <td>{dataRow.status}</td>
                        </tr>))}
                    </tbody>
                </Table>
            </>

        );
    } else {
        return (
            <div> still rendering reports page</div>
        );

    }

}