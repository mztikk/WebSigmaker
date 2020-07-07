function OnGenButtonClick(self: HTMLButtonElement) {
    let input = document.getElementById("input") as HTMLTextAreaElement
    let output = document.getElementById("output") as HTMLTextAreaElement
    if (!input || !output) {
        return
    }

    try {
        output.value = new Sigmaker().addRange(input.value.split("\n")).make()
    } catch (error) {
        errorNotification(error)
    }
}

let notifDiv: HTMLDivElement | null
function errorNotification(message: string, displayTime: number = 5000) {
    let removeOnEnd = () => {
        if (notifDiv) {
            notifDiv.remove()
            notifDiv = null
        }
    }

    if (notifDiv) {
        removeOnEnd()
    }

    notifDiv = document.createElement("div")
    notifDiv.innerText = String(message)
    notifDiv.classList.add("notification")
    notifDiv.classList.add("slide-bottom")
    document.body.appendChild(notifDiv)

    setTimeout(() => {
        if (notifDiv) {
            notifDiv.classList.remove("slide-bottom")
            notifDiv.classList.add("slide-out-top")
            notifDiv.addEventListener('webkitAnimationEnd', removeOnEnd)
            notifDiv.addEventListener('animationend', removeOnEnd)
        }
    }, displayTime)
}
