"use client";

import { SpeakerHighIcon, SpeakerSlashIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";

export const AmbientAudioToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const contextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopAudio = () => {
    oscillatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    gainRef.current?.disconnect();
    contextRef.current?.close();
    oscillatorRef.current = null;
    gainRef.current = null;
    contextRef.current = null;
  };

  const startAudio = async () => {
    const context = new AudioContext();
    await context.resume();

    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 110;

    const gain = context.createGain();
    gain.gain.value = 0.015;

    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.12;
    lfoGain.gain.value = 12;

    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    lfo.start();

    contextRef.current = context;
    oscillatorRef.current = oscillator;
    gainRef.current = gain;
  };

  const onToggle = async () => {
    if (enabled) {
      stopAudio();
      setEnabled(false);
      return;
    }

    try {
      await startAudio();
      setEnabled(true);
    } catch (error) {
      console.warn("Ambient audio failed to start.", error);
      stopAudio();
      setEnabled(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Toggle ambient audio"
      data-cursor-label="Audio"
      className="group flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-2 text-xs text-muted-foreground transition hover:border-primary/60 hover:text-foreground"
    >
      {enabled ? <SpeakerHighIcon size={16} weight="duotone" /> : <SpeakerSlashIcon size={16} weight="duotone" />}
      <span>{enabled ? "Audio On" : "Audio Off"}</span>
      <span className="flex gap-0.5" aria-hidden>
        <span className="h-2 w-0.5 rounded bg-primary/80" />
        <span className="h-3 w-0.5 rounded bg-primary/70" />
        <span className="h-2 w-0.5 rounded bg-primary/80" />
      </span>
    </button>
  );
};
