// Exclusions Test
import * as fs from 'fs/promises'
import path from 'path';

let dirname = path.dirname(process.argv[1])

const exclusion_file = await fs.readFile(dirname + '/../src/' + 'exclusions.json', 'utf8')
    .catch((err) => {
        console.error('Could not read exclusions', err)
    })
// interface Exclusion {
//     exclude: string
// }

let exclusions = JSON.parse(exclusion_file ?? '[]') as string[]

export default function checkExcluded(url: string, exclusions: string[]): boolean {
    let excluded = false

    if (url === undefined) {
        return false
    }

    if (exclusions !== undefined &&
        Array.isArray(exclusions) &&
        exclusions.length === 0) {
        return false
    }
    // Filter out undefined, null, and empty strings
    exclusions = filterUndefinedNullEmptyString(exclusions);

    // Compare all strings lowercased
    url = url.toLocaleLowerCase()
    return exclusions.map((e) => {
        e = e.toLocaleLowerCase()
        if (e !== undefined &&
            url.includes(e)
            || url.endsWith(e)
            || url == e) {
            excluded = true
            // console.log(`'${e}' IS IN ${url}`);
        }
        return excluded
    })
        // Get boolean value of excluded
        .reduce((acc, curr) => acc || curr)
}

let links = [
    "https://www.pinterest.ca/dracana96/pins/"

    , "https://www.pinterest.ca/dracana96/concept-art/"
    , "https://www.pinterest.ca/dracana96/concept-art/creatures/"

    , "https://www.pinterest.ca/dracana96/abstract-art/"

    , "https://www.pinterest.ca/dracana96/wallpapers/"

    , "https://www.pinterest.ca/dracana96/random-posts/"

    , "https://www.pinterest.ca/dracana96/my-saves/"

    , "https://www.pinterest.ca/dracana96/funny-photos/"

    , "https://www.pinterest.ca/dracana96/funny-cartoon-wallpapers/"

    , "https://www.pinterest.ca/dracana96/anime/"

    , "https://www.pinterest.ca/dracana96/cute-funny-animals/"

    , "https://www.pinterest.ca/dracana96/digital-painting-tutorials/"

    , "https://www.pinterest.ca/dracana96/james-bond/"

    , "https://www.pinterest.ca/dracana96/clear-face-mask/",
    "https://www.pinterest.ca/dracana96/clear-face-mask/coronavirus/",
    "https://www.pinterest.ca/dracana96/cute-funny-animals/"
]

let boardNames = links.map((link) => {
    let boardName = link.split('/')
    return boardName[boardName.length - 2]
})

let isExcluded = checkExcluded(links[1], exclusions)



console.log("Test exclusions: ", exclusions);
console.log("Test board names: ", boardNames);

boardNames.forEach((boardName) => {
    console.log(boardName)
    console.log(checkExcluded(boardName, exclusions))
})

let sectionNames = links.map((link) => {
    let sectionName = link.split('/')
    return sectionName[sectionName.length - 2]
})

console.log("Test section names:", sectionNames);
sectionNames.forEach((sectionName) => {
    console.log(sectionName)
    console.log(checkExcluded(sectionName, exclusions))
})

function filterUndefinedNullEmptyString(exclusions: string[]) {
    return exclusions.filter((i: string) => i !== undefined || i !== '');
}

console.log("Test links:", links);
links.forEach((link) => {
    console.log(link)
    console.log(checkExcluded(link, exclusions))
})


console.log("Filtering links NOT excluded");
let links_not_excluded = links.filter((link) => {
    return !checkExcluded(link, exclusions)
})
console.log("Links excluded:", links_not_excluded, links_not_excluded.length);

let links_excluded = links.filter((link) => {
    return checkExcluded(link, exclusions)
})
console.log("Filtering links excluded", links_excluded, links_excluded.length);
