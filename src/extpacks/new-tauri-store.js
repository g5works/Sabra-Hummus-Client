import {fs} from '@tauri-apps/api'
import { BaseDirectory } from '@tauri-apps/api/fs';

var data = e

export function test() {
    return "hello"
}

export async function testwrite(filename, filetext){
    fs.writeTextFile(`${filename}.txt`, `${filetext}`, { dir: BaseDirectory.Document})
}