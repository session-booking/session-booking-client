import React, {useState} from 'react';
import {FiEye, FiEyeOff} from 'react-icons/fi';
import {TUser} from "../../types/TUser";
import UserApi from "../../api/UserApi";
import LogApi from "../../api/LogApi";
import "../../Login.css";
import {useDispatch} from "react-redux";
import {loginUser} from "../../redux/state/userSlice";
import {useNavigate} from 'react-router-dom';
import {ClipLoader} from 'react-spinners';
import {CommonsHelper} from "../../helpers/CommonsHelper";

function Login() {
    const [user, setUser] = useState<TUser>({
        id: null,
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
    });

    const [validationMessages, setValidationMessages] = useState({
        username: "",
        phoneNumber: "",
        password: "",
    });

    const [popup, setPopup] = useState({
        message: "",
        success: false,
    });

    // Password visibility and form type
    const [showPassword, setShowPassword] = useState(false);
    const [formType, setFormType] = useState('login');

    // Loading animation
    const [isLoading, setIsLoading] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const switchFormType = () => {
        setFormType(formType === 'login' ? 'register' : 'login');
    };

    const showPopup = (message: string, success: boolean) => {
        if (success) {
            switchFormType();
        }
        setPopup({message, success});
        setTimeout(() => {
            setPopup({message: "", success: false});
        }, 3000);
        setIsLoading(false);
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        try {
            const hashedPassword = await CommonsHelper.hashPassword(user.password);

            const response = await UserApi.login({
                id: null,
                username: null,
                email: user.email,
                phoneNumber: null,
                password: hashedPassword,
            });

            if (response.httpCode === 200 && response.token && response.user) {
                localStorage.setItem("token", response.token);

                dispatch(
                    loginUser({
                        id: response.user.id,
                        username: response.user.username,
                        email: response.user.email,
                        phoneNumber: response.user.phoneNumber,
                    })
                );

                navigate("/");
            } else if (response.httpCode === 404 || response.httpCode === 401) {
                showPopup("Invalid email or password.", false);
                setIsLoading(false);
            } else {
                showPopup("Login failed. Please try again later.", false);
                setIsLoading(false);
            }
        } catch (error: any) {
            LogApi.logError("Unexpected error while logging in: " + error.toString(), null);
        }
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        if (user.username && user.email && user.password) {
            let formValid = CommonsHelper.validateUsername(user.username);

            if (user.phoneNumber && user.phoneNumber !== "") {
                formValid = formValid && CommonsHelper.validatePhoneNumber(user.phoneNumber);
            }

            formValid = formValid && CommonsHelper.validatePassword(user.password);

            if (formValid) {
                try {
                    const hashedPassword = await CommonsHelper.hashPassword(user.password);

                    const response = await UserApi.register({
                        id: null,
                        username: user.username,
                        email: user.email,
                        password: hashedPassword,
                        phoneNumber: user.phoneNumber,
                    });

                    if (response.httpCode === undefined || response.httpCode === null) {
                        showErrorPopup();
                    }

                    if (response.httpCode === 200) {
                        showPopup("Registration successful! Please log in.", true);
                        setUser({
                            id: null,
                            username: "",
                            email: "",
                            password: "",
                            phoneNumber: "",
                        });
                    } else if (response.httpCode === 409) {
                        showPopup("Account with this email already exists. Please log in.", false);
                    } else {
                        showErrorPopup();
                    }
                } catch (error: any) {
                    LogApi.logError("Unexpected error while registering: " + error.toString(), null);
                }
            } else {
                setIsLoading(false);
            }
        }

        function showErrorPopup() {
            showPopup("Registration failed. Please try again later.", false);
        }
    }

    function handleUsernameValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setUser({
            ...user,
            username: value,
        });
        setValidationMessages({
            ...validationMessages,
            username: CommonsHelper.validateUsername(value) ? '' : 'Username must be at least 5 characters long.',
        });
    }

    function handleEmailValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUser({
            ...user,
            email: e.target.value,
        });
    }

    function handlePhoneNumberValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setUser({
            ...user,
            phoneNumber: value,
        });
        setValidationMessages({
            ...validationMessages,
            phoneNumber: CommonsHelper.validatePhoneNumber(value) ? '' : 'Phone number must have exactly 9 digits.',
        });
    }

    function handlePasswordValueChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        setUser({
            ...user,
            password: value,
        });
        setValidationMessages({
            ...validationMessages,
            password: CommonsHelper.validatePassword(value)
                ? ''
                : 'Password must contain at least 8 characters, one number, and one symbol.',
        });
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-600
            to-violet-800">
            <div className="w-full max-w-sm bg-white shadow-md rounded px-8 pt-6 pb-8">
                {popup.message && (
                    <div
                        className={`popup ${
                            popup.success ? "success" : "error"
                        }`}
                    >
                        {popup.message}
                    </div>
                )}
                {formType === 'login' ? (
                    <>
                        <h1 className="text-3xl font-normal text-gray-900 mb-6 text-center">Login</h1>
                        <form onSubmit={handleLogin} className="mb-4">
                            <div className="mb-4 text-[18px]">
                                <input
                                    value={(user.email !== null) ? user.email : ""}
                                    onChange={handleEmailValueChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                                    leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                                    duration-100"
                                    id="email_login"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="mb-4 text-[18px] relative">
                                <input
                                    value={(user.password !== null) ? user.password : ""}
                                    onChange={handlePasswordValueChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                                    mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                                    duration-100"
                                    id="password_login"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={toggleShowPassword}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700
                                    focus:outline-none pb-2.5"
                                >
                                    {showPassword ? <FiEyeOff/> : <FiEye/>}
                                </button>
                            </div>
                            <div className="flex justify-center mb-5">
                                <button
                                    className="text-[18px] bg-blue-500 hover:bg-blue-700 text-white font-medium py-2
                                        px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ClipLoader color="#ffffff" size={22} className="mt-1"/>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-gray-700 text-[16px]">
                            Don't have an account?{' '}
                            <a className="font-medium text-blue-500 hover:text-blue-800" href="#"
                               onClick={switchFormType}>
                                Sign Up
                            </a>
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-normal text-gray-900 mb-6 text-center">Sign Up</h1>
                        <form onSubmit={handleRegister} className="mb-4">
                            <div className="mb-4 text-[18px]">
                                <input
                                    value={(user.username !== null) ? user.username : ""}
                                    onChange={handleUsernameValueChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                                    leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                                    duration-100"
                                    id="username_register"
                                    type="text"
                                    placeholder="Username"
                                    required
                                />
                                <p className="text-xs text-red-500 mt-2">{validationMessages.username}</p>
                            </div>
                            <div className="mb-4 text-[18px]">
                                <input
                                    value={(user.email !== null) ? user.email : ""}
                                    onChange={handleEmailValueChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                                    leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                                    duration-100"
                                    id="email_register"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="mb-4 text-[18px]">
                                <input
                                    value={(user.phoneNumber !== null) ? user.phoneNumber : ""}
                                    onChange={handlePhoneNumberValueChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                                    leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                                    duration-100"
                                    id="phone_number_register"
                                    type="tel"
                                    pattern="[0-9]{9}"
                                    placeholder="Phone Number (Optional)"
                                />
                                <p className="text-xs text-red-500 mt-2">{validationMessages.phoneNumber}</p>
                            </div>
                            <div className="mb-4 text-[18px]">
                                <div className="relative">
                                    <input
                                        value={(user.password !== null) ? user.password : ""}
                                        onChange={handlePasswordValueChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                                        mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                                        duration-100"
                                        id="password_register"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleShowPassword}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700
                                        focus:outline-none pb-2.5"
                                    >
                                        {showPassword ? <FiEyeOff/> : <FiEye/>}
                                    </button>
                                </div>
                                <p className="text-xs text-red-500">{validationMessages.password}</p>
                            </div>
                            <div className="flex items-center justify-center mb-5">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded
                                    focus:outline-none focus:shadow-outline text-[18px] transition duration-300"
                                >
                                    {isLoading ? (
                                        <ClipLoader color="#ffffff" size={22} className="mt-1"/>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-gray-700 text-[16px]">
                            Already have an account?{' '}
                            <a className="font-medium text-blue-500 hover:text-blue-800" href="#"
                               onClick={switchFormType}>
                                Sign In
                            </a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;