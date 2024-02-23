import {Hardware} from "./Hardware";
import {Interrupt} from "./imp/Interrupt";
import {ASCII} from "../utility/ascii";
import { InterruptController } from "./InterruptController";

/**
 * VirtualKeyboard class
 * implements Interrupt interface
 * monitors key presses
 */
export class VirtualKeyboard extends Hardware implements Interrupt {

    irq: number;
    priority: number;
    outputBuffer: number[];
    name: string;

    // controller for keyboard
    private irc: InterruptController;

    constructor(irc: InterruptController) {
        super(0, "VKB");
        this.log("created");

        this.irq = 0;
        this.name = "VKB";
        this.priority = 0;
        this.outputBuffer = new Array<number>();

        this.irc = irc;

        this.monitorKeys();
    }
    
    // monitor for keyboard input
    private monitorKeys() {
        /*
        character stream from stdin code (most of the contents of this function) taken from here
        https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin

        This takes care of the simulation we need to do to capture stdin from the console and retrieve the character.
        Then we can put it in the buffer and trigger the interrupt.
         */
        var stdin = process.stdin;

        // without this, we would only get streams once enter is pressed
        // raises an error - does not recognize setRawMode() as a function
        if (stdin.isTTY) {
            stdin.setRawMode(true);
        }

        // resume stdin in the parent process (node app won't quit all by itself
        // unless an error or process.exit() happens)
        stdin.resume();

        // i don't want binary, do you?
        //stdin.setEncoding( 'utf8' );
        stdin.setEncoding(null);

        stdin.on( 'data', function( key ){
            //let keyPressed : String = key.charCodeAt(0).toString(2);
            //while(keyPressed.length < 8) keyPressed = "0" + keyPressed;
            let keyPressed: String = key.toString();

            this.log("Keys pressed - " + keyPressed);

            // ctrl-c ( end of text )
            // this let's us break out with ctrl-c
            if ( key.toString() === '\u0003' ) {
                process.exit();
            }

            // write the key to stdout all normal like
            //process.stdout.write( key);
            // put the key value in the buffer
            this.outputBuffer.push(keyPressed);

            // set the interrupt!
            this.irc.acceptInterrupt(this);

            // .bind(this) is required when running an asynchronous process in node that wishes to reference an
            // instance of an object.
        }.bind(this));
    }
}