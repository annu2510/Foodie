import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">About Foodie</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your trusted campus food delivery service. Order from your favorite campus eateries with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-orange-500 transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="hover:text-orange-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-orange-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@foodie.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+1 (234) 567-8900</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 pb-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Foodie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;