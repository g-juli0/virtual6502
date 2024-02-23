/**
 * Interrupt interface
 * interface untilized for all interrupt driven hardware
 */
export interface Interrupt {

    // required member variables
    irq: number;
    priority: number;
    inputBuffer?: Array<number>; // optional
    outputBuffer: Array<number>;
    name: string;

}