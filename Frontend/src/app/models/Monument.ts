export class Monument {

    constructor( 
        name: string,
        address: {
            street: string;
            city: string;
            county: string;
            postcode: string;
            country: string;
            formatted: string;
        },
        coordinates: {
            lat: number;
            lon: number;
        },
        place_id: string,
        status: string
    ){ }
}