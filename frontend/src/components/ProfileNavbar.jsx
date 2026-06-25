import { Navbar, Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/authService'

function ProfileNavbar() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh_token")

      if (refresh) {
        await logoutUser({ refresh })
      }
    } catch (error) {
      console.log("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("role")
      navigate('/login')
    }
  }

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand className="fw-bold text-success fs-4">
          अजै सिकम : Mentoring Platform
        </Navbar.Brand>

        <Button variant="success" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    </Navbar>
  )
}

export default ProfileNavbar