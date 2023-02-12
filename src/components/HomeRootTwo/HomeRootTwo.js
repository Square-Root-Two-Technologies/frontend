import { Link } from "react-router-dom";
import "./style.css";
import asset1 from "./assets/asset 1.png";
import asset2 from "./assets/asset 2.png";
import asset11 from "./assets/javascript.svg";
import asset13 from "./assets/cloud.svg";
import asset15 from "./assets/automation.svg";
import asset16 from "./assets/society.svg";
import asset17 from "./assets/life.svg";
import asset18 from "./assets/asset18a.png";
import asset21 from "./assets/asset21b.png";
import asset24 from "./assets/asset24a.png";
import asset3 from "./assets/asset 3.png";
import asset4 from "./assets/asset 4.png";
import asset5 from "./assets/asset 5.png";
import asset6 from "./assets/asset 6.png";
import asset7 from "./assets/asset 7.png";
import asset8 from "./assets/asset 8.svg";
import asset9 from "./assets/asset 9.png";
import asset14 from "./assets/games.svg";
import earth from "./assets/earth.png";
import two from "./assets/two.svg";

function HomeRootTwo() {
  return (
    <div className="container_main">
      <header>
        <div className="container header-section flex">
          <div className="header-left">
            <h1>Square Root Two Technologies</h1>
            <p>Finite problems | Infinite Solutions</p>
            <Link to="/" className="primary-button get-started-btn">
              Get Started
            </Link>
          </div>
          <div className="header-right">
            <img src={earth} alt="earth " />
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="container">
          <div className="features-header">
            <h2 className="features-heading-text">
              Your user research Swiss Army knife
            </h2>
            <Link to="/" className="secondary-button">
              See all features <i className="fa-solid fa-right-long"></i>
            </Link>
          </div>
          <div className="features-area flex">
            <div className="features-card flex">
              <img src={asset11} alt="" />
              <h3>Javascript</h3>
              <p>Discover our blogs and services in JavaScript.</p>
              <Link to="/" className="secondary-button">
                Learn More <i className="fa-solid fa-right-long"></i>
              </Link>
            </div>
            <div className="features-card flex">
              <img src={asset13} alt="" />
              <h3>Salesforce</h3>
              <p>Take your business to the zenith with Salesforce.</p>
              <Link to="/" className="secondary-button">
                Learn more <i className="fa-solid fa-right-long"></i>
              </Link>
            </div>
            <div className="features-card flex">
              <img src={asset14} alt="" />
              <h3>Games</h3>
              <p>Play games and join our community of gamers.</p>
              <Link to="/" className="secondary-button">
                Learn more <i className="fa-solid fa-right-long"></i>
              </Link>
            </div>
            <div className="features-card flex">
              <img src={asset15} alt="" />
              <h3>Automation Anywhere</h3>
              <p>
                Read blogs and explore services to automate your businesses.
              </p>
              <Link to="/" className="secondary-button">
                Learn more <i className="fa-solid fa-right-long"></i>
              </Link>
            </div>
            <div className="features-card flex">
              <img src={asset16} alt="" />
              <h3>Sociology</h3>
              <p>Read blogs on Sociology and Corporate Communication.</p>
              <Link to="/" className="secondary-button">
                Learn more <i className="fa-solid fa-right-long"></i>
              </Link>
            </div>
            <div className="features-card flex">
              <img src={asset17} alt="" />
              <h3>Life</h3>
              <p>Read blogs on life, history and philosophy.</p>
              <Link to="/" className="secondary-button">
                Learn more <i className="fa-solid fa-right-long"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="big-feature-section">
        <div className="container flex big-feature-container">
          <div className="feature-img-asset21">
            <img src={asset21} alt="" />
          </div>
          <div className="feature-desc flex">
            <h4>JavaScript</h4>
            <h3>The language of the internet</h3>
            <br></br>
            <p>
              Read javascript blogs and get your problems solved. Check out
              custom projects on javascript and explore services.
            </p>
          </div>
        </div>
      </section>

      <section className="big-feature-section">
        <div
          className="container flex big-feature-container"
          id="second-big-feature"
        >
          <div className="feature-img">
            <img src={asset18} alt="" />
          </div>
          <div className="feature-desc flex">
            <h4>Salesforce</h4>
            <h3>Sales and Finance Cloud</h3>
            <br></br>
            <p>
              Unlock the Power of Salesforce Sales Cloud with Lightning Web
              Components: Boost Your Business and Development. We look forward
              to working with you and helping you achieve your goals!
            </p>
          </div>
        </div>
      </section>

      <section className="big-feature-section">
        <div className="container flex big-feature-container">
          <div className="feature-img">
            <img src={asset24} alt="" />
          </div>
          <div className="feature-desc flex">
            <h4>Play games</h4>
            <h3>Babylon .js, PixiJS, GDevelop</h3>
            <br></br>
            <p>
              Unleash Your Creativity - Play Games Custom Built in JavaScript
              and Join a Growing Community!
            </p>
          </div>
        </div>
      </section>

      <section className="examples-section">
        <div className="container">
          <div className="examples-header flex">
            <h2 className="examples-heading-text">Meet our team</h2>
          </div>
          <div className="examples-area flex">
            <Link to="/" className="examples-card">
              <div className="card-text">
                <h5>Raisa Islam</h5>
                <h5>Department of Sociology</h5>
                <h5>Amsterdam Business School</h5>
              </div>
            </Link>
            <Link className="examples-card" to="/">
              <div className="card-text">
                <h5>Rasik Islam</h5>
                <h5>Consultant,</h5>
                <h5>Data Engineering</h5>
              </div>
            </Link>
            <Link className="examples-card" to="/">
              <div className="card-text">
                <h5>Farhan Gazi</h5>
                <h5>Philosopher, Engineer</h5>
              </div>
            </Link>
            <Link className="examples-card" to="/">
              <div className="card-text">
                <h5>Tanvir Raihan Islam</h5>
                <h5>Problem Solver</h5>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container flex cta-section-container">
          <h2>Get Started Today</h2>
          <p>
            Unlock your potential with our multi-faceted platform. Whether
            you're looking to enhance your JavaScript skills, explore the
            fascinating world of Salesforce, or immerse yourself in exciting
            games and automation, we've got you covered. But that's not all -
            our expert team also brings you thought-provoking insights on
            sociology, life, history, and philosophy. With our comprehensive
            resources and unparalleled expertise, you'll gain the knowledge and
            tools you need to succeed in all aspects of your personal and
            professional life. Join our community today and unleash your full
            potential!
          </p>
          <Link to="/" className="primary-button">
            Get Started
          </Link>
        </div>
      </section>

      <footer>
        <div className="container flex footer-container">
          <Link to="/" className="company-logo">
            Square Root Two Technologies
          </Link>
          <div className="link-column flex">
            <h4>Services</h4>
            <Link to="/" className="hover-link">
              Blogs
            </Link>
            <Link to="/" className="hover-link">
              Games
            </Link>
            <Link to="/" className="hover-link">
              Jobs
            </Link>
            <Link to="/" className="hover-link">
              Customers Page
            </Link>
            <Link to="/" className="hover-link">
              Status Page
            </Link>
          </div>

          <div className="link-column flex">
            <h4>Resources</h4>
            <Link to="/" className="hover-link">
              Blogs
            </Link>
            <Link to="/" className="hover-link">
              Games
            </Link>
            <Link to="/" className="hover-link">
              Square Root Two Technologies
            </Link>
            <Link to="/" className="hover-link">
              Customers Page
            </Link>
            <Link to="/" className="hover-link">
              Status Page
            </Link>
          </div>
        </div>
      </footer>

      <div className="subfooter">
        <div className="container flex subfooter-container">
          <Link className="hover-link" to="/">
            Privacy policy
          </Link>
          <Link className="hover-link" to="/">
            Terms & Condition
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeRootTwo;
