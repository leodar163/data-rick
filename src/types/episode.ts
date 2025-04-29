import {extractId} from "../utils";

export interface Episode {
    id: number,
    name: string,
    airDate: Date,
    episode: number,
    season: number,
    characters: (number | undefined)[],
    url: URL,
}

export function mapEpisode(episode: any): Episode {
    return {
        id: episode.id,
        name: episode.name,
        airDate: new Date(Date.parse(episode.air_date)),
        episode: Number.parseInt((episode.episode as string).slice(4)),
        season: Number.parseInt((episode.episode as string).slice(1,3)),
        characters: episode.characters.map((url: string)=> extractId(url)),
        url: episode.url,
    }
}