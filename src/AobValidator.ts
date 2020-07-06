class AobValidator implements IAobValidator {
    private allowedChars = "abcdef0123456789?"

    public IsValid(input: string): [boolean, string] {
        if (!input || input === "") {
            return [false, "Input is null or empty"]
        }

        let trimmed = StringR.removeWhitespace(input)
        let illegalChars = trimmed.toLowerCase().split("").filter(x => !this.allowedChars.includes(x))
        if (illegalChars.length > 0) {
            return [false, `Illegal chars ${illegalChars}`]
        }

        if (trimmed.length % 2 != 0) {
            return [false, "Bytes need to be full bytes, length of input has to be divisible by two"]
        }

        return [true, ""]
    }
}
