import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar, Line } from 'react-chartjs-2';
import AdSidebar from '../../components/admin/AdSidebar';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

//service
import { getReportToday, getRevenueWeek, getUsersWeek } from "../../services/reportService";


ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [revenue, setRevenue] = useState();
    const [revenueData, setRevenueData] = useState([]);
    const [revenueTotal, setRevenueTotal] = useState();
    const [user, setUser] = useState();
    const [usersData, setUsersData] = useState([]);
    const [userTotal, setUserTotal] = useState();
    const [orders, setOrders] = useState();
    const [bookSales, setBookSales] = useState();

    const getWeekRange = (currentDate) => {
        const startOfWeek = new Date(currentDate); // Bắt đầu bằng ngày hiện tại
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Chủ Nhật

        const endOfWeek = new Date(currentDate); // Kết thúc bằng ngày hiện tại
        endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay())); // Thứ Bảy

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm số 0 nếu cần
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng, thêm 1 vì tháng bắt đầu từ 0
            const year = date.getFullYear(); // Lấy năm
        
            return `${day}/${month}/${year}`;
        };

        return {
            startOfWeek: formatDate(startOfWeek),
            endOfWeek: formatDate(endOfWeek),
        };
    };

    
    const today = new Date();
    const { startOfWeek, endOfWeek } = getWeekRange(today);

    const getReport = async () => {
        const response = await getReportToday();
        setRevenue(response.totalRevenue)
        setUser(response.users)
        setOrders(response.orders)
        setBookSales(response.bookSalesCount)
    }

    const getRevenueWeekData = async (req, res) => {
        const response = await getRevenueWeek();
        setRevenueData(response.revenueByDay)
        setRevenueTotal(response.totalRevenue)
    }
    const getUserWeekData = async (req, res) => {
        const response = await getUsersWeek();
        setUsersData(response.userRegistrationsByDay)
        setUserTotal(response.totalRegistrations)
    }

    useEffect(() => {
        getReport();
        getRevenueWeekData();
        getUserWeekData();
    }, [])

    const chartData = {
        labels: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        datasets: [
            {
                label: '(tài khoản)',
                data: usersData,
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
                text: 'Người dùng',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Đảm bảo các bước chia trục y là số nguyên
                    callback: function(value) {
                        return Number.isInteger(value) ? value : ''; // Chỉ hiển thị giá trị nguyên
                    }
                },
            },
        },
    };
    

    //Line

    const lineChartData = {
        labels: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'], // Giả sử đây là các ngày trong tuần
        datasets: [
            {
                label: '(VNĐ)',
                data: revenueData,
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="d-flex">
            <AdSidebar />
            <main className="container my-4  p-6">
                <h5 className="display-4 ">Bảng điều khiển</h5>
                <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded shadow-sm">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-chart-bar text-primary me-2"></i>
                        <p className="mb-0 text-secondary fw-bold">Thống kê</p>
                    </div>
                    <select
                        className="form-select w-auto border-primary text-primary fw-bold"
                        style={{ maxWidth: "200px" }}

                    >
                        <option value="today">Hôm nay</option>
                        <option value="today">Hôm qua</option>
                    </select>
                </div>

                <div className="row g-4 mt-3">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Doanh thu</p>
                                <p className="h4 fw-bold">{formatCurrency(revenue)}</p>
                                <Link><p className="text-success mb-0">Chi Tiết</p></Link>

                            </div>
                            <div className="bg-dark p-3 rounded-circle" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-briefcase text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Đơn Hàng</p>
                                <p className="h4 fw-bold">{orders}</p>
                                <Link><p className="text-success mb-0">Chi Tiết</p></Link>
                            </div>
                            <div className="bg-dark p-3 rounded-circle" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-chart-bar text-white"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Người Dùng</p>
                                <p className="h4 fw-bold">{user}</p>
                                <Link><p className="text-success mb-0">Chi Tiết</p></Link>
                            </div>
                            <div className="bg-dark p-3 rounded-circle" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-user text-white"></i>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Số sách đang bán</p>
                                <p className="h4 fw-bold">{bookSales}</p>
                                <p className="text-success mb-0"><hr /></p>
                            </div>
                            <div className="bg-dark p-3 rounded-circle w-500" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-book text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid mt-4">
                    <div className="row">
                        <div className="col-lg-4 col-md-6 mt-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="mb-0">{startOfWeek} - {endOfWeek}</h6>

                                    <div className="pe-2">
                                        <div className="chart">
                                            <Bar data={chartData} options={chartOptions} height={250} />
                                        </div>
                                    </div>
                                    <hr className="dark horizontal" />
                                    <div className="d-flex">
                                        <p className="mb-0 text-sm">Số người dùng đăng kí tuần này: <span className="text-danger">{userTotal}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mt-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                <h6 className="mb-0">Doanh thu tuần</h6>
                                    <div className="pe-2">
                                        <div className="chart" style={{ height: '250px' }}>
                                            <Line data={lineChartData} options={lineChartOptions} />
                                        </div>
                                    </div>
                                    <hr className="dark horizontal" />
                                    <div className="d-flex">
                                    <p className="mb-0 text-sm">Tổng doanh thu tuần này: <span className="text-danger">{formatCurrency(revenueTotal)}</span></p>
                                   
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