import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar } from 'react-bootstrap'
import ProfileNavbar from '../components/ProfileNavbar'
import { getMentorProfile, updateMentorProfile, getRecommendedPosts } from '../services/authService'

const categories = ['CAREER', 'RESEARCH', 'TECH', 'EDUCATION', 'CHEMISTRY', 'BIOLOGY', 'PHYSICS', 'ASTRONOMY', 'LITERATURE', 'BUSINESS', 'OTHER']

function MentorProfile() {

    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    const [showProfileForm, setShowProfileForm] = useState(false)

    const [profileForm, setProfileForm] = useState({
        location: '',
        bio: '',
        experience: '',
        expertise: [],
        custom_expertise: ''
    })

    const fullName = localStorage.getItem('full_name') || 'Mentor'
    const role = localStorage.getItem('role') || 'MENTOR'
    const location = localStorage.getItem('location') || 'Not added'
    const initial = fullName.charAt(0).toUpperCase()

    const badgeColor = {
        BRONZE: 'secondary',
        SILVER: 'info',
        GOLD: 'warning',
        PLATINUM: 'dark'
    }

    const getCompletion = () => {
        let filled = 0
        const total = 4

        if (profile?.bio) filled++
        if (profile?.experience) filled++
        if (profile?.expertise?.length) filled++
        if (profile?.location) filled++

        return Math.round((filled / total) * 100)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {

            const profileRes = await getMentorProfile()
            const postsRes = await getRecommendedPosts()
            console.log(profileRes.data)
            console.log(postsRes.data)

            setProfile(profileRes.data)

            setProfileForm({
                ...profileRes.data,
                location: profileRes.data.location || '',
                expertise: profileRes.data.expertise || []
            })

            setPosts(postsRes.data)

        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }

    const handleProfileChange = (e) => {
        const { name, value } = e.target

        setProfileForm({
            ...profileForm,
            [name]: value
        })
    }

    const handleCheckbox = (field, value) => {

        const current = profileForm[field]

        if (current.includes(value)) {

            setProfileForm({
                ...profileForm,
                [field]: current.filter(item => item !== value)
            })

        } else {

            setProfileForm({
                ...profileForm,
                [field]: [...current, value]
            })

        }

    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()

        try {

            const res = await updateMentorProfile(profileForm)

            setProfile(res.data)

            localStorage.setItem('location', res.data.location || '')

            setShowProfileForm(false)

        } catch (err) {

            console.log(err)

        }
    }
    if (loading) {
        return <h3 className="text-center mt-5">Loading...</h3>
    }

    return (
        <>
            <ProfileNavbar />

            <Container className="py-4">

                {/* Top Profile */}
                <Card className="shadow-sm border-0 mb-4">
                    <Card.Body>
                        <Row className="align-items-center">

                            <Col md={2} className="text-center">
                                <div
                                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto"
                                    style={{ width: "90px", height: "90px", fontSize: "32px", fontWeight: "bold" }}
                                >
                                    {initial}
                                </div>
                            </Col>

                            <Col md={7}>
                                <h3 className="fw-bold">{fullName}</h3>
                                <p className="text-muted mb-1">Role: {role}</p>
                                <p className="text-muted mb-1">Location: {location}</p>
                                <p>{profile?.bio || "No bio added yet."}</p>
                            </Col>

                            <Col md={3}>
                                <Card className="bg-light border-0">
                                    <Card.Body>
                                        <h6>Profile Completion</h6>

                                        <ProgressBar
                                            now={getCompletion()}
                                            label={`${getCompletion()}%`}
                                            className="mb-3"
                                        />

                                        <Button
                                            variant="success"
                                            onClick={() => setShowProfileForm(!showProfileForm)}
                                        >
                                            {showProfileForm ? "Close" : "Edit Profile"}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                        </Row>
                    </Card.Body>
                </Card>


                {/* Edit Profile */}

                {showProfileForm && (

                    <Card className="shadow-sm border-0 mb-4">
                        <Card.Body>

                            <h4 className="mb-4">Edit Mentor Profile</h4>

                            <Form onSubmit={handleSaveProfile}>

                                <Row>

                                    <Col md={6} className="mb-3">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control
                                            name="location"
                                            value={profileForm.location}
                                            onChange={handleProfileChange}
                                        />
                                    </Col>

                                    <Col md={6} className="mb-3">
                                        <Form.Label>Experience</Form.Label>
                                        <Form.Control
                                            name="experience"
                                            value={profileForm.experience}
                                            onChange={handleProfileChange}
                                        />
                                    </Col>

                                    <Col md={12} className="mb-3">
                                        <Form.Label>Bio</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="bio"
                                            value={profileForm.bio}
                                            onChange={handleProfileChange}
                                        />
                                    </Col>

                                    <Col md={12}>
                                        <Form.Label>Areas of Expertise</Form.Label>

                                        <Row>

                                            {categories.map(category => (

                                                <Col md={4} key={category} className="mb-2">

                                                    <Form.Check
                                                        type="checkbox"
                                                        label={category}
                                                        checked={profileForm.expertise.includes(category)}
                                                        onChange={() => handleCheckbox("expertise", category)}
                                                    />

                                                </Col>

                                            ))}

                                        </Row>

                                    </Col>

                                    {profileForm.expertise.includes("OTHER") && (

                                        <Col md={12} className="mt-3">

                                            <Form.Control
                                                placeholder="Enter custom expertise"
                                                name="custom_expertise"
                                                value={profileForm.custom_expertise}
                                                onChange={handleProfileChange}
                                            />

                                        </Col>

                                    )}

                                </Row>

                                <Button type="submit" variant="success" className="mt-4">
                                    Save Profile
                                </Button>

                            </Form>

                        </Card.Body>
                    </Card>

                )}
                {/* Bottom Cards */}

                <Row>

                    <Col md={4}>

                        <Card className="shadow-sm border-0 mb-4">
                            <Card.Body>

                                <h5 style={{ color: "#4E220F" }}>My Expertise</h5>

                                <div className="d-flex flex-wrap gap-2 mt-3">

                                    {profile?.expertise?.map(skill => (

                                        <Badge key={skill} bg="success">
                                            {skill}
                                        </Badge>

                                    ))}

                                    {profile?.custom_expertise && (
                                        <Badge bg="warning">
                                            {profile.custom_expertise}
                                        </Badge>
                                    )}

                                </div>

                            </Card.Body>
                        </Card>

                    </Col>

                    <Col md={4}>

                        <Card className="shadow-sm border-0 mb-4">
                            <Card.Body>

                                <h5 style={{ color: "#4E220F" }}>Experience</h5>

                                <p>{profile?.experience || "Not added"}</p>

                            </Card.Body>
                        </Card>

                    </Col>

                    <Col md={4}>

                        <Card className="shadow-sm border-0 mb-4">
                            <Card.Body>

                                <h5 style={{ color: "#4E220F" }}>Mentor Badge</h5>

                                <Badge bg={badgeColor[profile?.badge_level]}>
                                    {profile?.badge_level}
                                </Badge>

                                <hr />

                                <p className="mb-0">
                                    <strong>Points:</strong> {profile?.points}
                                </p>

                            </Card.Body>
                        </Card>

                    </Col>

                </Row>
                {/* Recommended Posts */}

                <Card className="shadow-sm border-0">
                    <Card.Body>

                        <h4 className="mb-4">Recommended Questions</h4>

                        {posts.length === 0 ? (

                            <p>No recommendations yet.</p>

                        ) : (

                            posts.map(post => (

                                <Card key={post.id} className="mb-3">

                                    <Card.Body>

                                        <h5>{post.title}</h5>

                                        <Badge bg="success">{post.category}</Badge>

                                        <p className="mt-3">{post.description}</p>

                                        <Button variant="outline-success">
                                            Reply
                                        </Button>

                                    </Card.Body>

                                </Card>

                            ))

                        )}

                    </Card.Body>
                </Card>

            </Container>

        </>
    )

}

export default MentorProfile