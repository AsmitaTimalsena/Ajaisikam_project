import { Container, Row, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function HeroSection() {
  const navigate = useNavigate()

  return (
    // vh-100 makes it full screen height, d-flex centers content vertically
    <section className="bg-light d-flex align-items-center" style={{ minHeight: '90vh' }}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <h1 className="display-4 fw-bold text-dark mb-3">
              Find Your Mentor,<br />
              <span className="text-success">Shape Your Future</span>
            </h1>
            <p className="lead text-secondary mb-4">
              Connecting Nepali students with professionals who care.
            <p>Its engaging, judgment-free, and specifically built for Nepal.</p>
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button
                size="lg"
                variant="success"
                onClick={() => navigate('/register')}
              >
                I Need Guidance
              </Button>
              <Button
                size="lg"
                variant="outline-success"
                onClick={() => navigate('/register')}
              >
                I Want to Mentor
              </Button>
            </div>
            
            <p className="mt-4 text-muted small">
                Special support available for students from rural and remote areas of Nepal
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default HeroSection