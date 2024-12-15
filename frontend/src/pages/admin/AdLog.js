import React, { useState, useEffect } from "react";
//component
import AdSidebar from '../../components/admin/AdSidebar';
//service
import { getLogs } from "../../services/logService";

const AdLog = () => {
    const [logs, setLogs] = useState([])

    const fetchLog = async () => {
        const response = await getLogs();
        if(response.success)
            setLogs(response.logs)
    }

    useEffect(() => {
        fetchLog();
    })

    return (
        <div className="d-flex">
            <AdSidebar />
            <div className="container">
                <div className="d-flex justify-content-between">
                    <h3 className="h3">Kiểm tra Log</h3>
                    <select className="w-25 form-select">
                        <option value="all">Tất cả</option>
                        <option value="active">Người dùng</option>
                        <option value="lock">Quản trị</option>
                    </select>
                </div>

                <table className="table table-hover mt-4">
                    <thead className="thead-light">
                        <tr>
                            <th>Thời gian</th>
                            <th>Hành động</th>
                            <th>Người dùng</th>
                            <th>Mô tả</th>

                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(logs) ? (
                            logs.map((log, index) => (
                                <tr key={log._id}>
                                    <td>{new Date(log.createdAt).toLocaleString()}</td>
                                    <td className="fw-bold">{log.action}</td>
                                    <td className={`${log.user.role === 1 && 'text-danger'}`}>{log.user.role === 0 ?'Người dùng ' : 'Quản trị: '}{log.user.fullName}
                                        <p className="small text-dark"><i>{log.user.email}</i></p>
                                    </td>
                                    <td>{log.description}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-danger">Không có dữ liệu</td>
                            </tr>
                        )}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default AdLog