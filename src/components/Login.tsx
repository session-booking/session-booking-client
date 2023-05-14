import React, {useState} from 'react';
import {FiEye, FiEyeOff} from 'react-icons/fi';
import {TUser} from "../types/TUser";
import UserApi from "../api/UserApi";
import LogApi from "../api/LogApi";
import "../Login.css";
import {useDispatch} from "react-redux";
import {loginUser} from "../redux/state/userSlice";
import {useNavigate} from 'react-router-dom';
import {ClipLoader} from 'react-spinners';

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

    const validateUsername = (username: string) => {
        return username.length >= 5;
    };

    const validatePhoneNumber = (phoneNumber: string) => {
        const hasNineDigits = /^\d{9}$/;
        return hasNineDigits.test(phoneNumber);
    };

    const validatePassword = (password: string) => {
        const hasNumber = /\d/;
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        return password.length >= 8 && hasNumber.test(password) && hasSymbol.test(password);
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
            const hashedPassword = await hashPassword(user.password);

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
            let formValid = validateUsername(user.username);

            if (user.phoneNumber && user.phoneNumber !== "") {
                formValid = formValid && validatePhoneNumber(user.phoneNumber);
            }

            formValid = formValid && validatePassword(user.password);

            if (formValid) {
                try {
                    const hashedPassword = await hashPassword(user.password);

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
            username: validateUsername(value) ? '' : 'Username must be at least 5 characters long.',
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
            phoneNumber: validatePhoneNumber(value) ? '' : 'Phone number must have exactly 9 digits.',
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
            password: validatePassword(value)
                ? ''
                : 'Password must contain at least 8 characters, one number, and one symbol.',
        });
    }

    async function hashPassword(password: string | null): Promise<string> {
        if (!password) {
            throw new Error("Password is undefined");
        }

        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);

        const hashedBuffer = await crypto.subtle.digest("SHA-256", passwordData);
        const hashedArray = new Uint8Array(hashedBuffer);

        return Array.from(hashedArray)
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-indigo-600
            to-violet-800">
            <div className="w-full max-w-xs bg-white shadow-md rounded px-8 pt-6 pb-8">
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
                            <div className="mb-4">
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
                            <div className="mb-4 relative">
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
                            <div className="flex items-center justify-between mb-5">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <ClipLoader color="#ffffff" size={22} className="mt-1"/>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                                <a className="inline-block align-baseline font-medium text-sm text-blue-500
                                hover:text-blue-800"
                                   href="#">
                                    Forgot Password?
                                </a>
                            </div>
                        </form>
                        <p className="text-center text-gray-700 text-sm">
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
                            <div className="mb-4">
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
                            <div className="mb-4">
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
                            <div className="mb-4">
                                <input
                                    value={(user.phoneNumber !== null) ? user.phoneNumber : ""}
                                    onChange={handlePhoneNumberValueChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                                    leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                                    duration-100"
                                    id="phone_number_register"
                                    type="tel"
                                    placeholder="Phone Number (Optional)"
                                />
                                <p className="text-xs text-red-500 mt-2">{validationMessages.phoneNumber}</p>
                            </div>
                            <div className="mb-4">
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
                                    focus:outline-none focus:shadow-outline"
                                >
                                    {isLoading ? (
                                        <ClipLoader color="#ffffff" size={22} className="mt-1"/>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-gray-700 text-sm">
                            Already have an account?{' '}
                            <a className="font-medium text-blue-500 hover:text-blue-800" href="#"
                               onClick={switchFormType}>
                                Login
                            </a>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default Login;