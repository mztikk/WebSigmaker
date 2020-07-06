class Sigmaker {
    private sigs: string[] = new Array()

    constructor(private readonly aobValidator: IAobValidator = new AobValidator()) {
    }

    private internalPush(signature: string) {
        let [success, message] = this.aobValidator.IsValid(signature)
        if (success) {
            this.sigs.push(signature)
        }
        else {
            throw new Error(message)
        }
    }

    public add(signature: string): Sigmaker {
        this.internalPush(signature)
        return this
    }

    /**
     * Adds multiple AoB Signatures
     * @param signatures AoB Signatures to add
     */
    public addRange(signatures: string[]): Sigmaker {
        for (const signature of signatures) {
            this.internalPush(signature)
        }

        return this
    }

    public static standardize(signature: string): string {
        signature = StringR.removeWhitespace(signature)
        if (signature.length % 2 != 0) {
            throw new Error("Signature length (excluding whitespace) must be divisible by 2")
        }

        return StringR.inSplit(signature, 2, " ").toUpperCase()
    }

    /**
     * Directly makes a AoB Signature from multiples
     * @param signatures AoB Signatures to make a single Signature from
     */
    public static makeDirect(signatures: string[]): string {
        let ordered = signatures.map(x => StringR.removeWhitespace(x)).filter(x => !(x === "")).sort(x => x.length)

        if (ordered.length == 0) {
            return ""
        }

        let build = ordered[0].split("")

        for (const aob of ordered) {
            for (let i = 0; i < build.length; i++) {
                if (build[i] === "?" || build[i] === aob[i]) {
                    continue
                }

                build[i] = "?"
            }
        }

        for (let i = 0; i < build.length; i++) {
            if (build[i] === "?") {
                if (i % 2 === 0) {
                    build[i + 1] = "?"
                }
                else {
                    build[i - 1] = "?"
                }
            }
        }

        return Sigmaker.standardize(build.join(""))
    }

    public make(): string {
        return Sigmaker.makeDirect(this.sigs)
    }
}
