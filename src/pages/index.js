import Button from "@/components/Button";
import Input from "@/components/Input";
import Password from "@/components/Password";
import Link from "@/components/Link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useFirebaseAuth from "@/services/firebase-services/useFirebaseAuth";
import ButtonWithLoader from "@/components/ButtonWithLoader";
import { toast } from "react-toastify";
import { setToken, setUser } from "@/services/firebase-services/cookies";
import { userLogin } from "@/services/api/userAuth";
import Image from "next/image";
export default function Index() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isEyeOpen, setIsEyeOpen] = useState(false);
    const [fields, setFields] = useState({
        email: "",
        password: "",
    });
    const { loginWithEmailAndPassword } = useFirebaseAuth()
    const emailHandler = (e) => {
        setFields((prev) => ({ ...prev, email: e.target.value }));
    };
    const passwordHandler = (e) => {
        setFields((prev) => ({ ...prev, password: e.target.value }));
    };

    const handleLogin = async (e) => {

        e.preventDefault();
        setLoading(true)
        try {

            let userAuthData = await loginWithEmailAndPassword(fields.email, fields.password)

            if (userAuthData?.status) {
                let userData = await userLogin(userAuthData.token)

                if (userData.status) {
                    setToken(userAuthData.token, userAuthData.expiryTime)
                    setUser(userData.data)
                    toast.success("Login successful");
                    router.push("/user-management");
                }

            }

        }
        catch (err) {
            console.error("Login error:", err);
            toast.error(err?.message || "Login failed. Please try again.");
        }

        finally {
            setLoading(false)
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center login-container" style={{ backgroundImage: 'url("/images/login_bg.png")' }}>
            <div className="wrapper2">
                <div className=" max-w-lg w-full p-10">

                    <div className="text-center mb-6">

                        <Image
                            src="/images/love_the_padel_logo.png"
                            alt="love_the_padel"
                            width={192}
                            height={48}
                            className="mx-auto"
                        />
                    </div>
                    <div className=" bg-white rounded-2xl">
                        <div className="py-12 px-10 max-w-lg">

                            <h2 className="text-3xl mb-10 text-center">Login</h2>

                            <form onSubmit={handleLogin} >
                                <label className="block mb-4">
                                    <h2 className="mb-2 text-sm font-medium text-black-1">Email Id</h2>
                                    <div className="flex items-center border rounded-full bg-neutral-1000 px-4 py-2">

                                        <Input
                                            type="email"
                                            placeholder="Enter Email Id"
                                            value={fields.email}
                                            onChange={emailHandler}
                                            disabled={loading}
                                            className="w-full outline-none pl-1 "
                                        />
                                    </div>
                                </label>

                                <label className="block mb-4">
                                    <h2 className="mb-2 text-sm font-medium text-black-1">Password</h2>

                                    <div className="flex items-center border rounded-full bg-neutral-1000 px-4 py-2">

                                        <Password
                                            placeholder="Enter Password"
                                            value={fields.password}
                                            onChange={passwordHandler}
                                            iconType="post"
                                            disabled={loading}
                                            className="w-full outline-none pl-1"
                                        />
                                    </div>
                                </label>

                                {/* <div className="flex justify-end items-center mb-10">
                                    <Link
                                        href="/forgot-password" passHref
                                        className="text-sm text-primary font-normal cursor-pointer hover:underline"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div> */}
                                <div onClick={() => router.push('/forgot-password')} className='w-full flex justify-end mt-4'>
                                    <span className='text-primary font-medium leading-[150%] text-sm cursor-pointer hover:underline'>
                                        Forgot Password?
                                    </span>
                                </div>
                                <ButtonWithLoader
                                    type="submit"
                                    className={`mt-10 px-20 rounded-[64px] ${fields.email && fields.password
                                        ? "bg-blue hover:bg-blue/90 cursor-pointer"
                                        : "bg-blue opacity-40 cursor-not-allowed"
                                        }`}
                                    loading={loading}
                                    onClick={handleLogin}
                                    disabled={!fields.email || !fields.password || loading}
                                >
                                    Login
                                </ButtonWithLoader>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
