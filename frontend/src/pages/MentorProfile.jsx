import { Container, Card, Badge, Navbar, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/authService'

function MentorProfile() {
    const navigate = useNavigate()

    const mentorData = {
        skills: 'React, Django, REST API',
        experience: '2 years',
        points: 120,
        badge_level: 'BRONZE',
    }

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token')

            if (refreshToken) {
                await logoutUser({ refresh: refreshToken })
            }
        } catch (error) {
            console.log('Logout error:', error)
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('role')
            navigate('/login')
        }
    }

    return (
        <>
            <Navbar bg="white" className="shadow-sm px-4 py-3">
                <Navbar.Brand className="fw-bold text-success fs-4">
                    अजै सिकम : Mentoring Platform
                </Navbar.Brand>

                <div className="ms-auto">
                    <Button variant="success" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </Navbar>

            <Container className="py-5" style={{ maxWidth: '900px' }}>
                <Card className="shadow-sm border-0 p-4">
                    <h2 className="text-success mb-3">Mentor Profile</h2>

                    <div className="mb-3">
                        <h5 className="mb-1">Skills</h5>
                        <p>{mentorData.skills}</p>
                    </div>

                    <div className="mb-3">
                        <h5 className="mb-1">Experience</h5>
                        <p>{mentorData.experience}</p>
                    </div>

                    <div className="mb-3">
                        <h5 className="mb-1">Points</h5>
                        <p>{mentorData.points}</p>
                    </div>

                    <div>
                        <h5 className="mb-1">Badge Level</h5>
                        <Badge bg="secondary">{mentorData.badge_level}</Badge>
                    </div>
                </Card>
            </Container>
        </>
    )
}

export default MentorProfile