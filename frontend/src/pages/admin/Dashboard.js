import React from "react";
import { Bar, Line } from 'react-chartjs-2';
import AdSidebar from '../../components/admin/AdSidebar';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    //Bar
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Website Views',
                data: [500, 700, 800, 1000, 950, 1200, 1100], // Dữ liệu cụ thể
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Website Views',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    //Line

    const lineChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Giả sử đây là các ngày trong tuần
        datasets: [
            {
                label: 'Sales',
                data: [120, 190, 170, 210, 240, 220, 260], // Dữ liệu bán hàng giả lập
                fill: true,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                tension: 0.4, // Làm đường biểu đồ mềm hơn
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#666',
                },
            },
            x: {
                ticks: {
                    color: '#666',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    };


    return (
        <div className="d-flex">
            <AdSidebar />
            <main className="container my-4  p-6">
                <h5 className="display-4 ">Bảng điều khiển</h5>
                <p className="text-secondary">Thống kê</p>
                <div className="row g-4 mt-3">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Today's Money</p>
                                <p className="h4 fw-bold">$53k</p>
                                <p className="text-success mb-0">+55% than last week</p>
                            </div>
                            <div className="bg-dark p-3 rounded-circle" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-briefcase text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Today's Users</p>
                                <p className="h4 fw-bold">2300</p>
                                <p className="text-success mb-0">+3% than last month</p>
                            </div>
                            <div className="bg-dark p-3 rounded-circle" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-user text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Ads Views</p>
                                <p className="h4 fw-bold">3,462,000</p>
                                <p className="text-danger mb-0">-2% than yesterday</p>
                            </div>
                            <div className="bg-dark p-3 rounded-circle" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-chart-bar text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Sales</p>
                                <p className="h4 fw-bold">$103,430,000,000</p>
                                <p className="text-success mb-0">+5% than yesterday</p>
                            </div>
                            <div className="bg-dark p-3 rounded-circle w-500" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-briefcase text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid mt-4">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 mt-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-0">Website Views</h6>
                                    <p className="text-sm">Last Campaign Performance</p>
                                    <div className="pe-2">
                                        <div className="chart">
                                            <Bar data={chartData} options={chartOptions} height={250} />
                                        </div>
                                    </div>
                                    <hr className="dark horizontal" />
                                    <div className="d-flex">
                                        <i className="material-symbols-rounded text-sm my-auto me-1">schedule</i>
                                        <p className="mb-0 text-sm">campaign sent 2 days ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mt-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-0">Daily Sales</h6>
                                    <p className="text-sm">
                                        (<span className="font-weight-bolder">+15%</span>) increase in today sales.
                                    </p>
                                    <div className="pe-2">
                                        <div className="chart" style={{ height: '250px' }}>
                                            <Line data={lineChartData} options={lineChartOptions} />
                                        </div>
                                    </div>
                                    <hr className="dark horizontal" />
                                    <div className="d-flex">
                                        <i className="material-symbols-rounded text-sm my-auto me-1">schedule</i>
                                        <p className="mb-0 text-sm">updated 4 min ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mt-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-0">Daily Sales</h6>
                                    <p className="text-sm">
                                        (<span className="font-weight-bolder">+15%</span>) increase in today sales.
                                    </p>
                                    <div className="pe-2">
                                        <div className="chart" style={{ height: '250px' }}>
                                            <Line data={lineChartData} options={lineChartOptions} />
                                        </div>
                                    </div>
                                    <hr className="dark horizontal" />
                                    <div className="d-flex">
                                        <i className="material-symbols-rounded text-sm my-auto me-1">schedule</i>
                                        <p className="mb-0 text-sm">updated 4 min ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex gap-4">
                    <div className="col bg-white p-3 rounded shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="h6 fw-semibold">Sách bán chạy</h2>
                            <span className="text-secondary">Tuần này</span>
                        </div>
                        <table className="table">
                            <thead>
                                <tr className="text-secondary">
                                    <th scope="col">#</th>
                                    <th scope="col">Sách</th>
                                    <th scope="col">Số lượt bán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { id: 1, url: 'Shofy - Multipurpose eCommerce Laravel Script', views: 141 },
                                    { id: 2, url: 'MartFury - Laravel Ecommerce system', views: 56 },
                                    { id: 3, url: 'Ninico - Minimal eCommerce', views: 47 },
                                    { id: 4, url: 'Web & App developer', views: 44 },
                                    { id: 5, url: 'Showcasing Creative Designs and Innovative Projects', views: 35 },
                                    { id: 6, url: 'Farmart - Laravel Ecommerce system', views: 32 },
                                    { id: 7, url: 'Homzen', views: 32 },
                                    { id: 8, url: 'Nest - Laravel Multipurpose eCommerce Script', views: 28 },
                                    { id: 9, url: 'Flex Home', views: 26 },
                                    { id: 10, url: 'Login', views: 24 },
                                ].map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td className="text-primary">
                                            {item.url} <i className="fas fa-external-link-alt"></i>
                                        </td>
                                        <td>{item.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col bg-white p-3 rounded shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="h6 fw-semibold">Top Browsers</h2>
                            <span className="text-secondary">Today</span>
                        </div>
                        <table className="table">
                            <thead>
                                <tr className="text-secondary">
                                    <th scope="col">#</th>
                                    <th scope="col">BROWSER</th>
                                    <th scope="col">SESSIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { id: 1, browser: 'Chrome', sessions: 284 },
                                    { id: 2, browser: 'Safari', sessions: 27 },
                                    { id: 3, browser: 'Edge', sessions: 19 },
                                    { id: 4, browser: 'Firefox', sessions: 18 },
                                    { id: 5, browser: 'Opera', sessions: 17 },
                                    { id: 6, browser: 'Samsung Internet', sessions: 2 },
                                    { id: 7, browser: 'Safari (in-app)', sessions: 1 },
                                ].map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.browser}</td>
                                        <td>{item.sessions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
export default Dashboard