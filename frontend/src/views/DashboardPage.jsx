import { useEffect } from "react";
import { dashboardAnalitics } from "../components/analytics/DashboardAnalytics";

export const DashboardPage = () => {
    useEffect(() => {
        dashboardAnalitics();
    }, [])
    return (
        <>
          
        </>
    );
};