#!/usr/bin/env node

/**
 * Audio Generator for KI & ich
 *
 * Generates child-friendly synthesized sound effects using simple sine wave synthesis.
 * Creates WAV files (16-bit PCM) that browsers can decode natively via Web Audio API.
 *
 * No external dependencies required - uses only Node.js built-ins.
 */

const fs = require('fs');
const path = require('path');

class SimpleAudioGenerator {
    constructor(sampleRate = 44100) {
        this.sampleRate = sampleRate;
    }

    /**
     * Generate sine wave tone
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {number} volume - Volume (0.0 to 1.0)
     * @returns {Float32Array} Audio samples
     */
    generateTone(frequency, duration, volume = 0.3) {
        const samples = Math.floor(this.sampleRate * duration);
        const buffer = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const t = i / this.sampleRate;
            // Apply envelope (fade in/out)
            const envelope = this.envelope(i, samples);
            buffer[i] = Math.sin(2 * Math.PI * frequency * t) * volume * envelope;
        }

        return buffer;
    }

    /**
     * Simple envelope (attack-decay-sustain-release)
     * @param {number} sample - Current sample index
     * @param {number} totalSamples - Total sample count
     * @returns {number} Envelope multiplier (0.0 to 1.0)
     */
    envelope(sample, totalSamples) {
        const attackSamples = totalSamples * 0.1;
        const releaseSamples = totalSamples * 0.2;

        if (sample < attackSamples) {
            return sample / attackSamples; // Fade in
        } else if (sample > totalSamples - releaseSamples) {
            return (totalSamples - sample) / releaseSamples; // Fade out
        }
        return 1.0; // Sustain
    }

    /**
     * Concatenate multiple tones (for arpeggios/sequences)
     * @param {Float32Array[]} tones - Array of tone buffers
     * @returns {Float32Array} Combined audio samples
     */
    concatenateTones(tones) {
        const totalLength = tones.reduce((sum, tone) => sum + tone.length, 0);
        const result = new Float32Array(totalLength);
        let offset = 0;

        for (const tone of tones) {
            result.set(tone, offset);
            offset += tone.length;
        }

        return result;
    }

    /**
     * Convert Float32Array to 16-bit PCM
     * @param {Float32Array} float32Array - Audio samples (-1.0 to 1.0)
     * @returns {Int16Array} 16-bit PCM data
     */
    floatTo16BitPCM(float32Array) {
        const buffer = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
            const s = Math.max(-1, Math.min(1, float32Array[i]));
            buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return buffer;
    }

    /**
     * Create WAV file header (16-bit PCM, mono)
     * @param {number} dataLength - Length of PCM data in bytes
     * @returns {Uint8Array} WAV header (44 bytes)
     */
    createWavHeader(dataLength) {
        const buffer = new ArrayBuffer(44);
        const view = new DataView(buffer);

        // RIFF header
        this.writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + dataLength, true);
        this.writeString(view, 8, 'WAVE');

        // fmt chunk
        this.writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true); // fmt chunk size
        view.setUint16(20, 1, true); // PCM format
        view.setUint16(22, 1, true); // Mono
        view.setUint32(24, this.sampleRate, true);
        view.setUint32(28, this.sampleRate * 2, true); // Byte rate
        view.setUint16(32, 2, true); // Block align
        view.setUint16(34, 16, true); // Bits per sample

        // data chunk
        this.writeString(view, 36, 'data');
        view.setUint32(40, dataLength, true);

        return new Uint8Array(buffer);
    }

    /**
     * Write ASCII string to DataView
     * @param {DataView} view - Target DataView
     * @param {number} offset - Byte offset
     * @param {string} string - String to write
     */
    writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    /**
     * Save audio as WAV file
     * @param {string} filename - Output file path
     * @param {Float32Array} float32Array - Audio samples
     */
    saveWav(filename, float32Array) {
        const pcmData = this.floatTo16BitPCM(float32Array);
        const dataLength = pcmData.length * 2;
        const header = this.createWavHeader(dataLength);

        const wavData = new Uint8Array(header.length + pcmData.length * 2);
        wavData.set(header, 0);
        wavData.set(new Uint8Array(pcmData.buffer), header.length);

        fs.writeFileSync(filename, wavData);
        console.log(`Created: ${path.basename(filename)} (${wavData.length} bytes)`);
    }
}

// Main execution
console.log('Generating audio files for KI & ich...\n');

const generator = new SimpleAudioGenerator();
const outputDir = path.join(__dirname, '..', 'assets', 'audio');

// Create output directory if needed
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created directory: ${outputDir}\n`);
}

// 1. Correct sound - C major arpeggio ascending (positive achievement)
console.log('Generating correct.wav (C major arpeggio)...');
const correctTones = [
    generator.generateTone(523, 0.12, 0.25), // C5
    generator.generateTone(659, 0.12, 0.25), // E5
    generator.generateTone(784, 0.12, 0.25)  // G5
];
const correctSound = generator.concatenateTones(correctTones);
generator.saveWav(path.join(outputDir, 'correct.wav'), correctSound);

// 2. Incorrect sound - Gentle descending (soft feedback)
console.log('Generating incorrect.wav (gentle descending)...');
const incorrectTones = [
    generator.generateTone(392, 0.15, 0.2), // G4
    generator.generateTone(330, 0.15, 0.2)  // E4
];
const incorrectSound = generator.concatenateTones(incorrectTones);
generator.saveWav(path.join(outputDir, 'incorrect.wav'), incorrectSound);

// 3. Complete sound - Major scale celebration (quiz completion)
console.log('Generating complete.wav (celebration jingle)...');
const completeTones = [
    generator.generateTone(523, 0.12, 0.3), // C
    generator.generateTone(587, 0.12, 0.3), // D
    generator.generateTone(659, 0.12, 0.3), // E
    generator.generateTone(784, 0.2, 0.35)  // G (longer final note)
];
const completeSound = generator.concatenateTones(completeTones);
generator.saveWav(path.join(outputDir, 'complete.wav'), completeSound);

// 4. Click sound - Short pop (UI interaction)
console.log('Generating click.wav (UI click)...');
const clickSound = generator.generateTone(1000, 0.05, 0.15);
generator.saveWav(path.join(outputDir, 'click.wav'), clickSound);

console.log('\n✓ Generated 4 WAV files');
console.log('\nNote: Browsers support WAV natively via Web Audio API.');
console.log('SoundManager will load these .wav files.');
