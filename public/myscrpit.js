const html2canvas = require("./html2canvas")

$("#download").on("click", function() {
    html2canvas(document.querySelector("#myCanvas")).then(canvas => {
        document.body.appendChild(canvas)
    })
})