import {Hardware} from "./Hardware";
import {ClockListener} from "./imp/ClockListener"

/**
 * Memory class
 * contains memory aray with 65536 entry capacity (based on 6502 memory capacity)
 */
export class Memory extends Hardware implements ClockListener {

    // array that stores memory
    // size of 0x10000 / 2^16 / 65536, 0-65535 / 64K
    private mem: number[];
    private mar = 0x0000;
    private mdr = 0x00;

    // flags to determine if read or write is required on clock pulse
    private readFlag: boolean;
    private writeFlag: boolean;

    // constructor
    constructor() {
        // call to super
        super(0, "RAM");
        this.log("Initialized Memory - addressable space: 65536");

        // initialize memory array
        this.mem = new Array(0x10000);
        this.reset();

        this.readFlag = false;
        this.writeFlag = false;
    }

    // getter for MAR
    public getMAR(): number {
        return this.mar;
    }

    // setter for MAR
    public setMAR(n:number): void {
        this.mar = n;
    }

    // getter for MDR
    public getMDR(): number {
        return this.mdr;
    }

    // setter for MDR
    public setMDR(n:number): void {
        this.mdr = n;
    }

    // setter for read flag
    public setReadFlag(b:boolean): void {
        this.readFlag = b;
    }

    // getter for read flag
    public getReadFlag(): boolean {
        return this.readFlag;
    }

    // setter for write flag
    public setWriteFlag(b:boolean): void {
        this.writeFlag = b;
    }

    // getter for write flag
    public getWriteFlag(): boolean {
        return this.writeFlag;
    }

    // read memory at the location in the MAR and update the MDR
    public read(): number {
        this.setMDR(this.mem[this.getMAR()]);
        return this.getMDR();
    }

    // write the contents of the MDR to memory at the location indicated by the MAR
    public write(): void {
        this.mem[this.getMAR()] = this.getMDR();
    }

    // clock pulse function - only does read/write on pulse if required
    public pulse(): void {
        if(this.getWriteFlag()) {
            this.write();
            this.log("Data changes written to memory.");
            this.setWriteFlag(false);
        }
        if(this.getReadFlag()) {
            this.read();
            this.log("Data read - address and data registers updated.");
            this.setReadFlag(false);
        }
    }

    // reset all indexes in memory to 0x00
    public reset(): void {
        // reset all elements of memory array to 0x00 (0 in hex)
        for(let i = 0x0000; i < 0x10000; i++) {
            this.mem[i] = 0x00;
        }
    }

    // displays the number stored in memory at index i
    // catches general exception and outputs error message
    public displayMemory(i:number): void {
        try {
            // log string of specified number at specified index in memory
            this.log("Addr  " + this.hexLog(i, 4) + " :   | " + this.hexLog(this.mem[i], 2))
        }
        // if any exception is thrown, log an arror message
        catch (ex) {
            this.log(ex.toString() + "- ERROR: number undefined");
        }
    }
}