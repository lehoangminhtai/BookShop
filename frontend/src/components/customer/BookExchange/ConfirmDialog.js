
const ConfirmDialog = ({ handleClose, content, onConfirm }) => {

    return (
        <div className="modal show fade" tabIndex="-1" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                      
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="card-body">
                            <h2 className="h2 text-center">
                                {content}
                            </h2>
                            <div className="d-flex justify-content-center align-items-center">
                                <button className="btn btn-danger" onClick={() => onConfirm()}>Đồng ý</button>
                                <button className="btn btn-cancel" onClick={()=> handleClose()}>Hủy</button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn" onClick={handleClose}>Đóng</button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ConfirmDialog