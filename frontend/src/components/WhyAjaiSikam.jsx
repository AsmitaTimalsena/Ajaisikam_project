import { Container, Row, Col } from 'react-bootstrap'
import NepalIcon from "../assets/nepal.png"


// object array
const highlights = [
  { image: NepalIcon, title: 'Built for Nepal', description: 'Designed around the real challenges Nepali students face every day.' },
  { icon: '🤖', title: 'AI-Powered Matching', description: 'Smart matching connects you with the right person, not just any random reply.' },
  { icon: '🆓', title: 'Free for Students', description: 'No fees, no subscriptions. Guidance should be accessible to everyone.' },
  { icon: '🌄', title: 'Supporting Rural Students', description: 'Special focus on students from remote areas who have less access to networks.' },
]

function WhyNepalMentor() {
  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="text-center fw-bold mb-2">Why AjaiSikam(अजै सिकाम)?</h2>
        <p className="text-center text-muted mb-5">Connect students in Nepal with professionals and seniors willing to guide them:in their field, in their language.</p>

        <Row className="g-4">
          {highlights.map((item) => (
            <Col md={3} sm={6} key={item.title}>
              <div className="text-center p-3">
                <div className="mb-3">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "50px", height: "50px", objectFit: "contain" }}
                    />
                  ) : (
                    <div style={{ fontSize: "2.5rem" }}>{item.icon}</div>
                  )}
                </div>
                <h5 className="fw-bold">{item.title}</h5>
                <p className="text-muted small">{item.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default WhyNepalMentor