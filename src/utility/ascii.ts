/**
 * ASCII class
 * contains map with (key, value) pairs that correspond to ASCII characters
 */
export class ASCII {
    
    // mapt to store (key, value) pair as (hex, char)
    public static ASCIImap = new Map<number, string>();

    constructor() {
        ASCII.setup();
        console.log("[Utility: ASCII]: Created ASCII map - elements: " + ASCII.ASCIImap.size);
    }

    // given hex key, return character string
    public static getChar(key: number): string {
        for (let element of this.ASCIImap.entries()) {
          // once the key matches return its key value
          if (element[0] == key) {
            return element[1];
          }
        }
    }

    // given character string, get hex key
    public static getHex(charcter: string): number {
        for (let element of this.ASCIImap.entries()) {
          // once the key matches return its key value
          if (element[1] == charcter) {
            return element[0];
          }
        }
    }

    private static setup(): void {

        // special non-printing characters
        this.ASCIImap.set(0x00, "NUL");
        this.ASCIImap.set(0x01, "SOH");
        this.ASCIImap.set(0x02, "STX");
        this.ASCIImap.set(0x03, "ETX");
        this.ASCIImap.set(0x04, "EOT");
        this.ASCIImap.set(0x05, "ENQ");
        this.ASCIImap.set(0x06, "ACK");
        this.ASCIImap.set(0x07, "BEL");
        this.ASCIImap.set(0x08, "BS");
        this.ASCIImap.set(0x09, "\t");
        this.ASCIImap.set(0x0A, "\n");
        this.ASCIImap.set(0x0B, "VT");
        this.ASCIImap.set(0x0C, "FF");
        this.ASCIImap.set(0x0D, "\r");
        this.ASCIImap.set(0x0E, "SO");
        this.ASCIImap.set(0x0F, "SI");
        this.ASCIImap.set(0x10, "DLE");
        this.ASCIImap.set(0x11, "DC1");
        this.ASCIImap.set(0x12, "DC2");
        this.ASCIImap.set(0x13, "DC3");
        this.ASCIImap.set(0x14, "DC4");
        this.ASCIImap.set(0x15, "NAK");
        this.ASCIImap.set(0x16, "SYN");
        this.ASCIImap.set(0x17, "ETB");
        this.ASCIImap.set(0x18, "CAN");
        this.ASCIImap.set(0x19, "EM");
        this.ASCIImap.set(0x1A, "SUB");
        this.ASCIImap.set(0x1B, "ESC");
        this.ASCIImap.set(0x1C, "FS");
        this.ASCIImap.set(0x1D, "GS");
        this.ASCIImap.set(0x1E, "RS");
        this.ASCIImap.set(0x1F, "US");

        // special characters
        this.ASCIImap.set(0x20, " ");
        this.ASCIImap.set(0x21, "!");
        this.ASCIImap.set(0x22, '"');
        this.ASCIImap.set(0x23, "#");
        this.ASCIImap.set(0x24, "$");
        this.ASCIImap.set(0x25, "%");
        this.ASCIImap.set(0x26, "&");
        this.ASCIImap.set(0x27, "'");
        this.ASCIImap.set(0x28, "(");
        this.ASCIImap.set(0x29, ")");
        this.ASCIImap.set(0x2A, "*");
        this.ASCIImap.set(0x2B, "+");
        this.ASCIImap.set(0x2C, ",");
        this.ASCIImap.set(0x2D, "-");
        this.ASCIImap.set(0x2E, ".");
        this.ASCIImap.set(0x2F, "/");

        // numbers
        this.ASCIImap.set(0x30, "0");
        this.ASCIImap.set(0x31, "1");
        this.ASCIImap.set(0x32, "2");
        this.ASCIImap.set(0x33, "3");
        this.ASCIImap.set(0x34, "4");
        this.ASCIImap.set(0x35, "5");
        this.ASCIImap.set(0x36, "6");
        this.ASCIImap.set(0x37, "7");
        this.ASCIImap.set(0x38, "8");
        this.ASCIImap.set(0x39, "9");

        // punctuation
        this.ASCIImap.set(0x3A, ":");
        this.ASCIImap.set(0x3B, ";");
        this.ASCIImap.set(0x3C, "<");
        this.ASCIImap.set(0x3D, "=");
        this.ASCIImap.set(0x3E, ">");
        this.ASCIImap.set(0x3F, "?");
        this.ASCIImap.set(0x40, "@");

        // uppercase letters
        this.ASCIImap.set(0x41, "A");
        this.ASCIImap.set(0x42, "B");
        this.ASCIImap.set(0x43, "C");
        this.ASCIImap.set(0x44, "D");
        this.ASCIImap.set(0x45, "E");
        this.ASCIImap.set(0x46, "F");
        this.ASCIImap.set(0x47, "G");
        this.ASCIImap.set(0x48, "H");
        this.ASCIImap.set(0x49, "I");
        this.ASCIImap.set(0x4A, "J");
        this.ASCIImap.set(0x4B, "K");
        this.ASCIImap.set(0x4C, "L");
        this.ASCIImap.set(0x4D, "M");
        this.ASCIImap.set(0x4E, "N");
        this.ASCIImap.set(0x4F, "O");
        this.ASCIImap.set(0x50, "P");
        this.ASCIImap.set(0x51, "Q");
        this.ASCIImap.set(0x52, "R");
        this.ASCIImap.set(0x53, "S");
        this.ASCIImap.set(0x54, "T");
        this.ASCIImap.set(0x55, "U");
        this.ASCIImap.set(0x56, "V");
        this.ASCIImap.set(0x57, "W");
        this.ASCIImap.set(0x58, "X");
        this.ASCIImap.set(0x59, "Y");
        this.ASCIImap.set(0x5A, "Z");

        // special characters
        this.ASCIImap.set(0x5B, "[");
        this.ASCIImap.set(0x5C, "\\");
        this.ASCIImap.set(0x5D, "]");
        this.ASCIImap.set(0x5E, "^");
        this.ASCIImap.set(0x5F, "_");
        this.ASCIImap.set(0x60, "`");

        // lowercase characters
        this.ASCIImap.set(0x61, "a");
        this.ASCIImap.set(0x62, "b");
        this.ASCIImap.set(0x63, "c");
        this.ASCIImap.set(0x64, "d");
        this.ASCIImap.set(0x65, "e");
        this.ASCIImap.set(0x66, "f");
        this.ASCIImap.set(0x67, "g");
        this.ASCIImap.set(0x68, "h");
        this.ASCIImap.set(0x69, "i");
        this.ASCIImap.set(0x6A, "j");
        this.ASCIImap.set(0x6B, "k");
        this.ASCIImap.set(0x6C, "l");
        this.ASCIImap.set(0x6D, "m");
        this.ASCIImap.set(0x6E, "n");
        this.ASCIImap.set(0x6F, "o");
        this.ASCIImap.set(0x70, "p");
        this.ASCIImap.set(0x71, "q");
        this.ASCIImap.set(0x72, "r");
        this.ASCIImap.set(0x73, "s");
        this.ASCIImap.set(0x74, "t");
        this.ASCIImap.set(0x75, "u");
        this.ASCIImap.set(0x76, "v");
        this.ASCIImap.set(0x77, "w");
        this.ASCIImap.set(0x78, "x");
        this.ASCIImap.set(0x79, "y");
        this.ASCIImap.set(0x7A, "z");

        // special characters
        this.ASCIImap.set(0x7B, "{");
        this.ASCIImap.set(0x7C, "|");
        this.ASCIImap.set(0x7D, "}");
        this.ASCIImap.set(0x7E, "~");
        this.ASCIImap.set(0x7F, "DEL");
    }
}