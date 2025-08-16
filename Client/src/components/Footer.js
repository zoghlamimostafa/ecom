// Footer.jsx
import React from 'react';
import { FaLinkedin, FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='footer-container'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-4 mb-4'>
            <h4 className='footer-title'>Contactez-nous</h4>
            <address className="footer-text">
              Tunis<br />
              <a href="tel:+216789654" className='footer-link'>+25369741</a><br />
              <a href="mailto:sannyshop02@gmail.com" className='footer-link'>Sannyshop02@gmail.com</a>
            </address>
            <div className='social-icons mt-4'>
              <a href="#" className="footer-link"><FaLinkedin /></a>
              <a href="#" className="footer-link"><FaInstagram /></a>
              <a href="#" className="footer-link"><FaFacebook /></a>
              <a href="#" className="footer-link"><FaYoutube /></a>
            </div>
          </div>
          <div className='col-md-3 mb-4'>
            <h4 className='footer-title'>Informations</h4>
            <ul className='footer-list'>
              <li><Link to="/privacy-policy" className="footer-link">Politique de confidentialité</Link></li>
              <li><Link to="/refund-policy" className="footer-link">Politique de remboursement</Link></li>
              <li><Link to="/shipping-policy" className="footer-link">Politique d'expédition</Link></li>
              <li><Link to="/term-conditions" className="footer-link">Termes et conditions</Link></li>
            </ul>
          </div>
          <div className='col-md-3 mb-4'>
            <h4 className='footer-title'>Compte</h4>
            <ul className='footer-list'>
              <li><Link to="/proprs" className="footer-link">À propos</Link></li>
              <li><Link to="/FAQ" className="footer-link">FAQ</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>
          <div className='col-md-2 mb-4'>
            <h4 className='footer-title'>Liens rapides</h4>
            <ul className='footer-list'>
              <li><Link to="/product" className="footer-link">Produits</Link></li>
              <li><Link to="/cart" className="footer-link">Panier</Link></li>
              <li><Link to="/checkout" className="footer-link">Commander</Link></li>
            </ul>
          </div>
        </div>
        <div className='row'>
          <div className='col-12 text-center'>
            <p className='footer-text'>&copy;{new Date().getFullYear()} Sanny_Shop. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
