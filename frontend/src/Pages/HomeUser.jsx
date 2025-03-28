import UserNavBar from "../Components/UserNavBar";
import Footer from "../Components/Footer";
import UserFlightSchedule from "../Components/UserFlightSchedule";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function HomeUser(){
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const user = JSON.parse(localStorage.getItem("user"));
    
        if (!isLoggedIn || !user || user.role !== "user") {
          navigate("/login"); 
        }
      }, []);
    return(
        <div>
            <UserNavBar/>
            <UserFlightSchedule/>
            <Footer/>
        </div>
    )
}

export default HomeUser;