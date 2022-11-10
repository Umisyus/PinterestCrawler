import fs from 'fs';
    let [...pin_data]: Board[] = fs.readdirSync(dir, { withFileTypes: true })
    .map((file) => fs.readFileSync(dir + "/" + file.name))
    .map((data) => JSON.parse(data.toString('utf-8')))
