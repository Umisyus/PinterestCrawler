import {Dataset, KeyValueStore} from "crawlee";

async function savetoKVS(data: any[], ds: KeyValueStore) {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        await ds.setValue(element.id, element)
    }
}

export async function savetoDS([data]: any, ds: Dataset) {
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        await ds.pushData(element)
    }
}