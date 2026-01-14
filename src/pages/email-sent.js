import Button from "@/components/Button";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function EmailSent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    return (
        <div className="login-container">
            <div className="wrapper2">
                <div className=" bg-white rounded-2xl">
                    <div className="py-16 px-10 max-w-lg">

                        <div className="flex justify-center mb-9">
                            <Image
                                src="/images/mail-sent.png"
                                alt="mail-sent"
                                width={192}
                                height={48}
                                className="mx-auto"
                            />
                        </div>
                        <h1 className="text-2xl font-semibold text-black4 text-center mb-2 mt-2``">
                            Verify Your Link
                        </h1>
                        <p className="text-base font-normal text-grey-1 text-center mb-9">We have sent a verification link to your email. Please click on the link and come back to the app.</p>
                        <div className="mt-8">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full "
                                loading={loading}
                                onClick={() => router.push("/login")}
                            >
                                {loading ? "Processing..." : "Go to Login"}
                            </Button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
