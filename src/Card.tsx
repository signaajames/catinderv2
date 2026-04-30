export default function Card({ cat, className, style, onMouseDown, onTouchStart, dragPos }: any) {
    const getBadgeOpacity = (type: string) => {
        const x = dragPos?.x || 0;
        const y = dragPos?.y || 0;

        if (type === 'nope' && x < -50) return Math.min(Math.abs(x) / 150, 1);
        if (type === 'like' && x > 50) return Math.min(x / 150, 1);
  
        if (type === 'super' && y < -50) return Math.min(Math.abs(y) / 150, 1);
  
        return 0;
    };
    
    return (
    <div className={`cat-card ${className || ''}`} style={style} onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
        <div className="card-image-wrapper">
            <img className="card-image" src={cat.image} alt={cat.name} />
            <div className="card-badge badge-nope" style={{ opacity: getBadgeOpacity('nope') }} id="badgeNope">NOPE</div>
            <div className="card-badge badge-like" style={{ opacity: getBadgeOpacity('like') }} id="badgeLike">LIKE</div>
            <div className="card-badge badge-super" style={{ opacity: getBadgeOpacity('super') }} id="badgeSuper">SUPER</div>
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