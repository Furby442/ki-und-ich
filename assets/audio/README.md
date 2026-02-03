# Audio Assets

Sound effects for "KI & ich" learning app.

## Files

Generated programmatically using `scripts/generate-audio.js`:

- **correct.wav** - Positive achievement sound (C major arpeggio)
- **incorrect.wav** - Gentle feedback tone (descending)
- **complete.wav** - Quiz completion celebration (major scale)
- **click.wav** - UI interaction click (short pop)

## Regenerating

Run: `node scripts/generate-audio.js`

All sounds use simple sine wave synthesis (child-friendly, not harsh).

## Technical Details

- Format: 16-bit PCM WAV
- Sample rate: 44.1 kHz
- Channels: Mono
- Synthesis: Pure sine waves with ADSR envelope
- Browser support: Universal (Web Audio API decodes WAV natively)

## Integration

Loaded by `SoundManager` in `src/services/sound.js`:
- Fetched as ArrayBuffer
- Decoded via Web Audio API
- Played through AudioContext destination
- Respects user mute preference
