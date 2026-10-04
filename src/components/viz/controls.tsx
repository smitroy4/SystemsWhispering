/**
 * Playback controls live inside VizPlayer for now.
 * This module re-exports the player so routes can import from one place,
 * and will host extracted control components in a later step.
 */
export { default as VizPlayer } from './VizPlayer.tsx';
