import rawCharacters from './assets/characters.json';
import {Character, mapCharacter} from "./types/character";
import {generateCypherQuery} from "./query/cypher-query-builder";
import {Episode, mapEpisode} from "./types/episode";
import {Location, mapLocation} from "./types/location";

(async () => {
    const characters = rawCharacters.map(mapCharacter);
    
    const episodes = await getAllEpisodes(characters);
    const locations = await getAllLocations(characters);
    
    // console.table(characters);
    // console.table(episodes);
    // console.table(locations);
    
    await generateCypherQuery(characters, episodes, locations);
})();

async function getAllEpisodes(characters: Character[]) {
    const episodeIds: number[] = [];

    for (const character of characters) {
        for (const episode of character.episodes) {
            if (!(episode && !episodeIds.includes(episode)))
                continue;

            episodeIds.push(episode);
        }
    }

    const urlQuery = 'https://rickandmortyapi.com/api/episode/' + episodeIds.join(',');

    console.log('fetching episodes from url : ', urlQuery);
    
    const responseEpisode = await fetch(urlQuery);
    if (!responseEpisode.ok)
        console.error(responseEpisode);

    return (await responseEpisode.json()).map(mapEpisode) as Episode[];
}

async function getAllLocations(characters: Character[]) {
    const locationIds: number[] = [];

    for (const character of characters) {
        if (character.location && !locationIds.includes(character.location))
            locationIds.push(character.location);
        if (character.origin && !locationIds.includes(character.origin))
            locationIds.push(character.origin);
    }


    const urlQuery = 'https://rickandmortyapi.com/api/location/' + locationIds.join(',');

    console.log('fetching locations from url : ', urlQuery);
    
    const responseLocation = await fetch(urlQuery);
    if (!responseLocation.ok)
        console.error(responseLocation);

    return (await responseLocation.json()).map(mapLocation) as Location[];
}