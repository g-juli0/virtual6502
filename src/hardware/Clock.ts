import {Hardware} from "./Hardware";
import {ClockListener} from "./imp/ClockListener";

/**
 * Clock class
 * keeps track of all hardware devices that operate on a clock pulse
 * starts and ends interval that triggers clock pulse for each device
 */
export class Clock extends Hardware {

    // list of all Hardware elements that are registered ClockListeners
    private cl = new Array<ClockListener>();
    // clock interval constant defined in System file
    private interval: number;

    constructor(i: number) {
        super(0, "CLK");
        this.interval = i;
        this.log("created");
    }

    // add hardware that listens to clock
    public addListener(obj: ClockListener): void {
        this.cl.push(obj)
    }

    public startPulse(): void {
        // increment function
        const clockpulse = setInterval(() => {
            // log clock pulse
            this.log("Clock pulse initiated");

            // for each hardware element in the ClockListeners array, trigger clock pulse
            for(let i = 0; i < this.cl.length; i++) {
                this.cl[i].pulse();
            }

            // if CPU sets hardware status to false at any point, stop clock pulse
            if (this.getStatus() === false) {
                clearInterval(clockpulse);
            }
        }, this.interval); // clock interval constant
    }
}