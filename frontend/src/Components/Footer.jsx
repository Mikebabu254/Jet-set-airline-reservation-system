import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-info text-light py-4" id="footer">
            <div className="container">
                <div className="row">
                    {/* Footer Title */}
                    <div className="col-md-4 mb-3">
                        <h3 className="fw-bold">JetSet Airline Reservation</h3>
                    </div>
                    
                    {/* Social Media Links */}
                    <div className="col-md-4 mb-3 text-center">
                        <h5>Follow Us</h5>
                        <div className="d-flex justify-content-center gap-3">
                            <a href="#" className="text-light fs-4">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-light fs-4">
                                <FaFacebook />
                            </a>
                            <a href="#" className="text-light fs-4">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>
                    
                    {/* Description */}
                    <div className="col-md-4 mb-3">
                    <p>
                        JetSet Airline Reservation System offers seamless booking experiences for your travel needs. 
                        Enjoy easy flight reservations, manage your bookings, and stay updated with the latest travel information.
                    </p>
                    </div>
                </div>

                {/* Footer Bottom Line */}
                <div className="text-center border-top pt-3 mt-3">
                    <small>© {new Date().getFullYear()} JetSet Airline. All rights reserved.</small>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
