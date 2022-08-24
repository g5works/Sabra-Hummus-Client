import {fs} from '@tauri-apps/api'
import { BaseDirectory } from '@tauri-apps/api/fs';

var data = {}

export function test() {
    return "hello"
}

export async function load(){
    data = JSON.parse(await fs.readTextFile('data.json'), { dir: BaseDirectory.Document})
}

export function set(name, value){
    Object.assign(data, {[name]: value})
}

export async function save(){
    await fs.writeTextFile(`data.json`, `${JSON.stringify(data)}`, { dir: BaseDirectory.Document})
}

export function getall(){
    return data
}
