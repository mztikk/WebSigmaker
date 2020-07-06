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

function errorNotification(message: string) {
    let msgDiv = document.createElement("div")
    msgDiv.innerText = String(message)
    msgDiv.classList.add("alert")
    msgDiv.classList.add("gone")
    document.body.appendChild(msgDiv)

    // TODO: css animation
    setTimeout(() => {
        msgDiv.classList.remove("gone")
        setTimeout(() => {
            msgDiv.classList.add("gone")
            setTimeout(() => {
                msgDiv.remove()
            }, 500)
        }, 3000)
    }, 100)
}