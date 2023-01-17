import { Segmented, Divider, Table, Tag } from 'antd';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';
import { useState } from 'react';
import { SERVER_URL } from '../../config';
import Button from '../Button';

import "./style.css";

const TableList = ({ data, fetchData, fetching }) => {
    const columns = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (_, { status }) => (
                <Tag color={status === 1 ? "#5bad38bb" : status === -1 ? "#ff5500bb" : ""}>
                    {status === 1 && "Accepted"}
                    {status === 0 && "Pending"}
                    {status === -1 && "Rejected"}
                </Tag>
            ),
        },
        {
            title: 'Created at',
            key: 'status',
            dataIndex: 'status',
            render: (_, { created_at }) => (
                <div>
                    {formatTime(created_at)}
                </div>
            ),
        },
        {
            title: 'Updated at',
            key: 'status',
            dataIndex: 'status',
            render: (_, { updated_at }) => (
                <div>
                    {formatTime(updated_at)}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, { id }) => (
                <div className='d-flex align-items-center'>
                    <Button className="btn btn-accept" label="ACCEPT" onClick={() => onAccept(id)} />
                    <span className='divider'>|</span>
                    <Button className="btn btn-reject" label="REJECT" onClick={() => onReject(id)} />
                </div>
            ),
        },
    ];

    const [loading, setLoading] = useState(false);
    const [filterOption, setFilterOption] = useState('All');
    const [selected, setSelected] = useState([]);

    const formatTime = (time) => {
        const date = new Date(Date.parse(time))
        return date.toLocaleString();
    }

    const onAccept = id => {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('user'));
        axios({
            baseURL: SERVER_URL,
            method: "post",
            headers: {
                "Authorization": `jwt=${token.value}`,
            },
            data: {
                status: 1
            },
            url: `/account/update/${id}`
        }).then(res => {
            fetchData();
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        })
    };

    const onReject = id => {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem('user'));
        axios({
            baseURL: SERVER_URL,
            method: "post",
            headers: {
                "Authorization": `jwt=${token.value}`,
            },
            data: {
                status: -1
            },
            url: `/account/update/${id}`
        }).then(res => {
            fetchData();
            setLoading(false);
        }).catch(err => {
            setLoading(false);
        })
    };

    const onItemSelected = (selectedRowKeys, selectedRows) => {
        setSelected(selectedRowKeys);
    }

    const onAcceptAll = () => {
        selected.map(id => onAccept(id));
    }

    const onRejectAll = () => {
        selected.map(id => onReject(id));
    }

    return (
        <div className='table-container'>
            <div className='d-flex align-items-center justify-content-between'>
                <div>
                    <span>Filter: </span>
                    <Segmented
                        options={['All', 'Accepted', 'Rejected', 'Pending']}
                        value={filterOption}
                        onChange={setFilterOption}
                    />
                </div>
                <TailSpin
                    height="30"
                    width="30"
                    color="#0077ff"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    visible={loading || fetching}
                />
                <div>
                    <span>{selected.length} items selected</span>
                    <span className='divider'>|</span>
                    <Button className="btn btn-accept" label="ACCEPT SELECTED" onClick={onAcceptAll} />
                    <span className='divider'>|</span>
                    <Button className="btn btn-reject" label="REJECT SELECTED" onClick={onRejectAll} />
                </div>
            </div>
            <Divider />
            <Table
                rowSelection={{
                    type: "checkbox",
                    onChange: onItemSelected
                }}
                columns={columns}
                dataSource={data.filter(d => {
                    switch (filterOption) {
                        case "Accepted":
                            return d.status === 1;
                        case "Rejected":
                            return d.status === -1;
                        case "Pending":
                            return d.status === 0;
                        default:
                            return true
                    }
                })}
            />
        </div>
    )
};
export default TableList;