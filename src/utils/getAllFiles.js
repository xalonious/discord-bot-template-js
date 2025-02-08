const fs = require("fs")
const path = require("path")

module.exports = (directory, foldersOnly = false) => {
    const files = fs.readdirSync(directory, { withFileTypes: true })

    return files
        .filter(file => foldersOnly ? file.isDirectory() : file.isFile())
        .map(file => path.join(directory, file.name))
}