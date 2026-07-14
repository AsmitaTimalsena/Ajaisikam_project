import { Container, Carousel, Card, Row, Col } from 'react-bootstrap'
import Footer from '../components/Footer'

function About() {
  return (
    <div className="py-5 bg-light min-vh-100">
      <Container>
        {/* Page title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-success">About AjaiSikam</h2>
          <p className="text-muted mb-0">
            A smart AI-powered mentoring platform connecting students with the right guidance.
          </p>
        </div>

        <Carousel
          indicators={true}
          interval={null}
          className="about-carousel shadow-sm rounded overflow-hidden"
        >
          {/* Slide 1 */}
          <Carousel.Item>
            <Card
              className="border-0 p-5 text-center about-slide-card"
              style={{ minHeight: '420px' }}
            >
              <Card.Body className="d-flex flex-column justify-content-center">
                <h3 className="fw-bold text-success mb-4">The Problem</h3>
                <p className="text-muted fs-5">
                  Thousands of students and graduates lack proper guidance. Many are confused about
                  career paths, research opportunities, first jobs, and who to ask for honest advice.
                  Some feel shy, embarrassed, or simply don’t have the right people around them.
                </p>
              </Card.Body>
            </Card>
          </Carousel.Item>

          {/* Slide 2 */}
          <Carousel.Item>
            <Card
              className="border-0 p-5 text-center about-slide-card"
              style={{ minHeight: '420px' }}
            >
              <Card.Body className="d-flex flex-column justify-content-center">
                <h3 className="fw-bold text-success mb-4">Our Solution</h3>
                <p className="text-muted fs-5">
                  AjaiSikam helps seekers find the right mentors using AI-powered matching.
                  Instead of posting into a random forum and hoping someone replies,
                  users get mentor recommendations based on their actual needs.
                </p>
              </Card.Body>
            </Card>
          </Carousel.Item>

          {/* Slide 3 */}
          <Carousel.Item>
            <Card
              className="border-0 p-5 about-slide-card"
              style={{ minHeight: '420px' }}
            >
              <Card.Body className="d-flex flex-column justify-content-center">
                <h3 className="fw-bold text-success text-center mb-4">Who Is It For?</h3>
                <Row className="justify-content-center">
                  <Col md={8}>
                    <ul className="text-muted fs-5">
                      <li>Students and recent graduates</li>
                      <li>People switching careers</li>
                      <li>Research aspirants looking for guidance</li>
                      <li>Anyone who needs mentorship but lacks a professional network</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Carousel.Item>

          {/* Slide 4 */}
          <Carousel.Item>
            <Card
              className="border-0 p-5 about-slide-card"
              style={{ minHeight: '420px' }}
            >
              <Card.Body className="d-flex flex-column justify-content-center">
                <h3 className="fw-bold text-success text-center mb-4">Why It Matters</h3>
                <Row className="g-4 justify-content-center">
                  <Col md={5}>
                    <Card className="border-0 shadow-sm h-100 p-3 text-center">
                      <h5 className="fw-bold">For Seekers</h5>
                      <p className="text-muted mb-0">
                        Get faster access to guidance, better career decisions, and less confusion.
                      </p>
                    </Card>
                  </Col>
                  <Col md={5}>
                    <Card className="border-0 shadow-sm h-100 p-3 text-center">
                      <h5 className="fw-bold">For the Community</h5>
                      <p className="text-muted mb-0">
                        Build a healthy mentoring culture, meaningful networking, and support mental well-being.
                      </p>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Carousel.Item>

          {/* Slide 5 */}
          <Carousel.Item>
            <Card
              className="border-0 p-5 text-center about-slide-card"
              style={{ minHeight: '420px' }}
            >
              <Card.Body className="d-flex flex-column justify-content-center">
                <h3 className="fw-bold text-success mb-4">How the Platform Works</h3>
                <p className="text-muted fs-5">
                  AjaiSikam is built with React, Django REST Framework, and PostgreSQL.
                  AI models help categorize help requests and match seekers with relevant mentors.
                </p>
              </Card.Body>
            </Card>
          </Carousel.Item>

          {/* Slide 6 */}
          <Carousel.Item>
            <Card
              className="border-0 p-5 text-center about-slide-card"
              style={{ minHeight: '420px' }}
            >
              <Card.Body className="d-flex flex-column justify-content-center">
                <h3 className="fw-bold text-success mb-4">MVP Scope</h3>
                <p className="text-muted fs-5">
                  Users can register as seekers or mentors, post help requests,
                  receive AI-based mentor suggestions, send connection requests,
                  and exchange simple threaded messages once connected.
                </p>
              </Card.Body>
            </Card>
          </Carousel.Item>
        </Carousel>
      </Container>
      <Footer />
    </div>
    
  )
}

export default About