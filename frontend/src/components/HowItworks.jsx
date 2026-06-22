import { Container, Row, Col, Card } from 'react-bootstrap'

// // we use array of objects to store data and use .map() to render them for easy anc clean code
const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description: 'Sign up as a seeker or mentor. Tell us your field, interests, and what you need or can offer.',
  },
  {
    number: '02',
    title: 'Post Your Request',
    description: 'Describe what guidance you need in plain words. No formal writing required — just be honest.',
  },
  {
    number: '03',
    title: 'AI Matches You',
    description: 'Our AI reads your request and finds the most suitable mentor for you automatically.',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-5">
      <Container>
        <h2 className="text-center fw-bold mb-2">How It Works</h2>
        <p className="text-center text-muted mb-5">Three simple steps to get the guidance you need</p>

        <Row className="g-4">
          
          {steps.map((step) => (
            //  this is unique key for React - required in lists
            <Col md={4} key={step.number}> 
              <Card className="h-100 border-0 shadow-sm text-center p-3">
                <Card.Body>
                  <div
                    className="text-success fw-bold mb-3"
                    style={{ fontSize: '2.5rem' }}
                  >
                    {/* // passing props to StepCard */}
                    {step.number}  
                  </div>
                  <Card.Title className="fw-bold">{step.title}</Card.Title>
                  <Card.Text className="text-muted">{step.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default HowItWorks