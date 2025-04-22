import React, { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import { TypeAnimation } from 'react-type-animation';
//service
import { getSummarizeSer } from '../../services/AI/summarizeService';

const Summarize = (props) => {
    const [fullText, setFullText] = useState('Đang tải tóm tắt...'); // <-- quản lý bằng state

    const title = props.title;
    const author = props.author

    const getSummarize = async () => {
        const data = { title, author };
        try {
            const response = await getSummarizeSer(data);
            console.log(response.data);
            setFullText(response.data.summary); // <-- cập nhật state
        } catch (err) {
            console.error('Error getting summary:', err);
            setFullText('Không thể tải tóm tắt.');
        }
    };

    useEffect(() => {
        getSummarize();
    }, []);

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
        >
            <div className="modal-content">
                <div className="modal-body"></div>
                <div className="d-flex justify-content-top mb-3">
                    <button aria-label="Close" className="btn-close text-white" aria-hidden="true" onClick={() => props.onClose()}></button>
                </div>

                <div className="overflow-scroll bg-opacity-25 border rounded-top p-4 min-vh-25 slide-up" style={{ backgroundColor: '#FFE0E0' }}>
                    <p className="text-dark fs-5 font-monospace mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                        Tóm tắt sách:
                    </p>
                    <TypeAnimation
                         key={fullText}
                        sequence={[fullText]}
                        wrapper="span"
                        speed={100}
                        style={{ fontSize: '2em', display: 'inline-block', color: 'black' }}
                        repeat={0} // chỉ chạy một lần
                    />
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn" onClick={() => props.onClose()}>Đóng</button>
            </div>
        </Backdrop>
    );
};

export default Summarize;
