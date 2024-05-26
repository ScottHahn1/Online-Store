import '../styles/Rating.css';

type RatingProps = {
    rating: number,
    ratingCount: number
}

const Rating = ({ rating, ratingCount }: RatingProps) => {

    return (
        <div className="rating">
            <div className="stars">
                { 
                    rating > 0 ? <div className="star">&#9733;</div> : <div className="star">&#9734;</div>
                }
                { 
                    rating > 1 ? <div className="star">&#9733;</div> : <div className="star">&#9734;</div>
                }
                { 
                    rating > 2 ? <div className="star">&#9733;</div> : <div className="star">&#9734;</div>
                }
                { 
                    rating > 3 ? <div className="star">&#9733;</div> : <div className="star">&#9734;</div>
                }
                { 
                    rating > 4 ? <div className="star">&#9733;</div> : <div className="star">&#9734;</div>
                }
            </div>
            
            <div>
                ({ratingCount} Reviews)
            </div>
        </div>
    )
}

export default Rating;