import { useEffect, useState } from 'react'
import { Card, Badge } from 'react-bootstrap'
import { getRecommendedMentors } from '../services/authService'

function RecommendedMentors() {

    const [mentors, setMentors] = useState([])

    useEffect(() => {
        fetchMentors()
    }, [])

    const fetchMentors = async () => {
        try {
            const res = await getRecommendedMentors()
            setMentors(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Card className="shadow-sm border-0 mb-4">
            <Card.Body>

                <h5 className="fw-bold mb-3" style={{color:'#4E220F'}}>
                    Recommended Mentors
                </h5>

                {mentors.length===0 ? (

                    <p className="text-muted small">
                        No mentors found. Try updating your interests.
                    </p>

                ) : (

                    mentors.map(mentor=>(
                        <Card key={mentor.id} className="mb-2 bg-light border-0">
                            <Card.Body>

                                <div className="d-flex justify-content-between">
                                    <h6 className="fw-bold mb-0">
                                        {mentor.full_name}
                                    </h6>

                                    <Badge bg={
                                        mentor.badge_level==="PLATINUM" ? "dark" :
                                        mentor.badge_level==="GOLD" ? "warning" :
                                        mentor.badge_level==="SILVER" ? "info" :
                                        "secondary"
                                    }>
                                        {mentor.badge_level}
                                    </Badge>
                                </div>

                                <small className="text-muted d-block mb-2">
                                    {mentor.experience}
                                </small>

                                <div className="d-flex flex-wrap gap-1">
                                    {mentor.matched_on.map(cat=>(
                                        <Badge
                                            key={cat}
                                            className="bg-success-subtle text-success border border-success"
                                        >
                                            {cat}
                                        </Badge>
                                    ))}
                                </div>

                            </Card.Body>
                        </Card>
                    ))

                )}

            </Card.Body>
        </Card>
    )
}

export default RecommendedMentors