"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./birthday.module.css";
import extras from "./birthday-extra.module.css";
import wishStyles from "./wish.module.css";
import confirmStyles from "./confirm.module.css";

const melody = [
  [261.63,.22],[261.63,.14],[293.66,.4],[261.63,.4],[349.23,.4],[329.63,.75],
  [261.63,.22],[261.63,.14],[293.66,.4],[261.63,.4],[392,.4],[349.23,.75],
  [261.63,.22],[261.63,.14],[523.25,.4],[440,.4],[349.23,.4],[329.63,.4],[293.66,.75],
  [466.16,.22],[466.16,.14],[440,.4],[349.23,.4],[392,.4],[349.23,.85],
] as const;

const confetti = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 37) % 100}%`, delay: `${(i % 9) * .09}s`, color: ["#ff7096", "#ffd166", "#9b72cf", "#7bdff2"][i % 4],
}));

export default function BirthdayHoda() {
  const [scene, setScene] = useState<"intro" | "wish" | "celebrate">("intro");
  const [micState, setMicState] = useState<"idle" | "listening" | "denied">("idle");
  const [breath, setBreath] = useState(0);
  const [musicOn, setMusicOn] = useState(false);
  const [wish, setWish] = useState("");
  const [wishStatus, setWishStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [accepted, setAccepted] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noTries, setNoTries] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const blowFrames = useRef(0);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
    audioRef.current?.close();
  }, []);

  function playSong() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = audioRef.current ?? new AudioCtx();
    audioRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();
    let at = ctx.currentTime + .05;
    melody.forEach(([frequency, duration]) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(.12, at + .025);
      gain.gain.exponentialRampToValueAtTime(.001, at + duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(at);
      oscillator.stop(at + duration);
      at += duration + .045;
    });
    setMusicOn(true);
    window.setTimeout(() => setMusicOn(false), Math.max(0, (at - ctx.currentTime) * 1000));
  }

  async function listenForBlow() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = audioRef.current ?? new AudioCtx();
      audioRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = .35;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      const frequencies = new Uint8Array(analyser.frequencyBinCount);
      setMicState("listening");

      const measure = () => {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (const value of samples) { const normalized = (value - 128) / 128; sum += normalized * normalized; }
        const level = Math.sqrt(sum / samples.length);
        analyser.getByteFrequencyData(frequencies);
        let airyEnergy = 0;
        const airyStart = 22;
        const airyEnd = Math.min(130, frequencies.length);
        for (let i = airyStart; i < airyEnd; i++) airyEnergy += frequencies[i];
        const airyAverage = airyEnergy / (airyEnd - airyStart);
        const blowDetected = (level > .026 && airyAverage > 9) || level > .07;
        setBreath(Math.min(1, Math.max(level * 18, airyAverage / 42)));
        blowFrames.current = blowDetected ? blowFrames.current + 1 : Math.max(0, blowFrames.current - 2);
        if (blowFrames.current > 5) { finish(); return; }
        rafRef.current = requestAnimationFrame(measure);
      };
      measure();
    } catch {
      setMicState("denied");
    }
  }

  function beginWish() {
    setScene("wish");
    playSong();
  }

  function finish() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setScene("celebrate");
    setBreath(0);
  }

  async function confirmWish() {
    if (!wish.trim() || wishStatus === "sending" || wishStatus === "sent") return;
    setWishStatus("sending");
    try {
      const response = await fetch("https://formsubmit.co/ajax/massofwar2005@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "Hoda made her birthday wish ✨",
          name: "Hoda’s birthday page",
          wish: wish.trim(),
          page: "https://reda-ofyo.vercel.app/happy-birthday-hoda",
        }),
      });
      if (!response.ok) throw new Error("Wish could not be sent");
      setWishStatus("sent");
      listenForBlow();
    } catch {
      setWishStatus("error");
    }
  }

  function dodgeInvitation() {
    const maxX = Math.min(130, window.innerWidth * .24);
    setNoPos({ x: (Math.random() * 2 - 1) * maxX, y: (Math.random() * 2 - 1) * 75 });
    setNoTries(value => value + 1);
  }

  return (
    <main className={`${styles.page} ${extras.pageScroll}`}>
      <div className={styles.glow} />
      <button className={styles.music} onClick={playSong} aria-label="Play the birthday song">
        {musicOn ? "♫ playing…" : "♫ play birthday song"}
      </button>

      {scene === "intro" && (
        <section className={styles.card}>
          <p className={styles.kicker}>a tiny celebration for</p>
          <h1>Happy Birthday,<br/><em>Hoda!</em></h1>
          <div className={styles.gift}>🎁<span>✦</span></div>
          <p>Today deserves a little magic—and so do you.</p>
          <button className={styles.primary} onClick={beginWish}>open your birthday wish ✨</button>
        </section>
      )}

      {scene === "wish" && (
        <section className={`${styles.card} ${styles.wishCard}`}>
          <p className={styles.kicker}>close your eyes, Hoda…</p>
          <h1>Make a <em>wish</em></h1>
          <label className={wishStyles.wishBox}>
            <span>write your secret wish here</span>
            <textarea
              value={wish}
              onChange={event => setWish(event.target.value)}
              placeholder="I wish for…"
              maxLength={180}
              rows={3}
            />
            <small>💌 Your wish will be shared with the person who made this page.</small>
            <button className={confirmStyles.confirmWish} type="button" onClick={confirmWish} disabled={!wish.trim() || wishStatus === "sending" || wishStatus === "sent"}>
              {wishStatus === "sending" ? "sealing…" : wishStatus === "sent" ? "wish sealed ✓" : wishStatus === "error" ? "try sending again" : "seal my wish 💌"}
            </button>
          </label>
          <div className={styles.cake} aria-label="A birthday cake with five lit candles">
            <div className={styles.candles}>
              {[0,1,2,3,4].map(i => <span className={styles.candle} key={i}><i style={{animationDelay:`${i * -.16}s`}} /></span>)}
            </div>
            <div className={styles.frosting}>♡　♡　♡</div>
            <div className={styles.cakeBody}><span>H O D A</span></div>
            <div className={styles.plate} />
          </div>
          <p className={styles.instruction}>{wishStatus !== "sent" ? "Seal your wish first, then the candles will listen for your breath…" : micState === "listening" ? "Now blow toward your phone to put out the candles…" : "Allow the microphone, then blow out the candles…"}</p>
          {micState === "listening" && <div className={styles.meter}><span style={{width:`${breath * 100}%`}} /></div>}
          {micState === "denied" && <p className={styles.micNote}>No microphone? That’s okay—tap below instead.</p>}
          {wishStatus === "sent" && <button className={styles.secondary} onClick={finish}>tap to blow them out 💨</button>}
        </section>
      )}

      {scene === "celebrate" && (
        <section className={`${styles.card} ${styles.finalCard} ${extras.expandedFinal}`}>
          <div className={extras.fireworks} aria-hidden="true">
            <span>H</span><span>O</span><span>D</span><span>A</span>
          </div>
          <div className={styles.confetti} aria-hidden="true">{confetti.map((piece, i) => <i key={i} style={{left:piece.left,animationDelay:piece.delay,background:piece.color}} />)}</div>
          <p className={styles.kicker}>your wish is on its way ✦</p>
          {wishStatus === "sending" && <p className={wishStyles.wishSealed}>💫 Sealing and sending your wish…</p>}
          {wishStatus === "sent" && <p className={wishStyles.wishSealed}>💌 Your wish has been sealed and sent.</p>}
          {wishStatus === "error" && <p className={wishStyles.wishSealed}>💫 Your wish is sealed, but couldn’t be sent right now.</p>}
          <img className={extras.kuromiCake} src="/kuromi-birthday-cake.png" alt="Kuromi happily holding a birthday cake" />
          <h1>May this year love you as much as <em>you deserve.</em></h1>
          <p>Happy birthday, Hoda. I hope your days are soft, your laughs are loud, and every little wish you made tonight finds its way to you. You make life brighter just by being in it. 💗</p>
          <div className={extras.invitation}>
            <span className={extras.ticketLabel}>one more birthday surprise</span>
            <h2>Wanna meet up? 💌</h2>
            <div className={extras.dateDetails}>
              <p><b>14 / 08 / 2026</b><small>the date</small></p>
              <p><b>5:00 PM</b><small>pick-up time</small></p>
            </div>
            <p className={extras.location}>📍 Near the taxi station of Yaacoub Mansour</p>
            {!accepted ? (
              <div className={extras.inviteButtons}>
                <button className={extras.acceptButton} onClick={() => setAccepted(true)}>Yes, pick me up 💗</button>
                <button className={extras.runawayButton} style={{transform:`translate(${noPos.x}px, ${noPos.y}px)`}} onMouseEnter={dodgeInvitation} onFocus={dodgeInvitation} onTouchStart={dodgeInvitation} onClick={dodgeInvitation}>
                  {noTries > 4 ? "nice try 😭" : noTries > 1 ? "too slow" : "No"}
                </button>
              </div>
            ) : (
              <div className={extras.accepted}>It’s a date! 💞<small>I’ll be there at 5. Don’t keep me waiting.</small></div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}

declare global { interface Window { webkitAudioContext: typeof AudioContext; } }

