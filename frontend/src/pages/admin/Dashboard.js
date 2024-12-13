import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bar, Line } from 'react-chartjs-2';
import AdSidebar from '../../components/admin/AdSidebar';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';

//service
import { getReportToday, getReport, getRevenueWeek, getUsersWeek, getOrdersWeek, getTopBooks, getTopCustomers } from "../../services/reportService";


ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    

    const [revenue, setRevenue] = useState();
    const [revenueData, setRevenueData] = useState([]);
    const [revenueTotal, setRevenueTotal] = useState();
    const [user, setUser] = useState();
    const [usersData, setUsersData] = useState([]);
    const [userTotal, setUserTotal] = useState();
    const [orders, setOrders] = useState();
    const [ordersData, setOrdersData] = useState([]);
    const [ordersWeekCount, setOrdersWeekCount] = useState();
    const [ordersCompletedData, setOrdersCompletedData] = useState([]);
    const [ordersCompletedWeekCount, setOrdersCompletedWeekCount] = useState();
    const [bookSales, setBookSales] = useState();

    const [topBooks, setTopBooks] = useState([])
    const [topCustomers, setTopCustomers] = useState([])

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const formattedDate = today.toLocaleDateString('en-CA');

    const year = today.getFullYear();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString("en-CA"); // Ngày đầu tiên
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toLocaleDateString("en-CA"); // Ngày cuối cùng

    const currentQuarter = Math.ceil(currentMonth / 3); // Quý = làm tròn lên của (tháng / 3)

    // Tính tháng bắt đầu và kết thúc của quý
    const startMonth = (currentQuarter - 1) * 3; // Tháng bắt đầu: 0, 3, 6, 9
    const endMonth = startMonth + 2; // Tháng kết thúc: 2, 5, 8, 11

    // Tính ngày bắt đầu và ngày kết thúc của quý hiện tại
    const startOfQuarter = new Date(year, startMonth, 1).toLocaleDateString("en-CA"); // Ngày đầu tiên
    const endOfQuarter = new Date(year, endMonth + 1, 0).toLocaleDateString("en-CA");

    const [date, setDate] = useState({
        startDate: formattedDate,
        endDate: formattedDate
    })
    const [monthTopBook, setMonthTopBook] = useState({
        startOfMonth,
        endOfMonth
    })
    const [quarterTopCustomer, setQuarterTopCustomer] = useState({
        startOfQuarter,
        endOfQuarter,
    })

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedQuarter, setSelectedQuarter] = useState(currentQuarter);

    const handleMonthChange = (e) => {
        const selectedMonth = parseInt(e.target.value, 10);
        setSelectedMonth(selectedMonth);
        const year = today.getFullYear(); // Lấy năm hiện tại

        // Tính ngày bắt đầu và kết thúc của tháng
        const startOfMonth = new Date(year, selectedMonth - 1, 1).toISOString().split("T")[0]; // Ngày đầu tiên
        const endOfMonth = new Date(year, selectedMonth, 0).toISOString().split("T")[0]; // Ngày cuối cùng

        // Cập nhật state
        setMonthTopBook({
            startOfMonth,
            endOfMonth,
        });

    };

    const handleQuarterChange = (e) => {
        const selectedQuarter = parseInt(e.target.value, 10); // Lấy quý được chọn
        setSelectedQuarter(selectedQuarter);
        const year = today.getFullYear(); // Lấy năm hiện tại

        // Xác định tháng bắt đầu và kết thúc của quý
        const startMonth = (selectedQuarter - 1) * 3; // Tháng bắt đầu: 0, 3, 6, 9
        const endMonth = startMonth + 2; // Tháng kết thúc: 2, 5, 8, 11

        // Tính ngày bắt đầu và ngày kết thúc của quý
        const startOfQuarter = new Date(year, startMonth, 1).toISOString().split("T")[0]; // Ngày đầu tiên của quý
        const endOfQuarter = new Date(year, endMonth + 1, 0).toISOString().split("T")[0]; // Ngày cuối cùng của quý

        // Cập nhật state
        setQuarterTopCustomer({
            startOfQuarter,
            endOfQuarter,
        });
    };


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

    const { startOfWeek, endOfWeek } = getWeekRange(today);

    const handleChangeDate = (e) => {
        const value = e.target.value;
        const today = new Date();

        if (value === "today") {
            const formattedDate = today.toLocaleDateString('en-CA'); // Định dạng YYYY-MM-DD
            setDate({ startDate: formattedDate, endDate: formattedDate }); // Gán "Hôm nay"
        } else if (value === "yesterday") {
            today.setDate(today.getDate() - 1); // Lùi ngày 1 ngày
            const formattedDate = today.toLocaleDateString('en-CA'); // Định dạng YYYY-MM-DD
            setDate({ startDate: formattedDate, endDate: formattedDate }); // Gán "Hôm qua"
        }
    };


    const getReportShow = async () => {
        const response = await getReport(date);
        setRevenue(response.totalRevenue)
        setUser(response.users)
        setOrders(response.orders)
        setBookSales(response.totalQuantity)
    }
    const getTopBookInMonth = async () => {
        const response = await getTopBooks(monthTopBook);
        setTopBooks(response)
    }
    const getTopCustomersInQuarter = async () => {
        const dataQuarter = {startOfYear: quarterTopCustomer.startOfQuarter, endOfYear: quarterTopCustomer.endOfQuarter}
        const response = await getTopCustomers(dataQuarter)
        setTopCustomers(response)
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
    const getOrderWeekData = async (req, res) => {
        const response = await getOrdersWeek();
        setOrdersData(response.totalOrders.orderCountByDay)
        setOrdersWeekCount(response.totalOrders.totalCount)
        setOrdersCompletedData(response.completedOrders.orderCountByDay)
        setOrdersCompletedWeekCount(response.completedOrders.totalCount)
    }


    useEffect(() => {
        getReportShow();
    }, [date])
    useEffect(() => {
        getTopBookInMonth();
    }, [monthTopBook])
    useEffect(() => {
        getTopBookInMonth();
    }, [monthTopBook])
    useEffect(() => {
       getTopCustomersInQuarter();
    }, [quarterTopCustomer])

    useEffect(() => {
        // getTopBookInMonth();
        getRevenueWeekData();
        getUserWeekData();
        getOrderWeekData();
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
                    callback: function (value) {
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

    const lineChartTooltipData = {
        labels: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        datasets: [
            {
                label: "tất cả",
                data: ordersData,
                borderColor: "#42a5f5",
                backgroundColor: "rgba(66, 165, 245, 0.5)",
                pointStyle: "rectRounded", // Kiểu điểm: hình chữ nhật bo góc
                pointRadius: 6, // Bán kính điểm
                pointHoverRadius: 8, // Bán kính khi hover
                pointBackgroundColor: "#42a5f5",
                pointBorderColor: "#fff",
                tension: 0.4, // Làm mượt đường nối
            },
            {
                label: "hoàn thành",
                data: ordersCompletedData,
                borderColor: "#66bb6a",
                backgroundColor: "rgba(102, 187, 106, 0.5)",
                pointStyle: "triangle", // Kiểu điểm: hình tam giác
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: "#66bb6a",
                pointBorderColor: "#fff",
                tension: 0.4,
            },
        ],
    };

    // Tùy chỉnh Tooltip
    const lineChartTooltipOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw;
                        return `đơn: ${value}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(200, 200, 200, 0.2)",
                },
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
                        onChange={handleChangeDate}

                    >
                        <option value="today">Hôm nay</option>
                        <option value="yesterday">Hôm qua</option>
                    </select>
                </div>

                <div className="row g-4 mt-3">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="bg-white p-4 rounded shadow-sm d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-primary mb-1">Doanh thu</p>
                                <p className="h4 fw-bold">{formatCurrency(revenue)}</p>
                                <p className="text-success mb-0"><hr /></p>
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
                                <p className="text-success mb-0"><hr /></p>
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
                                <p className="text-success mb-0"><hr /></p>
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
                                <p className="text-primary mb-1">Số sách được đặt</p>
                                <p className="h4 fw-bold">{bookSales}</p>
                                <p className="text-success mb-0"><hr /></p>
                                <Link><p className="text-success mb-0">Chi Tiết</p></Link>
                            </div>
                            <div className="bg-dark p-3 rounded-circle w-500" style={{ width: '50px', height: '50px' }}>
                                <i className="fas fa-book text-white"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <h6 className="mt-5 h6">Thống kê tuần ({startOfWeek} - {endOfWeek})</h6>
                <div className="container-fluid ">
                    <div className="row d-flex align-items-stretch">
                        <div className="col-lg-4 col-md-6 mt-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">


                                    <div className="pe-2">
                                        <div className="chart" style={{ height: '250px' }}>
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
                            <div className="card h-100">
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
                            <div className="card w-100">
                                <div className="card-body">
                                    <h6 className="mb-0">Đơn trong tuần</h6>

                                    <div className="pe-2">
                                        <div className="chart" style={{ height: '250px' }}>
                                            <Line data={lineChartTooltipData} options={lineChartTooltipOptions} />
                                        </div>
                                    </div>
                                    <hr className="dark horizontal" />
                                    <div className="">
                                        <p className="mb-0 text-sm">Đơn tuần này: <span className="text-danger">{ordersWeekCount}</span></p>
                                        <p className="mb-0 text-sm">Hoàn thành: <span className="text-danger">{ordersCompletedWeekCount}</span></p>

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
                            <select onChange={handleMonthChange} value={selectedMonth} className="form-select w-25">
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Tháng {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <table className="table">
                            <thead>
                                <tr className="text-secondary">
                                    <th scope="col">#</th>
                                    <th scope="col">Sách</th>
                                    <th scope="col" className="text-center" style={{ width: "30%" }}>Số lượt bán</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topBooks.map((book, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className="text-primary">
                                            <Link to={`/chi-tiet/${book.bookId}`}> {book.bookDetails?.title + '  -  ' + book.bookDetails?.author} <i className="fas fa-external-link-alt"></i></Link>
                                        </td>
                                        <td className="text-center">{book?.totalSold}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="col bg-white p-3 rounded shadow-sm">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="h6 fw-semibold">Khách hàng tiêu biểu </h2>
                            <select onChange={handleQuarterChange} value={selectedQuarter} className="form-select w-25">
                                {Array.from({ length: 4 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        Quý {i + 1}
                                    </option>
                                ))}
                            </select>

                        </div>
                        <table className="table">
                            <thead>
                                <tr className="text-secondary">
                                    <th scope="col">#</th>
                                    <th scope="col">Khách hàng</th>
                                    <th scope="col" className="text-center text-nowrap">Số đơn hàng</th>
                                    <th scope="col" className="text-center text-nowrap">Tổng chi tiêu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topCustomers.map((cus, index) => (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{cus.customerDetails.fullName}
                                            <p className="small"><i>({cus.customerDetails.email})</i></p>
                                        </td>
                                        <td className="text-center">{cus.totalOrders}</td>
                                        <td className="text-center">{formatCurrency(cus.totalSpent)}</td>
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