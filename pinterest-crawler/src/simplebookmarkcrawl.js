// NODE VERSION
let userName = 'USERNAME'
let pins_url_bookmark = (userName, bookmark) => `https://www.pinterest.ca/resource/UserPinsResource/get/?source_url=%2F${userName}%2Fpins%2F&data=%7B%22options%22%3A%7B%22is_own_profile_pins%22%3Atrue%2C%22username%22%3A%22${userName}%22%2C%22field_set_key%22%3A%22grid_item%22%2C%22pin_filter%22%3Anull%2C%22bookmarks%22%3A%5B%22${bookmark}%22%5D%7D%2C%22context%22%3A%7B%7D%7D&_=1670393784068`

pins_url_bookmark = (userName, bookmark) => `https://www.pinterest.ca/resource/UserPinsResource/get/?source_url=%2F${userName}%2Fpins%2F&data=%7B%22options%22%3A%7B%22is_own_profile_pins%22%3Atrue%2C%22username%22%3A%22${userName}%22%2C%22field_set_key%22%3A%22grid_item%22%2C%22pin_filter%22%3Anull%2C%22bookmarks%22%3A%5B%22${bookmark}%22%5D%7D%2C%22context%22%3A%7B%7D%7D&_=1670393784068`

query = pins_url_bookmark(userName, '')
async function writeToFile(data) { await fs.writeFile('results.json', data, () => { }) }
let list = []
let i = 0
let timer = setInterval(async () => {
    console.log(query)
    response_json = await (await fetch(query)).json();
    bookmark = response_json.resource.options.bookmarks[0];
    query = pins_url_bookmark(userName, bookmark)

    let pins = response_json.resource_response.data
    // console.info(`pins: ${pins.length}`)
    // // console.log({ pins, bookmark })
    list.push(pins)
    // console.log(pins);

    // if (bookmark.includes('end')) {
    if (i > 2) {
        console.log('end');
        writeToFile(JSON.stringify(list.flat()))
        console.log("saved to file");
        clearInterval(timer)
        return
    }
    i++
}, 2000)
