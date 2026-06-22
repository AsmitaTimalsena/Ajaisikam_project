import { Container, Row, Col, Card } from 'react-bootstrap'

function About() {
  return (
    <div className="py-5">

      <Container>

        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-success">About AjaiSikam</h2>
          <p className="text-muted">
            A smart AI-powered mentoring platform connecting students with the right guidance.
          </p>
        </div>

        {/* Problem Statement */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">Problem</h5>
              <p className="text-muted mb-0">
                Thousands of students and graduates lack proper guidance.
                They are confused about career paths, research opportunities,
                job preparation, and often feel shy or unsure where to ask for help.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Solution / AI Feature */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">Our Solution</h5>
              <p className="text-muted mb-0">
                AjaiSikam connects seekers with mentors using AI-based matching.
                Instead of random forums, the platform intelligently understands
                user requests and suggests the most relevant mentors.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Target Users + Value */}
        <Row className="g-4 mb-4">
          <Col md={6}>
            <Card className="border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-3">Who is it for?</h5>
              <ul className="text-muted mb-0">
                <li>Students & recent graduates</li>
                <li>Career switchers</li>
                <li>Research aspirants</li>
                <li>Anyone needing guidance</li>
              </ul>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="border-0 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-3">Value</h5>
              <ul className="text-muted mb-0">
                <li>Faster access to guidance</li>
                <li>AI-powered mentor matching</li>
                <li>Better career decisions</li>
                <li>Reduced confusion & stress</li>
              </ul>
            </Card>
          </Col>
        </Row>

        {/* System Overview */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">How it Works (System)</h5>
              <p className="text-muted mb-0">
                Built using React frontend, Django REST backend, PostgreSQL database,
                and Hugging Face AI models for request classification and mentor matching.
              </p>
            </Card>
          </Col>
        </Row>

        {/* MVP Scope */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-3">MVP Scope</h5>
              <p className="text-muted mb-0">
                Users can register as seekers or mentors, post help requests,
                receive AI-based mentor suggestions, connect, and communicate
                through a simple messaging system.
              </p>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  )
}

export default About