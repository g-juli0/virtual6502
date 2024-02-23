/**
 * ClockListener interface
 * interface for all hardware that acts on a clock pulse
 */
export interface ClockListener {

    // notify all clock attached hardware when a pulse occurs
    pulse() : void

}