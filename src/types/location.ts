import {extractId} from "../utils";

export interface Location {
    id: number;
    name: string;
    type: string;
    dimension: string;
    residents: (number | undefined)[];
    url: URL;
}

export function mapLocation(location: any): Location {
    return {
        id: location.id,
        name: location.name,
        type: location.type,
        dimension: location.dimension,
        url: location.url,
        residents: location.residents.map((url: string) => extractId(url)),
    }
}