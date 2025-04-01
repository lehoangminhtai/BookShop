import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const ExchangeInfoDetail = () => {
    const steps = [
        'Nhắn tin trao đổi',
        'Điền thông tin giao dịch',
        'Xác nhận thông tin giao dịch',
        'Trao đổi sách',
        'Hoàn tất giao dịch',
        'Đánh giá người dùng',
    ];
    return (
        <div className='container mt-5'>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={1 && 2 && 3} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <div className=" mt-5 w-100" >
                <h1 className="h1 text-center fw-bold">Thông tin giao dịch</h1>
                <div className="">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="text-center">
                            <div
                                className="bg-secondary rounded"
                                style={{ width: "120px", height: "160px" }}
                            ></div>
                            <p className="mt-2 fw-bold text-dark text-truncate"
                                style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                            >Truyện Doremon</p>
                        </div>

                        <hr className="flex-grow-1 mx-3 text-primary" style={{ height: "1px" }} />

                        <div className="position-relative">
                            <div
                                className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "50px", height: "50px" }}
                            >
                                <i class="fa fa-exchange text-light" aria-hidden="true"></i>
                            </div>
                        </div>

                        <hr className="flex-grow-1 mx-3 text-primary" style={{ height: "1px" }} />

                        <div className="text-center">
                            <div
                                className="bg-secondary rounded"
                                style={{ width: "120px", height: "160px" }}
                            ></div>
                            <p className="mt-2 fw-bold text-dark text-truncate"
                                style={{ maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                            >Truyện Doremon Truyện Doremon Truyện Doremon</p>
                        </div>
                    </div>


                    <div className="alert alert-info text-center fw-bold" role="alert">
                        Trạng thái: Đang trao đổi
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Địa điểm trao đổi</label>
                        <div className="bg-secondary p-3 rounded text-white">
                            Công viên trung tâm
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Chủ sở hữu</label>
                        <div className="bg-secondary p-3 rounded text-white">Nguyễn Văn A</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Người yêu cầu</label>
                        <div className="bg-secondary p-3 rounded text-white">Trần Thị B</div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success w-48">Xác nhận hoàn thành</button>
                        <button className="btn btn-danger w-48">Báo cáo vấn đề</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ExchangeInfoDetail;