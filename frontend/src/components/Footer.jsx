import { Container, Row, Col } from 'react-bootstrap'

function Footer() {
  return (
    <footer className="bg-grey text-light pt-5 pb-4 mt-5">
      <Container>

        <Row className="mb-4">
          {/* Brand Section */}
          <Col md={5}>
            <h4 className="fw-bold text-success mb-3">
              🇳🇵 AjaiSikam
            </h4>

            <p className="text-secondary" style={{ lineHeight: '1.7' }}>
              A modern mentoring platform that connects learners with the right mentors,
              helping students grow faster with real guidance and AI-powered matching.
            </p>
          </Col>

          {/* Links */}
          <Col md={3}>
            <h6 className="fw-bold mb-3">Platform</h6>
            <div className="d-flex flex-column gap-2">
              <a href="/" className="text-secondary text-decoration-none">Home</a>
              <a href="#how-it-works" className="text-secondary text-decoration-none">How it works</a>
              <a href="/register" className="text-secondary text-decoration-none">Become a user</a>
              
            </div>
          </Col>

          {/* Support */}
          <Col md={4}>
            <h6 className="fw-bold mb-3">Support</h6>
            <div className="d-flex flex-column gap-2">
              
              <a href="/About" className="text-secondary text-decoration-none">About</a>
              <a href="#" className="text-secondary text-decoration-none">Contact Us</a>
              <a href="/login" className="text-secondary text-decoration-none">Login</a>
              
            </div>
          </Col>
        </Row>

        <hr className="border-secondary" />

        {/* Bottom row */}
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <small className="text-secondary">
              © {new Date().getFullYear()} AjaiSikam: Built with purpose by -  Asmita Timalsena
            </small>
          </Col>

          <Col md={6} className="text-center text-md-end">
            <small className="text-secondary">
              Empowering learners through mentorship & AI
            </small>
          </Col>
        </Row>

      </Container>
    </footer>
  )
}

export default Footer