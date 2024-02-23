
/**
 * Hardware class
 * parent class of all hardware devices
 * includes log function and hex to string conversion function
 */
export class Hardware {

    public id: number;
    public name: string;
    public debug: boolean = true;

    // global boolean to shut down all hardware on program end
    public static status: boolean = true;

    // constructor
    constructor(id:number, name:string) {
        this.id = id;
        this.name = name;
        Hardware.status = true;
    }

    // getter for hardware status
    public getStatus(): boolean {
        return Hardware.status;
    }

    // setter for hardware status
    public setStatus(b:boolean): void {
        Hardware.status = b;
    }

    // debug log function - logs message to console if debug mode is on
    public log(message:string): void {
        if(this.debug) {
            console.log("[" + this.name + " id: " + String(this.id) + " - " + Date.now() + "]: " + message);
        }
    }

    // convert hex number to string with capitalization and appropriate padding based on specified length
    public hexLog(n:number, length:number): string {
        // initalize empty string
        let hexString: string = "";
        let hex: string = n.toString(16).toUpperCase();
        
        // loop to add placeholder zeros
        for(let i = 0; i < length - hex.length; i++) {
            hexString += "0";
        }

        // concatenate uppercase hex number to string
        hexString += n.toString(16).toUpperCase();

        return "0x" + hexString;
    }
}