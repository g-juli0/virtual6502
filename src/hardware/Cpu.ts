import {ASCII} from "../utility/ascii";
import {Hardware} from "./Hardware";
import {MMU} from "./MMU"
import {ClockListener} from "./imp/ClockListener"
import {InterruptController} from "./InterruptController";
import {VirtualKeyboard} from "./VirtualKeyboard";

// enum to keep track of pipeline cycle
enum cycle {
    fetch,          // 0
    decode1,        // 1
    decode2,        // 2
    execute1,       // 3
    execute2,       // 4
    writeBack,      // 5
    interruptCheck  // 6
}

/**
 * Cpu class
 * runs fetch-decode-execute cycle on each clock pulse
 * virtual accumulator and x and y general registers
 */
export class Cpu extends Hardware implements ClockListener {

    // keep track of clock count
    public cpuClockCount: number;

    // MMU instance for CPU to communicate with memory
    private MMU: MMU = null;
    // interrupt controller to manage interrupts and I/O devices
    private IRC: InterruptController = null;
    // keyboard I/O device
    private VKB: VirtualKeyboard = null;

    // initialize member variables
    private accumulator: number;
    private xReg: number;
    private yReg: number;
    private zFlag: number;      // zero flag

    private PC: number;         // program counter
    private IR: number;         // instruction register

    // hashmap to store how many operands each instruction has
    private opCodes : Map<number, number> = new Map<number, number>();

    // pipeline step
    private currentCycle: cycle = null;

    // CONSTRUCTOR
    constructor(mmu:MMU) {
        
        // call super constructor
        super(0, "CPU");
        this.log("created");

        // access to MMU
        this.MMU = mmu;

        // interrupt controller
        this.IRC = new InterruptController();

        // virtual keyboard
        this.VKB = new VirtualKeyboard(this.IRC);
        this.IRC.addDevice(this.VKB);

        // initialize clock count at 0
        this.cpuClockCount = 0;

        // initialize values for members on creation of CPU
        this.accumulator = 0x00;
        this.xReg = 0x00;
        this.yReg = 0x00;
        this.zFlag = 0;

        this.PC = 0x0000;
        this.IR = 0x00;
        this.currentCycle = cycle.fetch;

        // initialize hashmap values based on 6502 instruction set
        this.setupOpCodes();
    }

    // HELPER METHODS

    // maps each instruction to its amount of operands - special case for FF string printing
    private setupOpCodes(): void {
        this.opCodes.set(0xA9, 1);       
        this.opCodes.set(0xAD, 2);
        this.opCodes.set(0x8D, 2);
        this.opCodes.set(0x8A, 0);
        this.opCodes.set(0x98, 0);
        this.opCodes.set(0x6D, 2);
        this.opCodes.set(0xA2, 1);
        this.opCodes.set(0xAE, 2);
        this.opCodes.set(0xAA, 0);
        this.opCodes.set(0xA0, 1);
        this.opCodes.set(0xAC, 2);
        this.opCodes.set(0xA8, 0);
        this.opCodes.set(0xEA, 0);
        this.opCodes.set(0x00, 0);
        this.opCodes.set(0xEC, 2);
        this.opCodes.set(0xD0, 1);
        this.opCodes.set(0xEE, 2);
        this.opCodes.set(0xFF, 2);
    }

    // flash RAM with program on startup
    public flash(startAddress: number, program: number[]): void {
        let data = 0;

        for (let i = startAddress; data < program.length; i++) {
          this.MMU.writeImmediate(i, program[data]);
          data++;
        }
    }

    // calculates two's compliment for branching
    public getTwosComp(n: number): number {
        let binary = n.toString(2); // converts to binary string
        let flipped = binary.split('').map(bit => bit === '1' ? '0' : '1').join('');
        let twosComp = parseInt(flipped, 2) + 1;
        return twosComp;
    }

    // GETTERS AND SETTERS

    // accumulator getter method
    public getAccumulator(): number {
        return this.accumulator;
    }

    // accumulator setter method
    public setAccumulator(n:number): void {
        this.accumulator = n;
    }

    // xReg getter method
    public getXReg(): number {
        return this.xReg;
    }

    // xReg setter method
    public setXReg(n:number) {
        this.xReg = n;
    }

    // yReg getter method
    public getYReg(): number {
        return this.yReg;
    }

    // yReg setter method
    public setYReg(n:number) {
        this.yReg = n;
    }

    // getter for instruction register
    public getIR(): number {
        return this.IR;
    }

    // setter for instruction register
    public setIR(n:number): void {
        this.IR = n;
    }

    // CYCLE FUNCTIONS

    // fetches next instruction in memory at index of program counter
    public fetch(): void {
        this.MMU.setMAR(this.PC++);             // set MAR to current program counter and increment
        this.setIR(this.MMU.readImmediate());   // store contents of memory (the instruction) in the instruction register

        this.currentCycle = cycle.decode1;
    }

    // determine amount of execute steps
    public decode(): void {
        //this.setIR(this.MMU.getMDR());   // store contents of memory (the instruction) in the instruction register
        let current_instruction = this.getIR();

        // decode initial instruction
        if(this.opCodes.has(current_instruction) && this.opCodes.get(current_instruction) == 0) {           // no operands
            this.currentCycle = cycle.execute1;                 // begin execute step on next pulse
            return;                                             // no operands to decode

        } else if(this.opCodes.has(current_instruction) && this.opCodes.get(current_instruction) == 1) {    // 1 operand
            // set MAR to address of constant - to be read and used during execute
            this.MMU.setMAR(this.PC++);                         // set MAR to current address (holds the constant)
            this.MMU.setMDR(this.MMU.readImmediate());          // read the constant and save it in MDR to be used in execute
            this.currentCycle = cycle.execute1;                 // begin execute step on next pulse
            return;                                             // no more operands to read

        } else if(this.opCodes.has(current_instruction) && this.opCodes.get(current_instruction) == 2) {    // 2 operands

            if(current_instruction === 0xFF && this.getXReg() === 1)
            {
                this.currentCycle = cycle.execute1;             // no address to decode, skip to execute step
                return;                                         // return out of decode function
            }

            this.MMU.setMAR(this.PC++);                         // set MAR to current address and increment
            this.MMU.setMDR(this.MMU.readImmediate());          // set MDR to operand

            // first decode
            if(this.currentCycle === cycle.decode1) {
                // get LOB
                this.MMU.setLowOrderByte(this.MMU.getMDR());    // store LOB
                this.currentCycle = cycle.decode2;              // second decode cycle needed
                return;                                         // return to pulse function
            // second decode
            } else if(this.currentCycle === cycle.decode2) {
                // get HOB
                this.MMU.setHighOrderByte(this.MMU.getMDR());   // store LOB
                this.MMU.setMAR(this.MMU.littleEndian());       // set MAR to full address
                this.MMU.setMDR(this.MMU.readImmediate());      // set MDR to value at fully decoded address
                this.currentCycle = cycle.execute1;             // begin execute step
                return;                                         // return to pulse function - all decodes complete
            }
        }
    }

    public execute(): void {
        let current_instruction = this.getIR();

        // all data and addresses loaded into MDR and MAR at this point
        switch(current_instruction) {
            // 0 OPERAND EXECUTES
            case 0x8A: {
                // load accumulator from X register
                this.setAccumulator(this.getXReg());
                break;
            }
            case 0x98: {
                // load accumulator from Y register
                this.setAccumulator(this.getYReg());
                break;
            }
            case 0xAA: {
                // load X register from accumulator
                this.setXReg(this.getAccumulator());
                break;
            }
            case 0xA8: {
                // load Y register from accumulator
                this.setYReg(this.getAccumulator());
                break;
            }
            case 0xEA: {
                // no operation
                break;
            }
            case 0x00: {
                // system shutdown
                this.setStatus(false);
                this.log("Program complete - clock pulse stopped, hardware shut down.");
                process.exit(); // stop program
            }

            // 1 OPERAND EXECUTES
            case 0xA9: {
                // load accumulator with constant
                this.setAccumulator(this.MMU.getMDR());
                break;
            }
            case 0xA2: {
                // load x register with constant
                this.setXReg(this.MMU.getMDR());
                break;
            }
            case 0xA0: {
                // load y register with constant
                this.setYReg(this.MMU.getMDR());
                break;
            }
            case 0xD0: {
                // branch n bytes if z flag = 0 
                if(this.zFlag === 0) {
                    this.PC -= this.getTwosComp(this.MMU.getMDR());
                }
                break;
            }
            
            // 2 OPERAND EXECUTES
            case 0xAD: {
                // load accumulator from memory
                this.setAccumulator(this.MMU.getMDR());
                break;
            }
            case 0x8D: {
                // store accumulator in memory
                this.MMU.setMDR(this.getAccumulator());
                this.MMU.write();
                break;
            }
            case 0x6D: {
                // add with carry - add contents of address to accumulator and keep the result in accumulator
                this.setAccumulator(this.getAccumulator() + this.MMU.getMDR());
                break;
            }
            case 0xAE: {
                // load the x register from memory
                this.setXReg(this.MMU.getMDR());
                break;
            }
            case 0xAC: {
                // load the y register from memory
                this.setYReg(this.MMU.getMDR());
                break;
            }
            case 0xEC: {
                // compare byte in memory to x register, set z flag if equal
                if(this.MMU.getMDR() === this.getXReg()) {
                    this.zFlag = 1;
                }
                break;
            }
            case 0xEE: {
                // increment value of byte from memory 
                if (this.currentCycle === cycle.execute1){
                    // set accumulator
                    this.setAccumulator(this.MMU.getMDR());
                    this.currentCycle = cycle.execute2;
                    return;
                } else if(this.currentCycle === cycle.execute2) {
                    // increment accumulator
                    this.setAccumulator(this.getAccumulator()+1);
                    this.currentCycle = cycle.writeBack;
                    return;
                }
                break;
            }
            case 0xFF: {

                if(this.getXReg() === 1) {
                    // print contents of Y register
                    process.stdout.write(this.getYReg().toString() + "\n");
                } else if(this.getXReg() === 2) {
                    // Print the 0x00 terminated string stored at address in the Y register
                } else if(this.getXReg() === 3) {
                    // Print the 0x00 terminated string from the address in the operand
                    let addr = this.MMU.getMAR();
                    let ch = this.MMU.readImmediate();

                    if(ch === 0x00) {
                        this.currentCycle = cycle.interruptCheck;   // end of string, move to next step in cycle
                        this.debug = true;                          // turn debug mode back on
                        return;                                     // return out of function to next step
                    } else {                                        // otherwise, keep reading characters
                        process.stdout.write(ASCII.getChar(ch));    // translate hex code to character
                        this.MMU.setMAR(this.MMU.getMAR()+1);       // increment address
                        this.debug = false;                         // ensure debug mode is off so string printing mode is not interrupted
                        return;                                     // return without changing cycle to stay in execute step
                    }
                }
                break;
            }
            default: {
                this.log("Instruction not recognized.")
            }
        }
        this.currentCycle = cycle.interruptCheck;   // once instruction is executed, go to next cycle
    }

    // writes updated data back to memory (currently only used with increment instruction EE)
    public writeBack(): void {
        this.MMU.setMDR(this.getAccumulator());     // load MDR with accumulator data
        this.MMU.setWriteFlag(true);                // set write flag so data write happens on memory pulse
        this.currentCycle = cycle.interruptCheck;   // next step in cycle
    }

    // gets highest priority interrupt in queue
    public interruptCheck(): void {
        // get next Interrupt
        let interrupt = this.IRC.getPriorityInterrupt();
        if(interrupt != null && interrupt.outputBuffer.length > 0) {
            // log whatever is in the buffer and then clear for next input
            this.IRC.log(interrupt.outputBuffer[0].toString());
            this.IRC.clearOutputBuffer();
        }
        // restart cycle
        this.currentCycle = cycle.fetch;
    }

    // outputs value of registers, flags, and and counters for debug purposes
    public showDebugLog(): void {
        let msg = 
        "cpuClock: " + this.cpuClockCount.toString() +
        " | Acc: " + this.hexLog(this.accumulator, 2) +
        " | xReg: " + this.hexLog(this.getXReg(), 2) +
        " | yReg: " + this.hexLog(this.getYReg(), 2) +
        " | zFlag: " + this.zFlag.toString() +
        " | PC: " + this.hexLog(this.PC, 4) +
        " | IR: " + this.hexLog(this.getIR(), 2) +
        " | step: " + this.currentCycle.toString();

        this.log(msg);
    }

    // log clock pulse as it is incremented
    public pulse(): void {
        ++this.cpuClockCount // increment clock pulse count
        this.showDebugLog(); // debug message

        // FETCH
        if(this.currentCycle === cycle.fetch) {
            this.fetch();
            return; // exit out of pulse function to wait for next pulse
        
        // DECODE
        } else if (this.currentCycle === cycle.decode1 || this.currentCycle === cycle.decode2) {
            // all instructions requiring a second decode cycle will be decoded twice (instructions with 2 operands)
            this.decode();
            return; // wait for next pulse

        // EXECUTE
        } else if (this.currentCycle === cycle.execute1 || this.currentCycle === cycle.execute2) {
            // all instructions requiring a second execute cycle will be executed twice (currently only EE)
            this.execute();
            return; // wait for next pulse
        
        // WRITEBACK
        } else if (this.currentCycle === cycle.writeBack) {
            // only steps that write to memory require writeback (currently only EE)
            this.writeBack();
            return; // wait for next pulse
        
        // INTERRUPT CHECK
        } else if (this.currentCycle === cycle.interruptCheck) {
            this.interruptCheck();
            return; // wait for next pulse
        }
    }
}
