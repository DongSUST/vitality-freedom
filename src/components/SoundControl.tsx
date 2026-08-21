interface Props {
  soundOn: boolean
  volume: number
  onToggle: () => void
  onVolume: (n: number) => void
}

// Not a music player — the world's sound state. Default OFF (autoplay policy).
export default function SoundControl({ soundOn, volume, onToggle, onVolume }: Props) {
  return (
    <div className="sound-ctl">
      <button
        className="topbar-util"
        onClick={onToggle}
        aria-pressed={soundOn}
        aria-label={'Sound · ' + (soundOn ? 'On' : 'Off')}
        title="Generative Soundscape · Driven by V / F / η"
      >
        Sound · {soundOn ? 'On' : 'Off'}
      </button>
      {soundOn && (
        <input
          className="vf-slider vol-slider"
          type="range"
          min={0}
          max={100}
          step={5}
          value={Math.round(volume * 100)}
          onChange={(e) => onVolume(Number(e.target.value) / 100)}
          aria-label="音量 Volume"
        />
      )}
    </div>
  )
}
