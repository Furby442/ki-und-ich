/**
 * Kiki Avatar Component
 *
 * Generates the SVG markup for Kiki, the friendly robot mascot.
 * Purple/violet robot with LED eyes, antenna, and segmented arms.
 */

/**
 * Emotion states for Kiki
 */
export const EMOTIONS = {
    HAPPY: 'happy',
    THOUGHTFUL: 'thoughtful',
    PROUD: 'proud',
    SAD: 'sad',
    SURPRISED: 'surprised',
    CURIOUS: 'curious'
};

/**
 * Generate Kiki SVG markup
 * @param {Object} options - Avatar configuration
 * @param {number} options.size - Width in pixels (height auto-calculated)
 * @param {string} options.emotion - Initial emotion state
 * @param {string} options.ariaLabel - Accessibility label
 * @returns {string} SVG HTML string
 */
export function KikiAvatar(options = {}) {
    const {
        size = 150,
        emotion = EMOTIONS.HAPPY,
        ariaLabel = 'Kiki, der freundliche Roboter'
    } = options;

    const height = Math.round(size * 1.33);

    return `
        <svg
            class="kiki-avatar"
            viewBox="0 0 150 200"
            width="${size}"
            height="${height}"
            data-emotion="${emotion}"
            role="img"
            aria-label="${ariaLabel}"
        >
            <!-- Floating effect applied to root group -->
            <g class="kiki-root">

                <!-- Antenna -->
                <g class="kiki-antenna">
                    <line
                        x1="75" y1="15"
                        x2="75" y2="-5"
                        stroke="var(--kiki-primary, #8B5CF6)"
                        stroke-width="4"
                        stroke-linecap="round"
                    />
                    <circle
                        class="kiki-antenna-tip"
                        cx="75" cy="-10" r="6"
                        fill="var(--kiki-accent, #F59E0B)"
                    />
                </g>

                <!-- Head -->
                <rect
                    class="kiki-head"
                    x="35" y="15"
                    width="80" height="65"
                    rx="12"
                    fill="var(--kiki-primary, #8B5CF6)"
                />

                <!-- Face plate (lighter) -->
                <rect
                    x="42" y="22"
                    width="66" height="50"
                    rx="8"
                    fill="var(--kiki-secondary, #A78BFA)"
                />

                <!-- LED Eyes -->
                <g class="kiki-eyes">
                    <rect
                        class="kiki-eye kiki-eye--left"
                        x="48" y="32"
                        width="18" height="22"
                        rx="4"
                        fill="var(--kiki-screen, #22D3EE)"
                    />
                    <rect
                        class="kiki-eye kiki-eye--right"
                        x="84" y="32"
                        width="18" height="22"
                        rx="4"
                        fill="var(--kiki-screen, #22D3EE)"
                    />
                </g>

                <!-- Mouth -->
                <path
                    class="kiki-mouth"
                    d="M55 62 Q75 72 95 62"
                    stroke="var(--kiki-screen, #22D3EE)"
                    stroke-width="4"
                    stroke-linecap="round"
                    fill="none"
                />

                <!-- Body -->
                <rect
                    class="kiki-body"
                    x="40" y="85"
                    width="70" height="90"
                    rx="15"
                    fill="var(--kiki-primary, #8B5CF6)"
                />

                <!-- Body panel/screen -->
                <rect
                    x="50" y="100"
                    width="50" height="40"
                    rx="5"
                    fill="var(--kiki-screen-dim, #155E75)"
                />

                <!-- Body panel glow lines -->
                <line x1="55" y1="110" x2="95" y2="110" stroke="var(--kiki-screen, #22D3EE)" stroke-width="2" opacity="0.6"/>
                <line x1="55" y1="120" x2="85" y2="120" stroke="var(--kiki-screen, #22D3EE)" stroke-width="2" opacity="0.4"/>
                <line x1="55" y1="130" x2="75" y2="130" stroke="var(--kiki-screen, #22D3EE)" stroke-width="2" opacity="0.3"/>

                <!-- Left Arm -->
                <g class="kiki-arms">
                    <g class="kiki-arm kiki-arm--left">
                        <!-- Upper arm -->
                        <rect
                            x="15" y="95"
                            width="22" height="14"
                            rx="7"
                            fill="var(--kiki-secondary, #A78BFA)"
                        />
                        <!-- Joint -->
                        <circle cx="18" cy="115" r="6" fill="var(--kiki-primary, #8B5CF6)"/>
                        <!-- Lower arm -->
                        <rect
                            x="10" y="118"
                            width="18" height="25"
                            rx="6"
                            fill="var(--kiki-secondary, #A78BFA)"
                        />
                        <!-- Hand (3 fingers as circles) -->
                        <circle cx="12" cy="148" r="5" fill="var(--kiki-secondary, #A78BFA)"/>
                        <circle cx="19" cy="150" r="5" fill="var(--kiki-secondary, #A78BFA)"/>
                        <circle cx="26" cy="148" r="5" fill="var(--kiki-secondary, #A78BFA)"/>
                    </g>

                    <!-- Right Arm -->
                    <g class="kiki-arm kiki-arm--right">
                        <!-- Upper arm -->
                        <rect
                            x="113" y="95"
                            width="22" height="14"
                            rx="7"
                            fill="var(--kiki-secondary, #A78BFA)"
                        />
                        <!-- Joint -->
                        <circle cx="132" cy="115" r="6" fill="var(--kiki-primary, #8B5CF6)"/>
                        <!-- Lower arm -->
                        <rect
                            x="122" y="118"
                            width="18" height="25"
                            rx="6"
                            fill="var(--kiki-secondary, #A78BFA)"
                        />
                        <!-- Hand (3 fingers as circles) -->
                        <circle cx="124" cy="148" r="5" fill="var(--kiki-secondary, #A78BFA)"/>
                        <circle cx="131" cy="150" r="5" fill="var(--kiki-secondary, #A78BFA)"/>
                        <circle cx="138" cy="148" r="5" fill="var(--kiki-secondary, #A78BFA)"/>
                    </g>
                </g>

            </g>
        </svg>
    `;
}
