import {Location} from "./location";
import {extractId} from "../utils";

export interface Character {
    id: number,
    name: string,
    status: string,
    species: string,
    type: string,
    gender: string,
    origin: number | undefined,
    location: number | undefined,
    image: URL,
    episodes: (number | undefined)[]
}

export function mapCharacter(character: any): Character {
    return {
        id: character.id,
        name: character.name,
        status: character.status,
        species: character.species,
        type: character.type,
        gender: character.gender,
        origin:  extractId(character.origin.url),
        location: extractId(character.location.url),
        episodes: character.episode.map((url: string) => extractId(url)),
        image: character.image,
    }
}