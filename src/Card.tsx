interface Cat {
    image: string;
    name: string;
    age: number;
    location: string;
    bio: string;
}

export default function Card({ cat, className }: { cat: Cat; className?: string }) {
    return (
    <div className={`cat-card ${className || ''}`}>
        <div className="card-image-wrapper">
            <img className="card-image" src={cat.image} alt={cat.name} />
            <div className="card-badge badge-nope" id="badgeNope">NOPE</div>
            <div className="card-badge badge-like" id="badgeLike">LIKE</div>
            <div className="card-badge badge-super" id="badgeSuper">SUPER</div>
        </div>
        <div className="card-info">
            <div className="card-name-row">
                <span className="card-name">{cat.name}</span>
                <span className="card-age">{cat.age}</span>
            </div>
            <div className="card-location">📍 {cat.location}</div>
            <div className="card-bio">{cat.bio}</div>
        </div>
    </div>
    )
}