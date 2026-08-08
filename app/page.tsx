"use client";

import { useState } from "react";

const hearts = ["♥", "✦", "♡", "♥", "✧", "♡", "♥", "✦"];

export default function Home() {
  const [yes, setYes] = useState(false);
  const [dodges, setDodges] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });

  function dodgeNo() {
    const maxX = Math.min(160, window.innerWidth * 0.28);
    const maxY = 105;
    setNoPosition({
      x: (Math.random() * 2 - 1) * maxX,
      y: (Math.random() * 2 - 1) * maxY,
    });
    setDodges((value) => value + 1);
  }

  return (
    <main className={yes ? "page yes-page" : "page"}>
      <div className="noise" aria-hidden="true" />
      <div className="moon" aria-hidden="true"><span>♥</span></div>
      <div className="web web-left" aria-hidden="true" />
      <div className="web web-right" aria-hidden="true" />

      {hearts.map((heart, index) => (
        <span
          className={`floater floater-${index + 1}`}
          aria-hidden="true"
          key={index}
        >
          {heart}
        </span>
      ))}

      <section className="love-card" aria-live="polite">
        <div className="tape tape-left" aria-hidden="true" />
        <div className="tape tape-right" aria-hidden="true" />

        {!yes ? (
          <>
            <p className="eyebrow">a tiny question for my favorite person</p>

            <div className="character" aria-label="A cute mischievous bunny">
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

            <h1>Will you be<br /><em>my girlfriend?</em></h1>
            <p className="note">Life is cuter, funnier, and a little more magical with you in it.</p>

            <div className="buttons">
              <button className="yes-button" onClick={() => setYes(true)}>
                Yes, obviously <span>♥</span>
              </button>
              <button
                className="no-button"
                style={{ transform: `translate(${noPosition.x}px, ${noPosition.y}px)` }}
                onMouseEnter={dodgeNo}
                onFocus={dodgeNo}
                onTouchStart={dodgeNo}
                onClick={dodgeNo}
                aria-label="No (this button playfully runs away)"
              >
                {dodges > 3 ? "still trying?" : dodges > 0 ? "nice try" : "No"}
              </button>
            </div>
            <p className="fine-print">warning: the “no” button is a little shy ✦</p>
          </>
        ) : (
          <div className="celebration">
            <div className="burst" aria-hidden="true">♥</div>
            <p className="eyebrow">officially the cutest plot twist ever</p>
            <div className="happy-face" aria-hidden="true">૮ ˶ᵔ ᵕ ᵔ˶ ა</div>
            <h1>Yayyy!<br /><em>It&apos;s a date.</em></h1>
            <p className="note big-note">You just made me the happiest person alive. I can&apos;t wait for all our little adventures. 🖤</p>
            <div className="promise"><span>♥</span> sealed with a kiss <span>♥</span></div>
          </div>
        )}
      </section>

      <p className="signature">made with mischief + lots of love</p>
    </main>
  );
}
