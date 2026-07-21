import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Logo from "../assets/ajaisikam.png"

function AppNavbar() {
    const navigate = useNavigate() //here useNavigate is a hook it acts like a link to another page, navigate is function and 


    return (
        <Navbar sticky="top" bg="white" expand="lg" className="shadow-sm py-3">
            <Container>

                <Navbar.Brand href="/" className="fw-bold text-success fs-4">
                    < img src={Logo} alt="Ajaisikam" width = "90" height="65" className='me-2'/>
                    
                    आजै सिकम : Mentoring Platform
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-nav" />

                <Navbar.Collapse id="main-nav">
                    <Nav className="ms-auto align-items-center gap-3">


                        <Nav.Link
                            onClick={() => navigate('/')}
                            className="text-success fw-semibold"
                            style={{ cursor: 'pointer' }}
                        >
                            Home
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => navigate('/about')}
                            className="text-success fw-semibold"
                            style={{ cursor: 'pointer' }}
                        >
                            About
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => {
                                if (window.location.pathname !== '/') {
                                    navigate('/')
                                    // Wait for navigation + render, then scroll
                                    setTimeout(() => {
                                        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                                    }, 300)
                                } else {
                                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                                }
                            }}
                            className="text-success fw-semibold"
                            style={{ cursor: 'pointer' }}
                        >
                            How it works
                        </Nav.Link>


                        <Button variant="outline-success" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button variant="success" onClick={() => navigate('/register')}>
                            Register
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar