import React, { useState, useEffect } from "react";
import AdSidebar from "../../components/admin/AdSidebar";

const AdOrder = () =>{
    return(
        <div className="d-flex">
            <AdSidebar/>
            <div className="container p-4">
                    <div className="d-flex justify-content-between mb-4">
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-secondary">Bulk Actions</button>
                            <button className="btn btn-outline-secondary">Filters</button>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Search..." />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary"><i className="fas fa-plus"></i> Create</button>
                            <button className="btn btn-outline-secondary"><i className="fas fa-download"></i> Export</button>
                            <button className="btn btn-outline-secondary"><i className="fas fa-sync-alt"></i> Reload</button>
                        </div>
                    </div>
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">ID <i className="fas fa-sort"></i></th>
                                <th className="text-center">EMAIL</th>
                                <th className="text-center">AMOUNT <i className="fas fa-sort"></i></th>
                                <th className="text-center">PAYMENT METHOD</th>
                                <th className="text-center">PAYMENT STATUS <i className="fas fa-sort"></i></th>
                                <th className="text-center">STATUS <i className="fas fa-sort"></i></th>
                                <th className="text-center">TAX AMOUNT <i className="fas fa-sort"></i></th>
                                <th className="text-center">OPERATIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-center">
                                    <input type="checkbox" className="me-2" />
                                    <span>42</span>
                                </td>
                                <td>
                                    <div>Mr. Lennie Denesik</div>
                                    <div className="text-primary">parisian.ally@example.net</div>
                                    <div className="text-muted">+19788215014</div>
                                </td>
                                <td>$2,071.00</td>
                                <td>PayPal</td>
                                <td><span className="badge bg-success">Completed</span></td>
                                <td><span className="badge bg-success"><i className="fas fa-check-circle"></i> Completed</span></td>
                                <td>$0.00</td>
                                <td className="text-center">
                                    <button className="btn btn-warning btn-sm"><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-danger btn-sm"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center">
                                    <input type="checkbox" className="me-2" />
                                    <span>41</span>
                                </td>
                                <td>
                                    <div>Mr. Lennie Denesik</div>
                                    <div className="text-primary">parisian.ally@example.net</div>
                                    <div className="text-muted">+19788215014</div>
                                </td>
                                <td>$1,976.00</td>
                                <td>Stripe</td>
                                <td><span className="badge bg-success">Completed</span></td>
                                <td><span className="badge bg-warning"><i className="fas fa-clock"></i> Pending</span></td>
                                <td>$0.00</td>
                                <td className="text-center">
                                    <button className="btn btn-warning btn-sm"><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-danger btn-sm"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center">
                                    <input type="checkbox" className="me-2" />
                                    <span>40</span>
                                </td>
                                <td>
                                    <div>Israel Spencer</div>
                                    <div className="text-primary">ohagenes@example.net</div>
                                    <div className="text-muted">+12567160359</div>
                                </td>
                                <td>$2,071.00</td>
                                <td>Mollie</td>
                                <td><span className="badge bg-success">Completed</span></td>
                                <td><span className="badge bg-warning"><i className="fas fa-clock"></i> Pending</span></td>
                                <td>$0.00</td>
                                <td className="text-center">
                                    <button className="btn btn-warning btn-sm"><i className="fas fa-edit"></i></button>
                                    <button className="btn btn-danger btn-sm"><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
    );
}

export default AdOrder