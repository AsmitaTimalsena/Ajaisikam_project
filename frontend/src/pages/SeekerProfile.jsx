import { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar, Modal } from 'react-bootstrap'
import ProfileNavbar from '../components/ProfileNavbar'
import {
  getSeekerProfile,
  updateSeekerProfile,
  getSeekerPosts,
  createSeekerPost,
  updateSeekerPost,
  deleteSeekerPost
} from '../services/authService'

function SeekerProfile() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [showProfileForm, setShowProfileForm] = useState(false)

  const [profileForm, setProfileForm] = useState({
    location: '',
    bio: '',
    learning_goal: '',
    interest: 'TECH',
    custom_interest: '',
    is_rural: false
  })

  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    category: 'TECH'
  })

  const [editingPostId, setEditingPostId] = useState(null)
  const [filterCategory, setFilterCategory] = useState('ALL')

  const fullName = localStorage.getItem("full_name") || "User"
  const role = localStorage.getItem("role") || "SEEKER"
  const location = localStorage.getItem("location") || "Not added"

  const initial = fullName ? fullName.charAt(0).toUpperCase() : "U"

  const categories = [
    'CAREER',
    'RESEARCH',
    'TECH',
    'EDUCATION',
    'CHEMISTRY',
    'BIOLOGY',
    'PHYSICS',
    'ASTRONOMY',
    'LITERATURE',
    'BUSINESS',
    'OTHER'
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return 'warning';
      case 'MATCHED':
        return 'success';
      case 'CONNECTED':
        return 'primary';
      case 'CLOSED':
        return 'danger';
      default:
        return 'secondary';
    }
  };



  useEffect(() => {
    fetchProfile()
    fetchPosts()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await getSeekerProfile()
      setProfile(res.data)

      setProfileForm({
        bio: res.data.bio || '',
        learning_goal: res.data.learning_goal || '',
        interest: res.data.interest || 'TECH',
        custom_interest: res.data.custom_interest || '',
        is_rural: res.data.is_rural || false
      })
    } catch (error) {
      console.log("Error fetching seeker profile:", error)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await getSeekerPosts()
      setPosts(res.data)
    } catch (error) {
      console.log("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target
    setProfileForm({
      ...profileForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      const res = await updateSeekerProfile(profileForm)
      setProfile(res.data)

      localStorage.setItem("location", res.data.location || "")

      setShowProfileForm(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handlePostChange = (e) => {
    const { name, value } = e.target
    setPostForm({
      ...postForm,
      [name]: value
    })
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault()

    try {
      if (editingPostId) {
        const res = await updateSeekerPost(editingPostId, postForm)
        setPosts(posts.map(post => post.id === editingPostId ? res.data : post))
        setEditingPostId(null)
      } else {
        const res = await createSeekerPost(postForm)
        setPosts([res.data, ...posts])
      }

      setPostForm({
        title: '',
        description: '',
        category: 'TECH'
      })
    } catch (error) {
      console.log("Error saving post:", error)
    }
  }

  const handleEditPost = (post) => {
    setEditingPostId(post.id)
    setPostForm({
      title: post.title,
      description: post.description,
      category: post.category
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openDeleteModal = (postId) => {
    setSelectedPostId(postId);
    setShowDeleteModal(true);
  };

  const handleDeletePost = async () => {
    try {
      await deleteSeekerPost(selectedPostId);
      setShowDeleteModal(false);
      setSelectedPostId(null);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const getProfileCompletion = () => {
    let filled = 0
    const total = 4

    if (profile?.bio) filled++
    if (profile?.learning_goal) filled++
    if (profile?.interest) filled++
    if (profile?.is_rural !== null && profile?.is_rural !== undefined) filled++

    return Math.round((filled / total) * 100)
  }

  const filteredPosts =
    filterCategory === 'ALL'
      ? posts
      : posts.filter(post => post.category === filterCategory)

  return (
    <>
      <ProfileNavbar />

      <Container className="py-4">
        {/* top profile section */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={2} className="text-center mb-3 mb-md-0">
                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: '90px', height: '90px', fontSize: '32px', fontWeight: 'bold' }}
                >
                  {initial}
                </div>
              </Col>

              <Col md={7}>
                <h3 className="fw-bold mb-1">{fullName}</h3>
                <p className="mb-1 text-muted">Role: {role}</p>
                <p className="mb-1 text-muted">Location: {profile?.location || "Not added"}</p>
                <p className="mb-0">
                  <strong>Bio:</strong> {profile?.bio || 'Not added yet'}
                </p>
                <div className="d-flex gap-2 flex-wrap mt-2">

                  {profile?.is_rural && (
                    <span className="badge bg-warning-subtle text-dark border border-warning">
                      Remote Student
                    </span>
                  )}
                </div>
              </Col>

              <Col md={3}>
                <Card className="bg-light border-0">
                  <Card.Body>
                    <h6 className="fw-bold">Profile Completion</h6>
                    <p className="mb-2">{getProfileCompletion()}% complete</p>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setShowProfileForm(!showProfileForm)}
                    >
                      {showProfileForm ? 'Close' : 'Edit Profile'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* edit profile form */}
        {showProfileForm && (
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">Edit Seeker Profile</h5>

              <Form onSubmit={handleSaveProfile}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"

                      name="location"
                      value={profileForm.location}
                      onChange={handleProfileChange}
                      placeholder="Enter your location"
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Short Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Learning Goal</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="learning_goal"
                      value={profileForm.learning_goal}
                      onChange={handleProfileChange}
                    />
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Label>Interest</Form.Label>
                    <Form.Select
                      name="interest"
                      value={profileForm.interest}
                      onChange={handleProfileChange}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Col>

                  {profileForm.interest === 'OTHER' && (
                    <Col md={6} className="mb-3">
                      <Form.Label>Custom Interest</Form.Label>
                      <Form.Control
                        type="text"
                        name="custom_interest"
                        value={profileForm.custom_interest}
                        onChange={handleProfileChange}
                        placeholder="Write your interest"
                      />
                    </Col>
                  )}

                  <Col md={6} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="I am from a rural / remote area"
                      name="is_rural"
                      checked={profileForm.is_rural}
                      onChange={handleProfileChange}
                    />
                  </Col>
                </Row>

                <Button variant="success" type="submit">
                  Save Profile
                </Button>
              </Form>
            </Card.Body>
          </Card>
        )}

        <Row>
          {/* left side */}
          <Col md={8}>
            {/* post question */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  {editingPostId ? 'Edit Learning Need' : 'Post a Learning Need'}
                </h5>

                <Form onSubmit={handleSubmitPost}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={postForm.title}
                      onChange={handlePostChange}
                      placeholder="Example: Need help with web development roadmap"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="description"
                      value={postForm.description}
                      onChange={handlePostChange}
                      placeholder="Describe what kind of guidance you need..."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="category"
                      value={postForm.category}
                      onChange={handlePostChange}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button variant="success" type="submit">
                    {editingPostId ? 'Update Post' : 'Post Question'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            {/* latest posts */}
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Latest Learning Needs</h5>

                  <Form.Select
                    style={{ width: '220px' }}
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </div>

                {loading ? (
                  <p>Loading...</p>
                ) : filteredPosts.length === 0 ? (
                  <p className="text-muted">No learning posts yet.</p>
                ) : (
                  filteredPosts.map(post => (
                    <Card key={post.id} className="mb-3 border">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="fw-bold">{post.title}</h6>
                            <Badge bg="success" className="mb-2">{post.category}</Badge>
                            <p className="mb-2">{post.description}</p>
                            <Badge bg={getStatusBadge(post.status)}>
                              Status: {post.status}
                            </Badge>
                          </div>

                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => handleEditPost(post)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => openDeleteModal(post.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* right side */}
          <Col md={4}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="fw-bold" style={{ color: '#4E220F' }}>My Interest</h5>
                <div className="d-flex gap-2 flex-wrap mt-2">
                  {profile?.interest && (
                    <span className="badge bg-danger-subtle text-danger border border-danger">
                      {profile.interest === "OTHER" ? profile.custom_interest : profile.interest}
                    </span>
                  )}

                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="fw-bold" style={{ color: '#4E220F' }}>My Goal / What I Need Help With</h5>
                <p className="mb-0">{profile?.learning_goal || 'Not added yet'}</p>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="fw-bold" style={{ color: '#4E220F' }}>Requested Mentorship</h5>
                <p className="text-muted mb-0">No mentorship requests yet</p>
              </Card.Body>
            </Card>

            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <h5 className="fw-bold" style={{ color: '#4E220F' }} >Recommended Mentors</h5>

                <Card className="mb-2 bg-light border-0">
                  <Card.Body>
                    <h6 className="mb-1">Mentor 1</h6>
                    <small className="text-muted">Web Development</small>
                  </Card.Body>
                </Card>

                <Card className="mb-2 bg-light border-0">
                  <Card.Body>
                    <h6 className="mb-1">Mentor 2</h6>
                    <small className="text-muted">AI / ML</small>
                  </Card.Body>
                </Card>

                <Card className="bg-light border-0">
                  <Card.Body>
                    <h6 className="mb-1">Mentor 3</h6>
                    <small className="text-muted">Career Guidance</small>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this post?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  )
}

export default SeekerProfile