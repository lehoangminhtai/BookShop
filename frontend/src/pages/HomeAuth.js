import { logout,login } from '../actions/UserAction'
import Cookie from 'js-cookie'
import { CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useStateContext } from '../context/UserContext'
import { Link } from 'react-router-dom'

const HomeAuth = () => {

    const { result, isLoading, } = useSelector(state => state.user)
    const { user, setUser } = useStateContext()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log(result, 'result')
        Cookie.get('profile') && setUser(JSON.parse(Cookie.get('profile')))
    }, [result, isLoading])

    const logoutFunc = () => {
        dispatch(logout())
        setUser(null)
    }
    const loginFunc = () => {
      
    }


    return (
        <>
            {
                isLoading
                    ?
                    <CircularProgress style={{ color: '#feb931' }} className="w-[60px] h-[60px] text-orange " />
                    :
                    <div className="flex flex-col justify-center items-center " >
                        {
                            Cookie.get('profile')
                                ?
                                <button onClick={logoutFunc} className="capitalize text-[16px] rounded-[4px] bg-lightGray px-[16px] py-[8px] " >logout</button>
                                :
                                <button  className="capitalize text-[16px] rounded-[4px] bg-lightGray px-[16px] py-[8px] " ><Link to='/auth'>login</Link></button>
                        }

                    </div>
            }
        </>
    )
}

export default HomeAuth