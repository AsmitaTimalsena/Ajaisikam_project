import { useState } from 'react'
import { Container, Form, Button, Card, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'
import zxcvbn from "zxcvbn";
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'SEEKER',
    full_name: '',
    location: '',
  })

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const strength = zxcvbn(formData.password);
  const colors = [
    "danger",   // red
    "warning",  // yellow
    "warning",  // orange-ish
    "info",     // blue
    "success"   // green
  ];

  const labels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong"
  ];


  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await registerUser(formData)

      setSuccess(response.data.message || 'User registered successfully')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data) {
        const data = err.response.data;

        if (data.username) {
          setError(data.username[0]);
        } else if (data.email) {
          setError(data.email[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else if (data.detail) {
          setError(data.detail);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError("Registration failed. Please check your details.");
        }
      } else {
        setError("Unable to connect to the server.");
      }
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <Card className="shadow p-4">
        <h2 className="text-success mb-4 text-center">Register</h2>

        {success && <Alert variant="success">{success}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} minLength={8} required />
            {formData.password && (
              <ProgressBar
                now={(strength.score + 1) * 20}
                variant={colors[strength.score]}
                label={labels[strength.score]}
                animated
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="SEEKER">Seeker</option>
              <option value="MENTOR">Mentor</option>
              {/* <option value="BOTH">Both</option> */}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            Register
          </Button>
          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-decoration-none fw-semibold"
              style={{ color: "#0aac0a" }}
            >
              Login
            </Link>
          </p>
        </Form>
      </Card>
    </Container>
  )
}

export default RegisterPage