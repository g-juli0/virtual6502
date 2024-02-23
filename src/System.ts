// import statements for hardware
import {Hardware} from "./hardware/Hardware";
import {Cpu} from "./hardware/Cpu";
import {Memory} from "./hardware/Memory";
import {Clock} from "./hardware/Clock";
import {MMU} from "./hardware/MMU"
import {ASCII} from "./utility/ascii";

/*
    CONSTANTS
 */

const helloWorldTest: number[] = [ // string printing test
    0xA2, 0x03, 0xFF, 0x06, 0x00, 0x00, 0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x57, 0x6F, 0x72, 0x6C, 
    0x64, 0x21, 0x0A, 0x00
];

const incrementTest: number[] = [ // increment (EE) test program
    0xA9, 0x01, 0x8D, 0x20, 0x00, 0xEE, 0x20, 0x00, 0xAC, 0x20, 0x00, 0xA2, 0x01, 0xFF, 0x00
];

const triangleNums: number[] = [ // calculates first 10 triange nums (1, 3, 6, 10, 15...)
    0xA9, 0x0B, 0x8D, 0x40, 0x00, 0xA9, 0x01, 0x8D, 0x41, 0x00, 0xA8, 0xA2, 0x01, 0xFF, 0xA9, 0x01,
    0x6D, 0x41, 0x00, 0x8D, 0x41, 0x00, 0x98, 0x6D, 0x41, 0x00, 0xAE, 0x40, 0x00, 0xEC, 0x41, 0x00,
    0xD0, 0xE8, 0x00
];

const powers: number[] = [ // calculates powers of 2 - RUNS FOREVER!!!
    0xA9, 0x00, 0x8D, 0x40, 0x00, 0xA9, 0x01, 0x6D, 0x40, 0x00, 0x8D, 0x40, 0x00, 0xA8, 0xA2, 0x01, 
    0xFF, 0xD0, 0xF4, 0x00
];

// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL = 100;             // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
                                        // A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
                                        // .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
                                        // small, I recommend a setting of 100, if you want to slow things down
                                        // make it larger.

/**
 * System class
 * creates instances of all hardware and simulates a virtual 6502
 */
export class System extends Hardware {

    // initalize hardware and other device member variables
    private CPU: Cpu = null;
    private RAM: Memory = null;
    private CLK: Clock = null;
    private MMU: MMU = null;

    // constructor
    constructor(id:number, name:string) {

        // call super constructor
        super(id, name);
        this.log("created");

        // call to populate ASCII table
        new ASCII();

        /*
        Start the system (Analogous to pressing the power button and having voltages flow through the components)
        When power is applied to the system clock, it begins sending pulses to all clock observing hardware
        components so they can act on each clock cycle.
         */

        this.startSystem();
    }

    // logs confirmation that Hardware has been created
    public startSystem(): boolean {

        // INITIALIZE SYSTEM STARTUP

        // memory
        this.RAM = new Memory();
        this.MMU = new MMU(this.RAM)

        // CPU
        this.CPU = new Cpu(this.MMU);
        
        // clock
        this.CLK = new Clock(CLOCK_INTERVAL);
        this.CLK.debug = false; // debug log switch
        this.CLK.addListener(this.CPU); // CPU added first so data is processed first on pulse
        this.CLK.addListener(this.RAM); // RAM added second so changed data can be read/written
        this.CLK.startPulse(); // begin clock cycle
        
        // flash RAM with program on startup
        this.CPU.flash(0x0000, triangleNums);

        return true;
    }

    public stopSystem(): boolean {
        return false;
    }
}

// create System instance
let system: System = new System(0, "SYS");