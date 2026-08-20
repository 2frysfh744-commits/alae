"use client";

import { useState } from "react";

const sparkles = ["♥", "✦", "♡", "✧", "♥", "♡", "✦", "♥"];

export default function DoYouLoveMe() {
  const [answered, setAnswered] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function escape() {
    const distanceX = Math.min(165, window.innerWidth * 0.3);
    setPosition({
      x: (Math.random() * 2 - 1) * distanceX,
      y: (Math.random() * 2 - 1) * 110,
    });
    setAttempts((count) => count + 1);
  }

  return (
    <main className={answered ? "page yes-page" : "page"}>
      <div className="noise" aria-hidden="true" />
      <div className="moon" aria-hidden="true"><span>♥</span></div>
      <div className="web web-left" aria-hidden="true" />
      <div className="web web-right" aria-hidden="true" />

      {sparkles.map((item, index) => (
        <span className={`floater floater-${index + 1}`} aria-hidden="true" key={index}>
          {item}
        </span>
      ))}

      <section className="love-card love-test-card" aria-live="polite">
        <div className="tape tape-left" aria-hidden="true" />
        <div className="tape tape-right" aria-hidden="true" />

        {!answered ? (
          <>
            <p className="eyebrow">be honest… but choose wisely</p>
            <div className="character" aria-label="A cute mischievous bunny waiting for an answer">
              <div className="ear ear-left"><i /></div>
              <div className="ear ear-right"><i /></div>
              <div className="hood">
                <div className="skull"><span>♥</span></div>
                <div className="face">
                  <span className="eye eye-left">●</span>
                  <span className="eye eye-right">●</span>
                  <span className="blush blush-left" />
                  <span className="blush blush-right" />
                  <span className="smile">ᴗ</span>
                </div>
              </div>
              <span className="tail">♡</span>
            </div>

            <h1>Do you<br /><em>love me?</em></h1>
            <p className="note">This is a completely fair and unbiased survey with two definitely clickable answers.</p>

            <div className="buttons">
              <button className="yes-button" onClick={() => setAnswered(true)}>
                Yes, a lot <span>♥</span>
              </button>
              <button
                className="no-button"
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                onMouseEnter={escape}
                onFocus={escape}
                onTouchStart={escape}
                onClick={escape}
                aria-label="No, a playful button that runs away"
              >
                {attempts > 5 ? "give up 😭" : attempts > 2 ? "wrong answer" : attempts ? "too slow" : "No"}
              </button>
            </div>
            <p className="fine-print">there is only one correct answer, btw ✦</p>
          </>
        ) : (
          <div className="celebration love-reveal">
            <div className="burst" aria-hidden="true">♥</div>
            <p className="eyebrow">correct answer detected</p>
            <div className="happy-face" aria-hidden="true">(˶ᵔ ᵕ ᵔ˶)</div>
            <h1>I love me too,<br /><em>dumbass.</em></h1>
            <p className="note big-note">Obviously. Now come here and let me annoy you forever. 🖤</p>
            <div className="promise"><span>♥</span> certified mutual obsession <span>♥</span></div>
          </div>
        )}
      </section>

      <p className="signature">a highly scientific love test</p>
    </main>
  );
}
