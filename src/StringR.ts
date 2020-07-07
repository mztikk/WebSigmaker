module StringR {
    let whitespacechars = [
        '\u0020',
        '\u00A0',
        '\u1680',
        '\u2000',
        '\u2001',
        '\u2002',
        '\u2003',
        '\u2004',
        '\u2005',
        '\u2006',
        '\u2007',
        '\u2008',
        '\u2009',
        '\u200A',
        '\u202F',
        '\u205F',
        '\u3000',
        '\u2028',
        '\u2029',
        '\u0009',
        '\u000A',
        '\u000B',
        '\u000C',
        '\u000D',
        '\u0085',
    ]

    export function inSplit(str: string, n: number, seperator: string): string {
        if (n <= 0 || seperator === "") {
            return str
        }

        let rtn: string[] = []
        let i = 0
        while (i < str.length) {
            let c = str[i++]
            rtn.push(c)
            if (i % n == 0 && i < str.length) {
                rtn.push(seperator)
            }
        }

        return rtn.join("")
    }

    export function removeWhitespace(input: string): string {
        return removeChars(input, whitespacechars)
    }

    export function removeChars(input: string, chars: string[]): string {
        let rtn: string[] = new Array()
        for (const char of input) {
            if (chars.indexOf(char) === -1) {
                rtn.push(char)
            }
        }

        return rtn.join("")
    }
}