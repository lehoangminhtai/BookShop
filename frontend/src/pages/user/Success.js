import React from "react";

const SuccessPage = () => {
    return (
        <div className="min-vh-100 bg-white d-flex flex-column align-items-center py-5">
            <div className="container bg-white shadow-sm rounded p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <img src="https://res.cloudinary.com/dyu419id3/image/upload/v1731439369/check_nnsn14.png" alt="Nest logo" className="me-2" style={{ height: "50px", width: "50px" }} />
                        <h1 className="h3 fw-bold text-success mb-0">BOOKSHOP</h1>
                        <span className="text-muted ms-2">Your Order</span>
                    </div>
                </div>

                <div className="d-flex">
                    {/* Customer Information Section */}
                    <div className="col-6 pe-3">
                        <h3 className="h5 fw-semibold mb-3">Customer information</h3>
                        <div className="text-secondary">
                            <p className="mb-3"><span className="fw-semibold">Full name:</span> <span className="text-primary">eresf</span></p>
                            <p className="mb-3"><span className="fw-semibold">Phone:</span> <span className="text-primary">00123456789</span></p>
                            <p className="mb-3"><span className="fw-semibold">Email:</span> <span className="text-primary">abc@gmail.com</span></p>
                            <p className="mb-3"><span className="fw-semibold">Payment method:</span> <span className="text-primary">Cash on delivery (COD)</span></p>
                            <p className="mb-3"><span className="fw-semibold">Payment status:</span> <span className="badge bg-warning text-white">PENDING</span></p>
                        </div>
                    </div>

                    {/* Order Information Section */}
                    <div className="col-6 ps-3" style={{ maxHeight: "16rem", overflowY: "auto" }}>
                        <h3 className="h5 fw-semibold mb-3">Order number: #10000043</h3>
                        <div className="d-flex align-items-center mb-3">
                            <img src="https://placehold.co/50x50" alt="Blue Diamond Almonds Lightly" className="me-3" style={{ height: "50px", width: "50px" }} />
                            <div>
                                <p className="fw-semibold mb-0">Blue Diamond Almonds Lightly</p>
                                <p className="text-muted small mb-0">(Weight: 5KG, Boxes: 4 Boxes)</p>
                            </div>
                            <p className="ms-auto fw-semibold mb-0">$1,077.00</p>
                        </div>
                        {/* Shipping and Total */}
                        <div className="d-flex justify-content-between text-secondary mb-1">
                            <p className="mb-0">Shipping fee:</p>
                            <p className="mb-0">Free delivery - Free</p>
                        </div>
                        <div className="d-flex justify-content-between text-secondary fw-semibold">
                            <p className="mb-0">Total:</p>
                            <p className="mb-0">$1,077.00</p>
                        </div>
                    </div>
                </div>

                {/* Continue Shopping Button */}
                <div className="mt-4 text-center">
                    <button className="btn btn-primary px-4 py-2">Continue shopping</button>
                </div>
            </div>
        </div>
    );
}

export default SuccessPage;
