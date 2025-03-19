import { useEffect, useState } from 'react';
import { useStateContext } from '../../../context/UserContext';

const ListUserRequest = ({ props }) => {
    const [expanded, setExpanded] = useState(false);
    const { user } = useStateContext();

    const userRequests = [{
        fullName: 'Nguyễn Văn A',
        image: user?.image
    },
    {
        fullName: 'Nguyễn Văn B',
        image: user?.image
    }
    ]

    const handleChangeExpanded = () => {
        setExpanded(!expanded);
    }

    return (
        <div className="container mt-2 mb-2 bg-white p-3 rounded shadow-sm ">
            <div className='text-dark fw-bold mb-2'>
                <span className="me-3">Danh sách yêu cầu trao đổi</span>
                {expanded ?
                    (<button onClick={handleChangeExpanded}><i class="fa-solid fa-chevron-down"></i></button>) :
                    (<button onClick={handleChangeExpanded}><i class="fa-solid fa-chevron-up"></i></button>)}

            </div>
            {expanded && (<div>
                {userRequests.map((userRequest, index) => (
                    <>
                        <div key={index} className='d-flex justify-content-between align-items-center'>
                            <div className="d-flex align-items-center mb-2 cursor-pointer">
                                <img src={userRequest.image} alt="avatar" className="rounded-circle me-2" style={{ width: '50px', height: '50px' }} />
                                <span className="fw-bold" 
                                    onMouseOver={(e) => {e.currentTarget.style.transform = 'scale(1.02)'
                                    e.currentTarget.style.color = 'blue'
                                    }}
                                    onMouseOut={(e) => {e.currentTarget.style.transform = 'scale(1)'
                                         e.currentTarget.style.color = 'none'
                                    }}
                                >
                                    {userRequest.fullName}</span>

                            </div>

                            <div className='d-flex align-items-center ' >
                                <button className="btn btn-danger"><i class="fa-solid fa-xmark"></i></button>
                                <button className="btn btn-success ms-2"><i class="fa-solid fa-check"></i></button>
                            </div>
                        </div>
                        <hr />
                    </>
                ))}
            </div>)}
        </div>
    );
}

export default ListUserRequest;