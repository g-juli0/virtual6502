import {Hardware} from "./Hardware";
import {Memory} from "./Memory";

/**
 * MMU class
 * memory management unit utilized by CPU to prevent diret interaction with memory
 */
export class MMU extends Hardware {

    private memory: Memory = null;
    private lob: number;
    private hob: number;
    
    // constructor
    constructor(m:Memory) {
        // call to super
        super(0, "MMU");
        this.log("created");

        // access to memory object
        this.memory = m;
        this.lob = 0;
        this.hob = 0;
    }

    // calls memory object read function
    public read(): number {
        return this.memory.read();
    }

    // calls memory object write function
    public write(): void {
        this.memory.write();
    }

    // getter for MAR - returns contents of memory address register
    public getMAR(): number {
        return this.memory.getMAR();
    }

    // setter for MAR - sets contents memory address register
    // overloaded to accept one 16bit number or two bytes
    public setMAR(n:number, n2?:number): void {
        // given one parameter
        if(typeof n === 'number' && typeof n2 === 'undefined') {
            this.memory.setMAR(n);
        // given two parameters (LOB and HOB)
        } else if(typeof n === 'number' && typeof n2 === 'number') {
            this.setLowOrderByte(n);
            this.setHighOrderByte(n2);
            this.memory.setMAR(this.littleEndian());
        }
    }

    // getter for MDR - gets stored data
    public getMDR(): number {
        return this.memory.getMDR();
    }

    // setter for MDR - sets data to be stored
    public setMDR(n:number): void {
        this.memory.setMDR(n);
    }

    // getter for low order byte
    public getLowOrderByte(): number {
        return this.lob;
    }

    // setter for low order byte
    public setLowOrderByte(n:number): void {
        this.lob = n;
    }

    // getter for high order byte
    public getHighOrderByte(): number {
        return this.hob;
    }

    // setter for high order byte
    public setHighOrderByte(n:number): void {
        this.hob = n;
    }

    // setter for read flag
    public setReadFlag(b:boolean): void {
        this.memory.setReadFlag(b);
    }

    // getter for read flag
    public getReadFlag(): boolean {
        return this.memory.getReadFlag();
    }

    // setter for write flag
    public setWriteFlag(b:boolean): void {
        this.memory.setWriteFlag(b);
    }

    // getter for write flag
    public getWriteFlag(): boolean {
        return this.memory.getWriteFlag();
    }

    // function to convert LOB and HOB into little endian format
    public littleEndian(): number {
        let l = this.getLowOrderByte();
        let h = this.getHighOrderByte();

        h = (h << 8);   // shift HOB 2 places left
        h += l;         // add LOB

        return h;
    }

    // read from memory immediately
    public readImmediate(): number {
        return this.memory.read();
    }

    // used to "flash" program to memory on startup
    public writeImmediate(address:number, data:number): void {
        this.memory.setMAR(address);
        this.memory.setMDR(data);
        this.memory.write();
    }

    // display memory over a range of addresses
    public memoryDump(fromAddress:number, toAddress:number): void {
        // header
        this.log("Memory Dump: Debug");
        this.log("-------------------------");
        // loop
        for(let i = fromAddress; i < toAddress; i++) {
            this.memory.displayMemory(i);
        }
        // footer
        this.log("-------------------------");
        this.log("Memory Dump: Complete");
    }
}