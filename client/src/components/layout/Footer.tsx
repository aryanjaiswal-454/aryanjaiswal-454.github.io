import {
  ArrowUp,
  Github,
  Instagram,
  Linkedin,
  Mail
} from "lucide-react";
import site from "../../config/site.js";

const socialLinks = [
  { label: "GitHub", url: site.contact.github, icon: Github },
  { label: "LinkedIn", url: site.contact.linkedin, icon: Linkedin },
  { label: "Instagram", url: site.contact.instagram, icon: Instagram },
  { label: "Email", url: `mailto:${site.contact.email}`, icon: Mail }
].filter((link) => Boolean(link.url));

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <a className="wordmark footer-wordmark" href="#top" aria-label={site.ariaLabels.homeLink}>
          <span className="wordmark__symbol">{site.identity.wordmark}</span>
          <span className="wordmark__name">{site.identity.brandName}</span>
        </a>
        <p>Building intelligent systems for real-world impact.</p>
        <div className="footer-socials" aria-label="Social profiles">
          {socialLinks.map(({ label, url, icon: Icon }) => (
            <a key={label} href={url} aria-label={label} target="_blank" rel="noopener noreferrer">
              <Icon size={17} aria-hidden="true" />
            </a>
          ))}
          <a href="#top" className="back-to-top" aria-label={site.ariaLabels.backToTop}>
            <ArrowUp size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {site.identity.fullName}</span>
        <span>Designed with intent. Built with curiosity.</span>
      </div>
    </footer>
  );
}
