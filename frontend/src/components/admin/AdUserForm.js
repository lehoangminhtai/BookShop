import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
//service
import { createUser, updateUser } from "../../services/userService";
import { createCartSer } from "../../services/cartService";


const AdUserForm = ({ onClose, isEdit, user }) => {
  const formatDate = (date) => {
    if (!date) return ""; // Trả về chuỗi rỗng nếu không có giá trị
    const d = new Date(date); // Chuyển chuỗi ISO thành đối tượng Date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu tháng < 10
    const day = String(d.getDate()).padStart(2, '0'); // Thêm số 0 nếu ngày < 10
    return `${year}-${month}-${day}`; // Trả về chuỗi theo định dạng YYYY-MM-DD
  };

  const dob = formatDate(user?.dateOfBirth || "");
  const [formData, setFormData] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: dob,
    password: "",
    passwordConfirm: "",
    isAdmin: user?.role === 0 ? false : true || false,
    status: user?.status || "active",
    avatar: "",
    isChangePass: false
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
  });

  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị mật khẩu
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value.slice(0, getMaxLength(id)),
    });

    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      if (value.trim() !== "") {
        delete updatedErrors[id]; // Xóa lỗi nếu giá trị hợp lệ
      }
      return updatedErrors;
    });
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Đọc file dưới dạng base64
    reader.onloadend = () => {
      setFormData((prevFormData) => ({
        ...prevFormData,
        avatar: reader.result, // Cập nhật avatar với hình ảnh đã đọc
      })); // Lưu base64 vào state

    };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileToBase(file);
    }
  };


  const getMaxLength = (field) => {
    switch (field) {
      case "name":
        return 50;
      case "email":
        return 30;
      case "phone":
        return 10;
      case "password":
      case "passwordConfirm":
        return 30;
      default:
        return 255;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};


    if (!formData.name.trim()) {
      newErrors.name = "Tên không được để trống";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    }
    if (!isEdit || formData.isChangePass) {
      if (!formData.password.trim()) {
        newErrors.password = "Mật khẩu không được để trống";
      } else if (formData.password.length < 8) {
        newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
          formData.password
        )
      ) {
        newErrors.password =
          "Mật khẩu phải chứa ít nhất 1 ký tự hoa, 1 ký tự thường, 1 chữ số và 1 ký tự đặc biệt";
      }


      if (!formData.passwordConfirm.trim()) {
        newErrors.passwordConfirm = "Xác nhận mật khẩu không được để trống";
      } else if (formData.password !== formData.passwordConfirm) {
        newErrors.passwordConfirm = "Mật khẩu và xác nhận mật khẩu không khớp";
      }
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      if (!isEdit) {
        const userData = {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          image: formData.avatar,
          status: formData.status,
          password: formData.password,
          dateOfBirth: formData.dob,
          role: !formData.isAdmin ? 0 : 1
        }

        const response = await createUser(userData);

        if (response.success) {
          await createCartSer(response.user._id)
          toast.success('Thêm người dùng thành công', {
            autoClose: 1000,
            onClose: () => {
              // Đảm bảo đóng modal sau khi thông báo đã hoàn thành
              onClose();
            }
          })
        }
        else if (!response.success) {

          toast.error(response.data.message)
        }
      }
      else if (isEdit) {
        const userData = {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          image: formData.avatar,
          status: formData.status,
          dateOfBirth: formData.dob,
          role: !formData.isAdmin ? 0 : 1,
        };
        if (formData.isChangePass && formData.password) {
          userData.password = formData.password; // Nếu đổi mật khẩu
        }

        const response = await updateUser(user._id, userData);

        if (response.success) {
          toast.success('Cập nhật người dùng thành công', {
            autoClose: 1000,
            onClose: () => {
              // Đảm bảo đóng modal sau khi thông báo đã hoàn thành
              onClose();
            }
          })
        } else {
          toast.error(response.data.message);
        }
      }

    } catch (error) {
      console.log(error)
    }
  };
  const handleUpdate = () => {

  }
  return (
    <div className="container py-5">
      <div className="rounded-lg">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                <div className="card shadow-sm mb-3">
                  <div className="card-body">
                    <h5 className="card-title text-primary mb-3">Ảnh đại diện</h5>
                    <div className="d-flex justify-content-center mb-3">
                      <img
                        src={user?.image || formData.avatar || 'https://placehold.co/100x100'}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </div>
                    <input type="file" className="text-primary"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />

                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <label htmlFor="name" className="form-label">
                      Họ tên<span className="text-danger">*</span>
                    </label>
                    <div className="text-end text-muted">({formData.name.length}/50)</div>
                  </div>
                  <input
                    type="text"
                    id="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''} mb-1`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between">
                    <label htmlFor="email" className="form-label">
                      Email<span className="text-danger">*</span>
                    </label>
                    <div className="text-end text-muted">({formData.email.length}/60)</div>
                  </div>
                  <input
                    type="email"
                    id="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''} mb-1`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g: example@domain.com"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-6 mt-3">
                  <label htmlFor="phone" className="form-label">
                    Số điện thoại<span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''} mb-1`}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                <div className="col-md-6 mt-3">
                  <label htmlFor="dob" className="form-label">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    id="dob"
                    className="form-control"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
                {isEdit && (
                  <div className="col-md-12 mt-3">
                    <div className="d-flex">
                      <div className="form-check form-switch">
                        <input
                          id="isChangePass"
                          className="form-check-input"
                          type="checkbox"
                          value={formData.isChangePass}
                          onChange={handleChange}
                        />
                      </div>
                      <label htmlFor="changPass" className="form-label">
                        Đổi mật khẩu ?
                      </label>
                    </div>
                  </div>
                )}

                <div className="col-md-6 mt-3">
                  <label htmlFor="password" className="form-label">
                    Mật khẩu<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"} // Chuyển đổi giữa text và password
                      id="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowPassword(!showPassword)} // Toggle trạng thái hiển thị mật khẩu
                    >
                      {showPassword ? <i class="fa-solid fa-eye"></i> : <i class="fa fa-eye-slash" aria-hidden="true"></i>}
                    </button>
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                <div className="col-md-6 mt-3">
                  <label htmlFor="passwordConfirm" className="form-label">
                    Xác nhận mật khẩu<span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <input
                      type={showPasswordConfirm ? "text" : "password"} // Chuyển đổi giữa text và password
                      id="passwordConfirm"
                      className={`form-control ${errors.passwordConfirm ? "is-invalid" : ""
                        }`}
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} // Toggle trạng thái hiển thị mật khẩu
                    >
                      {showPasswordConfirm ? <i class="fa-solid fa-eye"></i> : <i class="fa fa-eye-slash" aria-hidden="true"></i>}
                    </button>
                    {errors.passwordConfirm && (
                      <div className="invalid-feedback">{errors.passwordConfirm}</div>
                    )}
                  </div>
                  {errors.passwordConfirm && <div className="invalid-feedback">{errors.passwordConfirm}</div>}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">
                    Trạng thái<span className="text-danger">*</span>
                  </h5>
                  <select
                    id="status"
                    className="form-select"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="lock">Khóa</option>
                  </select>
                </div>
              </div>
              <div className="col-md-12 mt-2 mb-2">
                <div className="d-flex">
                  <div className="form-check form-switch">
                    <input
                      id="isAdmin"
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.isAdmin}
                      onChange={handleChange}
                    />
                  </div>
                  <label htmlFor="changPass" className="form-label">
                    Là admin ?
                  </label>
                </div>
              </div>
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">Tạo</h5>
                  <div className="d-flex justify-content-end">
                    {isEdit ? <button className="btn btn-warning me-2" onClick={handleSubmit}>
                      Cập nhật
                    </button> : <button className="btn btn-primary me-2" onClick={handleSubmit}>
                      Lưu
                    </button>}


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdUserForm;
