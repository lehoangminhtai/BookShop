import { useStateContext } from '../context/UserContext'
import { useEffect, useState } from 'react'
// import {motion} from 'framer-motion'
import { VisibilityOff, RemoveRedEye } from '@mui/icons-material'

const Input = ({ type, placeholder, attribute, blurFunction, showEyeIcon }) => {      // attribute may either of 'email', 'name', 'password', 'confirmPassword'

    const { userFormData, setUserFormData, validationMessage, setValidationMessage } = useStateContext()
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e) => {
        setUserFormData({ ...userFormData, [attribute]: e.target.value })
    }

    return (
        <div className="tw-flex tw-flex-col tw-gap-[4px]">
            <div className="tw-relative tw-flex tw-flex-col tw-gap-[4px]">
                <input
                    autoComplete="off"
                    type={showPassword ? 'text' : type}
                    placeholder={placeholder}
                    name={attribute}
                    value={userFormData[attribute]}
                    onChange={handleChange}
                    onBlur={blurFunction}
                    className="tw-bg-inherit tw-w-full tw-text-black tw-border-b-[1px] tw-border-textGray tw-p-[6px] tw-outline-none tw-pl-0"
                    required
                />
                {showEyeIcon && (
                    <button
                        onClick={() => setShowPassword((pre) => !pre)}
                        className="tw-absolute tw-right-0 tw-top-[50%] tw-transform tw-translate-y-[-50%]"
                    >
                        {showPassword ? <VisibilityOff /> : <RemoveRedEye />}
                    </button>
                )}
            </div>
            {validationMessage[attribute] && (
                <p className="tw-text-[12px] tw-text-red">{validationMessage[attribute]}</p>
            )}
        </div>

    )

}

export default Input