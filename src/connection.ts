import postgresjs from "postgresjs";
import {database} from '~/settings.ts';

export function connect() {
    return postgresjs(database.url)
}

export type Connection = ReturnType<typeof connect>;

export enum DatabaseErrorCodes {
    TableDoesNotExist = '42P01',
}