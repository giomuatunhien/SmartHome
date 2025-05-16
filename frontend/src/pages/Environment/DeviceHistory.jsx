import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeviceHistory.css';

const PAGE_SIZE = 3;

const DeviceHistoryPage = () => {
    const navigate = useNavigate();
    // Fan history state
    const [fanHistory, setFanHistory] = useState([]);
    const [fanPage, setFanPage] = useState(1);
    const [fanTotalPages, setFanTotalPages] = useState(1);
    // Light history state
    const [lightHistory, setLightHistory] = useState([]);
    const [lightPage, setLightPage] = useState(1);
    const [lightTotalPages, setLightTotalPages] = useState(1);

    const fetchHistory = async (deviceModel, page, setData, setTotal) => {
        try {
            const res = await fetch(
                `http://localhost:3001/device/getDeviceHistory?deviceModel=${deviceModel}&page=${page}&limit=${PAGE_SIZE}`,
                { credentials: 'include' }
            );

            const result = await res.json();
            if (res.ok && result.success) {
                //console.log(result.data)
                setData(result.data);
                setTotal(result.pagination.totalPages);
            } else {
                console.error(`Failed to load ${deviceModel} history:`, result.message);
            }
        } catch (err) {
            console.error(`Error fetching ${deviceModel} history:`, err);
        }
    };

    useEffect(() => {
        fetchHistory('fan', fanPage, setFanHistory, setFanTotalPages);
        const intervalId = setInterval(() => fetchHistory('fan', fanPage, setFanHistory, setFanTotalPages), 1000);
        return () => clearInterval(intervalId);
    }, [fanPage]);

    useEffect(() => {
        fetchHistory('light', lightPage, setLightHistory, setLightTotalPages);
        const intervalId = setInterval(() => fetchHistory('light', lightPage, setLightHistory, setLightTotalPages), 1000);
        return () => clearInterval(intervalId);
    }, [lightPage]);

    return (
        <main className="history-page">
            <header>
                <h1>Device History</h1>
                <button onClick={() => navigate('/environment')} className="back-btn">← Quay lại</button>
            </header>

            <section className="history-section">
                <h2>Quạt trần</h2>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Người thao tác</th>
                            <th>Hành động</th>
                            <th>Ghi chú</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fanHistory.map(item => (
                            <tr key={item._id}>
                                <td>{item.userId?.fullname || '---'}</td>
                                <td>{item.action === 'On' ? 'Bật' : item.action === 'Off' ? 'Tắt' : 'Thất bại'}</td>
                                <td>{item.notes || '---'}</td>
                                <td>{new Date(item.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => setFanPage(p => Math.max(p - 1, 1))} disabled={fanPage === 1}>
                        ‹ Prev
                    </button>
                    <span>Trang {fanPage} / {fanTotalPages}</span>
                    <button onClick={() => setFanPage(p => Math.min(p + 1, fanTotalPages))} disabled={fanPage === fanTotalPages}>
                        Next ›
                    </button>
                </div>
            </section>

            <section className="history-section">
                <h2>Đèn</h2>
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Người thao tác</th>
                            <th>Hành động</th>
                            <th>Ghi chú</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lightHistory.map(item => (
                            <tr key={item._id}>
                                <td>{item.userId?.fullname || '---'}</td>
                                <td>{item.action === 'On' ? 'Bật' : item.action === 'Off' ? 'Tắt' : 'Thất bại'}</td>
                                <td>{item.notes || '---'}</td>
                                <td>{new Date(item.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <button onClick={() => setLightPage(p => Math.max(p - 1, 1))} disabled={lightPage === 1}>
                        ‹ Prev
                    </button>
                    <span>Trang {lightPage} / {lightTotalPages}</span>
                    <button onClick={() => setLightPage(p => Math.min(p + 1, lightTotalPages))} disabled={lightPage === lightTotalPages}>
                        Next ›
                    </button>
                </div>
            </section>
        </main>
    );
};

export default DeviceHistoryPage;
