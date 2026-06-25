import { useState } from 'react'
import { Form, Button, Card, Container, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await loginUser(formData)

      // store tokens + role
      localStorage.setItem('token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('role', response.data.role)
      localStorage.setItem("full_name", response.data.full_name)
      localStorage.setItem("location", response.data.location)

      // redirect based on role
      if (response.data.role === 'SEEKER') {
        navigate('/seeker-profile')
      } else if (response.data.role === 'MENTOR') {
        navigate('/mentor-profile')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <Card className="shadow-sm p-4 border-0">
        <h2 className="text-success mb-4 text-center">Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default LoginPage