import neo4j, {Driver, ServerInfo} from "neo4j-driver";

export async function getDBDriver() {
    const USER = "neo4j";
    const PASSWORD = "WtrIratnvFZ057ZYnw8ZLj3zo2mK0E7pF7AgGeXTpIU";
    const URI = 'neo4j+s://2b0b60bc.databases.neo4j.io'

    let driver: Driver;

    try {
        driver = neo4j.driver(
            URI, 
            neo4j.auth.basic(USER, PASSWORD),
            { disableLosslessIntegers: true }
        );
        const serverInfo: ServerInfo = await driver.getServerInfo();
        console.log(serverInfo);
        return driver;
    } 
    catch (error) {
        console.error(error);
    }
}
