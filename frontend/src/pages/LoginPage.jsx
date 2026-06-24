import { useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [success, setSuccess] = useState('')
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
    setSuccess('')

    try {
      const response = await loginUser(formData)

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)

      setSuccess('Login successful')

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      console.log(err)
      setError('Invalid username or password')
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <Card className="shadow p-4">
        <h2 className="text-success mb-4 text-center">Login</h2>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
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