"use strict";
class AobValidator {
    constructor() {
        this.allowedChars = "abcdef0123456789?";
    }
    IsValid(input) {
        if (!input || input === "") {
            return [false, "Input is null or empty"];
        }
        let trimmed = StringR.removeWhitespace(input);
        let illegalChars = trimmed.toLowerCase().split("").filter(x => !this.allowedChars.includes(x));
        if (illegalChars.length > 0) {
            return [false, `Illegal chars ${illegalChars}`];
        }
        if (trimmed.length % 2 != 0) {
            return [false, "Bytes need to be full bytes, length of input has to be divisible by two"];
        }
        return [true, ""];
    }
}
class Sigmaker {
    constructor(aobValidator = new AobValidator()) {
        this.aobValidator = aobValidator;
        this.sigs = new Array();
    }
    internalPush(signature) {
        let [success, message] = this.aobValidator.IsValid(signature);
        if (success) {
            this.sigs.push(signature);
        }
        else {
            throw new Error(message);
        }
    }
    add(signature) {
        this.internalPush(signature);
        return this;
    }
    addRange(signatures) {
        for (const signature of signatures) {
            this.internalPush(signature);
        }
        return this;
    }
    static standardize(signature) {
        signature = StringR.removeWhitespace(signature);
        if (signature.length % 2 != 0) {
            throw new Error("Signature length (excluding whitespace) must be divisible by 2");
        }
        return StringR.inSplit(signature, 2, " ").toUpperCase();
    }
    static makeDirect(signatures) {
        let ordered = signatures.map(x => StringR.removeWhitespace(x)).filter(x => !(x === "")).sort(x => x.length);
        if (ordered.length == 0) {
            return "";
        }
        let build = ordered[0].split("");
        for (const aob of ordered) {
            for (let i = 0; i < build.length; i++) {
                if (build[i] === "?" || build[i] === aob[i]) {
                    continue;
                }
                build[i] = "?";
            }
        }
        for (let i = 0; i < build.length; i++) {
            if (build[i] === "?") {
                if (i % 2 === 0) {
                    build[i + 1] = "?";
                }
                else {
                    build[i - 1] = "?";
                }
            }
        }
        return Sigmaker.standardize(build.join(""));
    }
    make() {
        return Sigmaker.makeDirect(this.sigs);
    }
}
var StringR;
(function (StringR) {
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
    ];
    function inSplit(str, n, seperator) {
        if (n <= 0 || seperator === "") {
            return str;
        }
        let rtn = [];
        let i = 0;
        while (i < str.length) {
            let c = str[i++];
            rtn.push(c);
            if (i % n == 0 && i < str.length) {
                rtn.push(seperator);
            }
        }
        return rtn.join("");
    }
    StringR.inSplit = inSplit;
    function removeWhitespace(input) {
        return removeChars(input, whitespacechars);
    }
    StringR.removeWhitespace = removeWhitespace;
    function removeChars(input, chars) {
        let rtn = new Array();
        for (const char of input) {
            if (chars.indexOf(char) === -1) {
                rtn.push(char);
            }
        }
        return rtn.join("");
    }
    StringR.removeChars = removeChars;
})(StringR || (StringR = {}));
function OnGenButtonClick(self) {
    let input = document.getElementById("input");
    let output = document.getElementById("output");
    if (!input || !output) {
        return;
    }
    try {
        output.value = new Sigmaker().addRange(input.value.split("\n")).make();
    }
    catch (error) {
        errorNotification(error);
    }
}
let notifDiv;
function errorNotification(message, displayTime = 5000) {
    let removeOnEnd = () => {
        if (notifDiv) {
            notifDiv.remove();
            notifDiv = null;
        }
    };
    if (notifDiv) {
        removeOnEnd();
    }
    notifDiv = document.createElement("div");
    notifDiv.innerText = String(message);
    notifDiv.classList.add("notification");
    notifDiv.classList.add("slide-bottom");
    document.body.appendChild(notifDiv);
    setTimeout(() => {
        if (notifDiv) {
            notifDiv.classList.remove("slide-bottom");
            notifDiv.classList.add("slide-out-top");
            notifDiv.addEventListener('webkitAnimationEnd', removeOnEnd);
            notifDiv.addEventListener('animationend', removeOnEnd);
        }
    }, displayTime);
}
