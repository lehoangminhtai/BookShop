import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


//context
import { useStateContext } from "../../../context/UserContext";
//services
import { getBookExchangesAvailableByUser } from "../../../services/exchange/bookExchangeService";
import { getListCategoryBooks } from "../../../services/categoryBookService";
import { createRequestSer } from "../../../services/exchange/exchangeRequestService";
import { getUserInfo } from "../../../services/userService";

const RequestForm = ({ handleCloseModal,checkRequest, bookExchangeId }) => {
    const [openProgress, setOpenProgress] = useState(false);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [usePoints, setUsePoints] = useState(false)
    const [userPoints, setUserPoints] = useState('')
    const { user } = useStateContext();
    const userId = user?._id;

    const [formData, setFormData] = useState({
        bookRequestedId: bookExchangeId,
        exchangeMethod: "points",
        exchangeBookId: null,
        requesterId: userId
    })


    const fetchPosts = async () => {
        try {

            const response = await getBookExchangesAvailableByUser(userId, selectedCategory);
            if (response.data.success) {
                setPosts(response.data.bookExchanges);
            }
            if (!response.data.success) {
                setPosts([]);
            }

        } catch (error) {
            console.log("Failed to fetch posts: ", error);
        }
    }
    const fetchCategories = async () => {
        const response = await getListCategoryBooks();
        if (response) {
            setCategories(response.data);
        } else {
            console.error('Failed to fetch categories');
        }
    };

    const getUserPoint = async () =>{
        try {
            if(user){
                const response = await getUserInfo(userId);
                console.log(response)
                if(response.data.success){
                    const user = response.data.user
                    setUserPoints(user?.grade);
                }
            }
        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchPosts();
        fetchCategories();
        getUserPoint();
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [selectedCategory]);

    const handleCloseProgress = () => {
        setOpenProgress(false);
    };
    const handleOpenProgress = () => {
        setOpenProgress(true);
    };

    const handleClose = () => {
        handleCloseModal();
    };

    const handleSubmit = async () => {
        try {

            if (formData.exchangeMethod === "points") {
                if (!usePoints) {
                    return;
                }
                
            } else if (formData.exchangeMethod === "book") {
                if (!formData.exchangeBookId) {
                    toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                        Vui lòng chọn sách của bạn để trao đổi!
                    </div>,
                        {
                            position: "top-center",
                            autoClose: 1500,
                            hideProgressBar: true,
                            closeButton: false,
                            className: "custom-toast",
                            draggable: false,
                            rtl: false,
                        }
                    );

                    return;
                }

                

            }
            handleOpenProgress();
                console.log(formData)
                const response = await createRequestSer(formData);
                const result = response.data;
                if (result) {
                    handleCloseProgress();
                    if (!result.success) {
                        toast.error(<div className="d-flex justify-content-center align-items-center gap-2">
                            {result.message}
                        </div>,
                            {
                                position: "top-center",
                                autoClose: 1500,
                                hideProgressBar: true,
                                closeButton: false,
                                className: "custom-toast",
                                draggable: false,
                                rtl: false,
                            }
                        );
                        return;

                    }
                    if (result.success) {
                        toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
                            Gửi trao đổi thành công
                        </div>,
                            {
                                position: "top-center",
                                autoClose: 1500,
                                hideProgressBar: true,
                                closeButton: false,
                                className: "custom-toast",
                                draggable: false,
                                rtl: false,
                            }
                        );
                        

                    }
                }
                checkRequest();
                handleClose();
        

        } catch (error) {

        }
    };

    const handleChange = async (selectedOption) => {
        setSelectedCategory(selectedOption ? selectedOption._id : null);
    };


    return (
        <div className="modal show fade" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Gửi yêu cầu trao đổi</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        {/* Nav Tabs */}
                        <ul className="nav nav-tabs" id="exchangeRequestTabs" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${formData.exchangeMethod === "points" ? "active" : ""}`}
                                    type="button"
                                    role="tab"
                                    onClick={() => setFormData({ ...formData, exchangeMethod: "points" })}
                                >
                                    Trao đổi bằng điểm
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className={`nav-link ${formData.exchangeMethod === "post" ? "active" : ""}`}
                                    type="button"
                                    role="tab"
                                    onClick={() => setFormData({ ...formData, exchangeMethod: "book" })}
                                >
                                    Trao đổi bằng bài đăng
                                </button>
                            </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content mt-3">
                            {formData.exchangeMethod === "points" && (
                                <div className="tab-pane fade show active">
                                    <div className="p-3 bg-light rounded shadow-sm">
                                        <div className="d-flex align-items-center">
                                            <p className="text-dark me-2">Tổng điểm hiện tại của bạn:</p>
                                            <h2 className="h2 text-danger fw-bold">{userPoints} đ</h2>
                                        </div>
                                       
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="usePointsCheckbox"
                                                checked={usePoints}
                                                onChange={(e) => setUsePoints(e.target.checked)}
                                            />
                                            <label className="form-check-label text-dark" htmlFor="usePointsCheckbox">
                                                Sử dụng điểm để trao đổi sách
                                            </label>
                                            {!usePoints && (<p className="text-danger text-start mt-2">(Vui lòng đồng ý sử dụng điểm để trao đổi bằng điểm)</p>)}
                                        </div>
                                    </div>
                                </div>

                            )}
                            {formData.exchangeMethod === "book" && (
                                <div className="tab-pane fade show active">
                                    <div className="d-flex align-items-center">
                                        <p className="text-dark me-2 fw-bold">Lọc:</p>

                                        <Autocomplete
                                            disablePortal
                                            options={categories}
                                            getOptionLabel={(option) => option.nameCategory}
                                            sx={{ width: 300 }}
                                            onChange={(event, value) => handleChange(value)}
                                            renderInput={(params) => <TextField {...params} label="Loại sách" />}
                                        />
                                    </div>
                                    <div className="d-flex flex-wrap mt-3 table-responsive">

                                        {posts && posts.length > 0 ? (
                                            posts.map((post) => (
                                                <div
                                                    key={post._id}
                                                    className={`card m-2  ${formData.exchangeBookId === post._id ? "border-primary" : ""
                                                        }`}
                                                    style={{ width: "10rem", cursor: "pointer" }}
                                                    onClick={() => setFormData({ ...formData, exchangeBookId: post._id })}
                                                >
                                                    <img
                                                        src={post?.images[0]}
                                                        className="card-img-top"
                                                        alt={post.title}
                                                        style={{
                                                            height: "10rem",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                    <div className="card-body p-2">
                                                        <h6
                                                            className="card-title text-truncate"
                                                            style={{ fontSize: "0.9rem" }}
                                                        >
                                                            {post.title}
                                                        </h6>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-muted">Bạn chưa có bài đăng nào.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn"
                            onClick={handleClose}
                        >
                            Đóng
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Gửi yêu cầu
                            <SendIcon className="ms-2" />
                        </button>
                    </div>
                </div>
            </div>
            {openProgress && (
                <Backdrop
                    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openProgress}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            
        </div>
    );
};

export default RequestForm;
