import { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, ProgressBar, Modal } from 'react-bootstrap'
import ProfileNavbar from '../components/ProfileNavbar'
import { getMentorProfile, updateMentorProfile, getRecommendedPosts, createReply, } from '../services/authService'
import { getMyReplies, deleteReply, updateReply } from '../services/authService'

const categories = ['CAREER', 'RESEARCH', 'TECH', 'EDUCATION', 'CHEMISTRY', 'BIOLOGY', 'PHYSICS', 'ASTRONOMY', 'LITERATURE', 'BUSINESS', 'OTHER']

function MentorProfile() {

    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [myReplies, setMyReplies] = useState([])
    const [editingReplyId, setEditingReplyId] = useState(null)
    const [replyingPostId, setReplyingPostId] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedReplyId, setSelectedReplyId] = useState(null)


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
            const repliesRes = await getMyReplies()

            console.log(profileRes.data)
            console.log(postsRes.data)
            console.log(repliesRes.data[0])

            setProfile(profileRes.data)

            setProfileForm({
                ...profileRes.data,
                location: profileRes.data.location || '',
                expertise: profileRes.data.expertise || []
            })

            setPosts(postsRes.data)
            setMyReplies(repliesRes.data)

        } catch (err) {
            console.log(err)
        } finally {
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

            console.log(res.data);
            setProfile(res.data)

            localStorage.setItem('location', res.data.location || '')

            setShowProfileForm(false)

        } catch (err) {

            console.log(err)

        }
    }


    const confirmDeleteReply = (id) => {
        setSelectedReplyId(id)
        setShowDeleteModal(true)
    }

    const handleDeleteReply = async () => {
        try {
            await deleteReply(selectedReplyId)
            setShowDeleteModal(false)
            fetchData()
        } catch (err) {
            console.log(err)
        }
    }

    const [replyForm, setReplyForm] = useState({
        reply: '',
        share_contact: false,
        contact_info: ''
    })

    const handleUpdateReply = async () => {

        try {

            await updateReply(editingReplyId, replyForm)

            fetchData()

            setEditingReplyId(null)

        } catch (err) {

            console.log(err)

        }

    }

    const [newReply, setNewReply] = useState({
        reply: '',
        share_contact: false,
        contact_info: ''
    })

    const handleCreateReply = async (postId) => {
        try {

            console.log(newReply)

            const res = await createReply(postId, newReply)

            console.log(res.data)

            fetchData()

            setReplyingPostId(null)

            setNewReply({
                reply: '',
                share_contact: false,
                contact_info: ''
            })

        } catch (err) {
            console.log(err.response?.data)
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
                                <p className="text-muted mb-1">Location: {profile?.location || "Not added"}</p>
                                <p><strong>Bio: </strong>{profile?.bio || "No bio added yet."}</p>
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

                                        <Badge key={skill} className="badge bg-danger-subtle text-danger border border-danger">
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

                        <h4 className="mb-4">Recommended Posts</h4>

                        {posts.length === 0 ? (

                            <p>No recommendations yet.</p>

                        ) : (

                            posts.map(post => (

                                <Card key={post.id} className="mb-3">

                                    <Card.Body>

                                        <div className="d-flex align-items-center gap-2">
                                            <h5 className="mb-0">{post.seeker_name}</h5>

                                            {post.is_rural && (
                                                <span className="badge bg-warning-subtle text-dark border border-warning">
                                                    Remote Student
                                                </span>
                                            )}
                                        </div>
                                        <h5>Title: {post.title}</h5>

                                        <Badge bg="success">{post.category}</Badge>
                                        {post.replied && (
                                            <Badge bg="warning" className="ms-2" text="dark">Replied
                                            </Badge>
                                        )

                                        }


                                        <p className="mt-3">{post.description}</p>

                                        <Button variant="outline-success" onClick={() => setReplyingPostId(post.id)}>
                                            Reply
                                        </Button>
                                        {replyingPostId === post.id && (

                                            <div className="mt-3">

                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    placeholder="Write your reply..."
                                                    value={newReply.reply}
                                                    onChange={(e) =>
                                                        setNewReply({
                                                            ...newReply,
                                                            reply: e.target.value
                                                        })
                                                    }
                                                />

                                                <Form.Check
                                                    className="mt-3"
                                                    label="Share my contact"
                                                    checked={newReply.share_contact}
                                                    onChange={(e) =>
                                                        setNewReply({
                                                            ...newReply,
                                                            share_contact: e.target.checked
                                                        })
                                                    }
                                                />

                                                {newReply.share_contact && (

                                                    <Form.Control
                                                        className="mt-2"
                                                        placeholder="Email or phone"
                                                        value={newReply.contact_info}
                                                        onChange={(e) =>
                                                            setNewReply({
                                                                ...newReply,
                                                                contact_info: e.target.value
                                                            })
                                                        }
                                                    />

                                                )}

                                                <div className="mt-3 d-flex gap-2">

                                                    <Button
                                                        variant="success"
                                                        onClick={() => handleCreateReply(post.id)}
                                                    >
                                                        Submit Reply
                                                    </Button>

                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => {
                                                            setReplyingPostId(null)
                                                            setNewReply({
                                                                reply: '',
                                                                share_contact: false,
                                                                contact_info: ''
                                                            })
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>

                                                </div>

                                            </div>

                                        )}

                                    </Card.Body>

                                </Card>

                            ))

                        )}

                    </Card.Body>
                </Card>

                <Card className="shadow-sm border-0 mt-4">
                    <Card.Body>
                        <h4 className="fw-bold mb-3">My Replies</h4>

                        {myReplies.length === 0 ? (
                            <p className="text-muted">You haven't replied to any posts yet.</p>
                        ) : (
                            myReplies.map(reply => (
                                <Card key={reply.id} className="mb-3">
                                    <Card.Body>
                                        {editingReplyId === reply.id ? (
                                            <>
                                                <Form.Control
                                                    className="mb-2"
                                                    value={replyForm.reply}
                                                    onChange={(e) => setReplyForm({ ...replyForm, reply: e.target.value })}
                                                />

                                                <Button size="sm" variant="success" onClick={handleUpdateReply}>Save</Button>

                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="ms-2"
                                                    onClick={() => setEditingReplyId(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </>
                                        ) : (

                                            <p>
                                                <div className="d-flex align-items-center gap-2">
                                                    <h5 className="mb-0">{reply.seeker_name}</h5>

                                                    {reply.is_rural && (
                                                        <span className="badge bg-warning-subtle text-dark border border-warning">
                                                            Remote Student
                                                        </span>
                                                    )}
                                                </div>
                                                <h5>Title: {reply.post_title}</h5>                                        

                                                <p className="mt-3"><strong>Description: </strong> {reply.post_description} <Badge bg="success">{reply.post_category}</Badge></p>

                                                <p > <strong className="mt-3" style={{ color: "Red" }}> Reply:</strong>  {reply.reply} </p>
                                            </p>
                                        )}

                                        {reply.share_contact && (
                                            <Badge className="badge bg-success-subtle text-success border border-success">Contact Shared</Badge>
                                        )}

                                        <div className="mt-3">
                                            <Button size="sm" variant="warning" onClick={() => {

                                                setEditingReplyId(reply.id)

                                                setReplyForm({
                                                    reply: reply.reply,
                                                    share_contact: reply.share_contact,
                                                    contact_info: reply.contact_info
                                                })

                                            }}>Edit</Button>
                                            <Button size="sm" variant="danger" className="ms-2" onClick={() => confirmDeleteReply(reply.id)} >Delete</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))
                        )}
                    </Card.Body>
                </Card>

            </Container>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Reply</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to delete this reply?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>

                    <Button variant="danger" onClick={handleDeleteReply}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>



        </>
    )

}

export default MentorProfile