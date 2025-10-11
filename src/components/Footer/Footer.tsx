import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-deep-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Restaurant Info */}
          <div>
            <h2 className="text-2xl font-display font-bold mb-2">
              Himalayan Seafood Dhido
            </h2>
            <p className="text-neutral-gray mb-6 text-sm leading-relaxed">
              Authentic Nepali & Himalayan cuisine meets Gulf seafood in the
              heart of Arlington. From Sukuti to crawfish boils—we serve bold
              flavors with tradition.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-light-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-light-gold transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaSquareXTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-light-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-light-gold">
              Opening Hours
            </h3>
            <ul className="space-y-4">
              <li className="flex justify-between text-neutral-gray">
                <span>Monday - Thursday</span>
                <span>11:00 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between text-neutral-gray">
                <span>Friday - Saturday</span>
                <span>11:00 AM – 11:00 PM</span>
              </li>
              <li className="flex justify-between text-neutral-gray">
                <span>Sunday</span>
                <span>12:00 PM – 9:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-light-gold">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start text-neutral-gray">
                <FaMapMarkerAlt className="w-5 h-5 text-light-gold mr-3 mt-1 flex-shrink-0" />
                <span>100 W Pioneer Pkwy, Arlington, TX 76010</span>
              </li>
              <li className="flex items-center text-neutral-gray">
                <FaPhoneAlt className="w-5 h-5 text-light-gold mr-3 flex-shrink-0" />
                <span>(682) 252-4066</span>
              </li>
              {/* Email optional — not listed in menu */}
            </ul>
          </div>

          {/* Newsletter (Optional – keep or remove) */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-6 relative pb-3 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-light-gold">
              Stay Updated
            </h3>
            <p className="text-neutral-gray mb-4">
              Get alerts on new dishes, specials, and events.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/5 border border-neutral-gray/30 text-white px-4 py-3 rounded-md focus:outline-none focus:border-light-gold"
                required
              />
              <button
                type="submit"
                className="bg-accent-red text-white py-3 px-4 rounded-md font-semibold hover:bg-accent-red/90 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link
              to="/about"
              className="text-neutral-gray hover:text-light-gold text-sm"
            >
              About Us
            </Link>
            <Link
              to="/menu"
              className="text-neutral-gray hover:text-light-gold text-sm"
            >
              Menu
            </Link>
            <Link
              to="/reservations"
              className="text-neutral-gray hover:text-light-gold text-sm"
            >
              Reservations
            </Link>
            <Link
              to="/contact"
              className="text-neutral-gray hover:text-light-gold text-sm"
            >
              Contact
            </Link>
            <Link
              to="/privacy"
              className="text-neutral-gray hover:text-light-gold text-sm"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-neutral-gray text-sm">
            © {new Date().getFullYear()} Himalayan Seafood Dhido Nepali Grill &
            Bar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
