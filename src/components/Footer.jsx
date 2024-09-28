import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaEthereum,
  FaBook,
  FaShieldAlt,
  FaCode,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const FooterLink = ({ href, children, className = "" }) => (
  <a
    href={href}
    className={`text-blockchain-light hover:text-blockchain-accent transition-colors duration-200 ${className}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-blockchain-bg-dark text-blockchain-light py-12 shadow-lg border-t border-blockchain-accent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-blockchain-accent">
              Blockchain Security Hub
            </h3>
            <p className="text-sm leading-relaxed">
              Empowering the blockchain community with cutting-edge security
              knowledge. Our platform focuses on smart contract auditing,
              blockchain architecture, and advanced penetration testing
              techniques to build robust decentralized systems.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blockchain-accent">
              Essential Learning Resources
            </h3>
            <ul className="space-y-2">
              <li></li>
              <li></li>
              <li>
                <FooterLink href="https://remix.ethereum.org">
                  <FaEthereum className="inline mr-2" />
                  Remix IDE
                </FooterLink>
              </li>
              <li>
                <FooterLink href="https://ethernaut.openzeppelin.com/">
                  <FaBook className="inline mr-2" />
                  Ethernaut CTF
                </FooterLink>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blockchain-accent">
              Connect with Us
            </h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="https://github.com/blockchain-security-hub">
                  <FaGithub className="inline mr-2" />
                  GitHub
                </FooterLink>
              </li>
              <li>
                <FooterLink href="https://linkedin.com/company/blockchain-security-hub">
                  <FaLinkedin className="inline mr-2" />
                  LinkedIn
                </FooterLink>
              </li>
              <li>
                <FooterLink href="mailto:contact@blockchainsecurityhub.com">
                  <FaEnvelope className="inline mr-2" />
                  Email
                </FooterLink>
              </li>
              <li></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm border-t border-blockchain-accent pt-8">
          <p>
            © {new Date().getFullYear()} Blockchain Security Hub. All rights
            reserved.
          </p>
          <p className="mt-2 opacity-75">
            Securing the decentralized future, one block at a time.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
