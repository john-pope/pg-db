import postgresjs from "postgresjs";
import {database} from '../settings.ts';

export function connect() {
    return postgresjs(database.url)
}