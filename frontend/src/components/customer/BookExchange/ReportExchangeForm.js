import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useDropzone } from 'react-dropzone';
//service
import { createReportSer } from "../../../services/exchange/reportExchangeService";
//context
import { useStateContext } from "../../../context/UserContext";
const ReportExchangeForm = (props) => {
  const [content, setContent] = useState("");
  const [requestId, setRequestId] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);

  const { user } = useStateContext();
  const [formData, setFormData] = useState({
    reporterId: user?._id,
    content: "",
    requestId: props.requestId,
    images: [],
  });
  const [errors, setErrors] = useState({});

  const [openProgress, setOpenProgress] = useState(false);
  const handleCloseProgress = () => {
    setOpenProgress(false);
  };
  const handleOpenProgress = () => {
    setOpenProgress(true);
  };


  const handleRemoveFile = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index)
    }))

  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, reader.result],
      }));
    };
  };
  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => setFileToBase(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const labels = {
    content: "Nội dung",
    images: "Hình ảnh",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].toString().trim()) {
        newErrors[key] = `${labels[key]} không được để trống`;
      }
    });


    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      handleOpenProgress();
      const response = await createReportSer(formData);
      const result = response.data;
      console.log(result)
      if (result.success) {
        handleCloseProgress();
        toast.success(<div className="d-flex justify-content-center align-items-center gap-2">
          Gửi báo cáo thành công
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
      props.handleClose();

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="modal show fade" tabIndex="-1" style={{ display: 'block' }}>
      <ToastContainer />
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Báo cáo</h5>
            <button type="button" className="btn-close" onClick={props.handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <h2 className="h2">Gửi báo cáo</h2>
                <textarea
                  placeholder="Nội dung"
                  value={formData.content}
                  className={`form-control ${errors.content ? "is-invalid" : ""}`}
                  name="content"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <div className="mb-3">
                  <label className="form-label fw-bold text-dark">Hình ảnh:</label>
                  <div
                    {...getRootProps()}
                    className={`dropzone ${isDragActive ? 'active-dropzone' : ''} ${errors.images ? "is-invalid" : ""}`}
                    style={{
                      border: '2px dashed #007bff',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '5px',
                    }}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? <p>Thả file vào đây...</p> : <p>Kéo & thả ảnh hoặc nhấn để chọn</p>}
                  </div>
                  {formData.images.length > 0 ? (
                    <div className="mt-2 d-flex flex-wrap">
                      {formData.images.map((img, index) => (
                        <div key={index} className="position-relative d-inline-block me-2 mb-2">
                          <img
                            src={img}
                            alt="preview"
                            className="img-thumbnail"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                            onClick={() => handleRemoveFile(index)}
                          >
                            &times;
                          </button>
                        </div>

                      ))}
                    </div>
                  ) : (<p className="text-danger mt-2">*Vui lòng chọn một hoặc nhiều ảnh cho cuốn sách</p> // Thay đổi cách hiển thị
                  )
                  }
                </div>

                <button type="submit" className="btn btn-danger">Gửi</button>

              </form>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn" onClick={props.handleClose}>Đóng</button>
          </div>
        </div>
      </div>
      {openProgress && <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openProgress}

      >
        <CircularProgress color="inherit" />
      </Backdrop>}
    </div>
  );
};

export default ReportExchangeForm;
