import {fs} from '@tauri-apps/api'
import { exists } from 'tauri-plugin-fs-extra-api'
import { documentDir } from '@tauri-apps/api/path';
import { BaseDirectory } from '@tauri-apps/api/fs';

var data = {}

export async function init(presets) {
    documentDir().then((value)=>{
        console.log(value)
        exists(`${value}/data.json`).then(async (val) => {
            console.log(val)
            if (!val){
                if (presets != null){
                    await fs.writeTextFile(`data.json`, `${JSON.stringify(presets)}`, { dir: BaseDirectory.Document})
                }   
                else {
                    await fs.writeTextFile(`data.json`, '{}', { dir: BaseDirectory.Document})
                }
                
            }
        })
    })
}

export async function load(){

    data = JSON.parse(await fs.readTextFile('data.json', { dir: BaseDirectory.Document}))
   
}

export function set(name, value){
    Object.assign(data, {[name]: value})
}

export function get(keyname){
    return data[keyname]
}

export async function save(){
    await fs.writeTextFile(`data.json`, `${JSON.stringify(data)}`, { dir: BaseDirectory.Document})
}

export async function erasedata(){
    await fs.writeTextFile(`data.json`, " ", { dir: BaseDirectory.Document})
}

export function getall(){
    return data
}


