import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "@/layout/Layout";

import Tnc from "@/components/ContentManagement/tnc";
import Privacypolicy from "@/components/ContentManagement/privacy-policy";

const TabPage = () => {
    const router = useRouter();
    const { tab } = router.query;
    const [activeTab, setActiveTab] = useState("tnc");

    useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

    const renderContent = () => {
        switch (activeTab) {

            case "tnc":
                return <Tnc />;
            case "privacypolicy":
                return <Privacypolicy />;

            default:
                return <Tnc />;
        }
    };

    return (
        <Layout title="Content Management">
            <div className="mb-8 border-b-2 flex space-x-4">

                <button
                    className={`relative px-3 py-2 text-base ${activeTab === "tnc"
                        ? "border-b-[3px]  border-primary font-medium text-base  text-black-4 pl-1"
                        : "pl-1 text-grey-1 "
                        }`}
                    onClick={() => router.push({ pathname: "/content-management", query: { tab: "tnc" } })}
                >
                    Terms And Conditions
                </button>

                <button
                    className={`relative px-3 py-2 text-base ${activeTab === "privacypolicy" ? "border-b-[3px]  border-primary font-medium text-base  text-black-4 pl-1"
                        : "pl-1 text-grey-1 "
                        }`}
                    onClick={() => router.push({ pathname: "/content-management", query: { tab: "privacypolicy" } })}
                >
                    Privacy Policy
                </button>


            </div>

            {renderContent()}
        </Layout>
    );
};

export default TabPage;
