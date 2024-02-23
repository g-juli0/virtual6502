import { Hardware } from "./Hardware";
import { VirtualKeyboard } from "./VirtualKeyboard";
import { ClockListener } from "./imp/ClockListener";
import { Interrupt } from "./imp/Interrupt";

/**
 * InterruptController class
 * keeps track of all interrupt driven hardware objects
 */
export class InterruptController extends Hardware {

    // keep track of all hardware that generate interrupts
    private devices = new Array<Hardware>();

    // keep track of all interrupts generated
    private interruptQueue = new Array<Interrupt>();

    constructor() {
        super(0, "IRC");
        this.log("created");
    }

    // add hardware devices that request interrupts
    public addDevice(device: Hardware): void {
        this.devices.push(device);
    }

    // adds Interrupt to queue and resorts by priority
    public acceptInterrupt(interrupt: Interrupt): void {
        this.interruptQueue.push(interrupt);
        this.sortByPriority();
    }

    // sorts interrupt queue by priority
    public sortByPriority(): void {
        this.interruptQueue.sort((a, b) => a.priority - b.priority)
    }

    // resets output buffer
    public clearOutputBuffer(): void {
        this.interruptQueue = new Array<Interrupt>();
    }

    // returns highest priority Interrupt, if there is one
    public getPriorityInterrupt(): Interrupt {
        this.sortByPriority();
        if (this.interruptQueue.length > 0) {
            return this.interruptQueue[0];
        }
        return null;
    }
}