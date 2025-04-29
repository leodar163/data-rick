import {Character} from "../types/character";
import {Episode} from "../types/episode";
import {Location} from "../types/location";
import {getDBDriver} from "./data-base-connexion";
import neo4j from "neo4j-driver";

export async function generateCypherQuery(characters: Character[], episodes: Episode[], locations: Location[]) {
    const driver = await getDBDriver();
    if ( !driver ) return;
    
    await Promise.all(characters.map(async character => driver.executeQuery(
        `MERGE (character:Character {id: $id, name: $name})`,
            {id: neo4j.int(character.id), name: character.name}))
    );
    
    await Promise.all(episodes.map(async episode => driver.executeQuery(
        `MERGE (episode:Episode {id: $id, name: $name})`,
        {id: neo4j.int(episode.id), name: episode.name}))
    );

    await Promise.all(locations.map(async location => driver.executeQuery(
        `MERGE (episode:Location {id: $id, name: $name})`,
        {id: neo4j.int(location.id), name: location.name}))
    );
    
    await Promise.all(characters
        .filter(c => c.origin != undefined)
        .map(async c =>  driver.executeQuery(`
        MATCH (character: Character {id: $cId})
        MATCH (location:Location {id: $locationId})
        MERGE (character)-[:is_from]->(location)
        `, 
            {cId: neo4j.int(c.id), locationId: neo4j.int(c.origin ?? 0)}
        ))
    );
    
    await Promise.all(characters
        .filter(c => c.location != undefined)
        .map(async c =>  driver.executeQuery(`
        MATCH (character: Character {id: $cId})
        MATCH (location:Location {id: $locationId})
        MERGE (character)-[:lives_in]->(location)
        `,
            {cId: neo4j.int(c.id), locationId: neo4j.int(c.location ?? 0)}
        ))
    );

    const apparitions: {idCharacter: number, idEpisode: number}[] = [];
    
    for (const character of characters) {
        for (const episodeId of character.episodes) {
            if (episodeId == undefined) continue;
            if (apparitions.find(apparition => 
                apparition.idCharacter == character.id
                && apparition.idEpisode == episodeId
            )) continue;
            
            apparitions.push({
                idCharacter: character.id,
                idEpisode: episodeId, 
            })
        }
    }
    
    await Promise.all(apparitions.map(async apparition => driver.executeQuery(`
                MATCH (character: Character {id: $cId})
                MATCH (episode:Episode {id: $episodeId})
                MERGE (character)-[:appears_in]->(episode)
                `,
        {cId: neo4j.int(apparition.idCharacter), episodeId: neo4j.int(apparition.idEpisode)}
        ))
    );
        
    await driver.close();
}

const constraints: string = `
    CREATE CONSTRAINT character_id_unique FOR (character:Character) REQUIRE character.id IS UNIQUE;
    CREATE CONSTRAINT character_id_not_null FOR (character:Character) REQUIRE character.id IS NOT NULL;
    CREATE CONSTRAINT character_id_int FOR (character:Character) REQUIRE character.id IS :: INTEGER;
    
    CREATE CONSTRAINT character_name_not_null FOR (character:Character) REQUIRE character.name IS NOT NULL;
    CREATE CONSTRAINT character_name_string FOR (character:Character) REQUIRE character.name IS :: STRING; 
    
    CREATE CONSTRAINT episode_id_unique FOR (episode:Episode) REQUIRE episode.id IS UNIQUE;
    CREATE CONSTRAINT episode_id_not_null FOR (episode:Episode) REQUIRE episode.id IS NOT NULL;
    CREATE CONSTRAINT episode_id_int FOR (episode:Episode) REQUIRE episode.id IS :: INTEGER;
    
    CREATE CONSTRAINT episode_name_not_null FOR (episode:Episode) REQUIRE episode.name IS NOT NULL;
    CREATE CONSTRAINT episode_name_string FOR (episode:Episode) REQUIRE episode.name IS :: STRING;
    
    CREATE CONSTRAINT location_id_unique FOR (location:Location) REQUIRE location.id IS UNIQUE;
    CREATE CONSTRAINT location_id_not_null FOR (location:Location) REQUIRE location.id IS NOT NULL;
    CREATE CONSTRAINT location_id_int FOR (location:Location) REQUIRE location.id IS :: INTEGER;
    
    CREATE CONSTRAINT location_name_not_null FOR (location:Location) REQUIRE location.name IS NOT NULL;
    CREATE CONSTRAINT location_name_string FOR (location:Location) REQUIRE location.name IS :: STRING;
`