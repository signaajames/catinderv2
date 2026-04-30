import './App.css'
import Card from './Card.tsx'
import { useState, useEffect, useRef } from 'react';
import { faker } from '@faker-js/faker';

function App() {

  const startPos = useRef({ x: 0, y: 0 });

  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [swipingId, setSwipingId] = useState<number | null>(null);
  const [swipeDir, setSwipeDir] = useState<string>("");
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  function swipeNope() {
    handleSwipe('left');
    console.log("Nope");
  }
  function swipeLike() {
    handleSwipe('right');
    console.log("Like");
  }
  function swipeSuper() {
    handleSwipe('up');
    console.log("Super like");
  }
  function randomAge() { return Math.floor(Math.random() * 10) + 1; }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (swipingId) return;
    setIsDragging(true);
  
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
    // Store where the drag began
    startPos.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || swipingId) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calculate the relative distance moved
    setDragPos({ 
      x: clientX - startPos.current.x, 
      y: clientY - startPos.current.y 
    });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (dragPos.x < -threshold) handleSwipe('left');
    else if (dragPos.x > threshold) handleSwipe('right');
    else if (dragPos.y < -threshold) handleSwipe('up');
  
    setDragPos({ x: 0, y: 0 }); // Reset position if no swipe triggered
  };

  async function handleSwipe(direction: 'left' | 'right' | 'up') {
    if (cards.length === 0 || swipingId) {
      return;
    }
    
    const topCard = cards[0];
    setSwipingId(topCard.id);
    setSwipeDir(direction);
    
  setTimeout(() => {
      setCards(prev => prev.slice(1)); // Now remove it from data
      setSwipingId(null);              // Reset animation state
      setSwipeDir("");
      createCard();                    // Load the next replacement
    }, 500); 
  }

  async function createCard() {
    setIsLoading(true);
    try {
      // get cat image from api
      const imageResponse = await fetch("https://cataas.com/cat?width=380&height=520");
      if (!imageResponse.ok) {
        throw new Error(`HTTP error! status: ${imageResponse.status}`);
      }
      const blob = await imageResponse.blob();
      const image = URL.createObjectURL(blob);

      // get cat name from FAKER
      const name = faker.person.firstName() || "Failed to load name"

      // get cat location from api
      const locationResponse = await fetch("https://api.testingbot.com/v1/free-tools/random-address?country=us")
      if (!locationResponse.ok) {
        throw new Error(`HTTP error! status: ${locationResponse.status}`);
      }
      const locationData = await locationResponse.json();
      //splice it
      const splicedLocation = locationData.address.split(",")
      let cleanedLocation = splicedLocation.map((str: string) =>
        str.replace(/[\d-]/g, '').trim()
      );
      cleanedLocation.shift();
      const joinedLocation = cleanedLocation.join(" ");
      const location = joinedLocation || "Failed to load location";

      //get cat bio from FAKER
      const bio = faker.person.bio() || "Failed to load bio";
      console.log(bio)
    
      // create card object
      const newCat = {
        id: Date.now(),
        image,
        name,
        age: randomAge(),
        location,
        bio
      };

      setCards(prev => [...prev, newCat]);
    } catch (e) {
      console.error("Error creating card:", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    createCard();
    createCard();
  }, [])

  return (
    <>
    <div className='shell'>
      <div className='sidebar'>
        {/* sidebar code */}
      </div>

      {/* main area */}
      <div className='main-area'>
        {/* card area */}
        <div className='card-area'>
          <div 
            className='card-stack'
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {[...cards].reverse().map((cat, index) => {
              const isTop = index === cards.length - 1;
              const isSwiping = cat.id === swipingId;
    
              // Dynamic styling for dragging[cite: 5]
              const dragStyle = (isTop && isDragging) ? {
                transform: `translate(${dragPos.x}px, ${dragPos.y}px) rotate(${dragPos.x * 0.1}deg)`,
                transition: 'none', // Remove transition so it follows mouse perfectly
                cursor: 'grabbing'
              } : {};

              return (
                <Card
                  key={cat.id}
                  cat={cat}
                  className={`${isTop ? 'card-active' : 'card-behind'} ${isSwiping ? `swiping-${swipeDir}` : ''}`}
                  style={dragStyle}
                  onMouseDown={isTop ? handleDragStart : undefined}
                  onTouchStart={isTop ? handleDragStart : undefined}
                  dragPos={isTop ? dragPos : { x: 0, y: 0 }}
                />
              );
            })}
          </div>
        </div>
        {/* actionbar area */}
        <div className="action-bar">
          <button className="action-btn btn-nope" onClick={swipeNope} title="Nope (←)">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <button className="action-btn btn-super" onClick={swipeSuper} title="Super Like (↑)">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
          </button>
          <button className="action-btn btn-like" onClick={swipeLike} title="Like (→)">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
