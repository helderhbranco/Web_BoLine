//#region CONSTANTS
const REGEX_SPACES = /^\s*$/;
const MSG_SPACES = "Não pode ser apenas espaços.";

const REGEX_NAME = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020\u002d]+$/;
const MSG_NAME_LIMIT = "Nome deve ter mais de 3 caracteres.";
const MSG_NAME_INVALID = "Nome deve conter apenas letras, espaços e hifens.";

const REGEX_STREET = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\u0020\u002d\u002c\u00ba\u00aa\u0030-\u0039]+$/;
const MSG_STREET_LIMIT = "Morada deve ter mais de 10 caracteres.";
const MSG_STREET_INVALID = "Morada deve conter apenas:\n  letras (A ou a)\n  espaços\n  hifens\n  virgulas\n  º\n numeros";

const REGEX_CITY = REGEX_NAME;
const MSG_CITY_LIMIT = "Cidade deve ter mais de 3 caracteres.";
const MSG_CITY_INVALID = "Cidade deve conter apenas letras e espaços.";

const REGEX_COUNTY = REGEX_NAME;
const MSG_COUNTY_LIMIT = "Distrito deve ter mais de 3 caracteres.";
const MSG_COUNTY_INVALID = "Distrito deve conter apenas letras e espaços.";

const REGEX_POSTAL_CODE = /^[a-zA-Z0-9\u002d]+$/;
const MSG_POSTAL_CODE_INVALID = "Código postal deve ter o formato XXXX-XXX.";

const REGEX_COUNTRY = REGEX_NAME;
const MSG_COUNTRY_LIMIT = "País deve ter mais de 3 caracteres.";
const MSG_COUNTRY_INVALID = "País deve conter apenas letras e espaços.";

const REGEX_COORDINATES = /^-?[0-9]{1,3}\.[0-9]{1,6}$/;
const MSG_COORDINATES_INVALID = "Coordenadas devem ter o formato XXX.XXXXXX.";

const REGEX_FORMATTED = REGEX_STREET;
const MSG_FORMATTED_LIMIT = "Morada formatada deve ter mais de 10 caracteres.";
const MSG_FORMATTED_INVALID = "Morada formatada deve conter apenas:\n  letras (A ou a)\n  espaços\n  hifens\n  virgulas\n  º\n numeros";
//#endregion

/**
 * Valida se o nome é válido
 * 
 * Regras:
 * - deve ter mais de 3 caracteres
 * - deve conter apenas letras, espaços e hifens
 * 
 * @param {String} name 
 * @returns true se for válido, false e mensagem de erro se não for válido
 */
function isValidName(name){

    if (REGEX_SPACES.test(name)){
        return [false, MSG_SPACES];
    }

    if (name.length < 3){
        return [false, MSG_NAME_LIMIT];
    }

    if (!REGEX_NAME.test(name)){
        return [false, MSG_NAME_INVALID];
    }

    return [true, ""];
}

/**
 * Valida se a morada é válida
 * 
 * Regras:
 * - deve ter mais de 10 caracteres
 * - deve conter apenas letras, espaços, hifens, virgulas, º e numeros
 * 
 * @param {String} street 
 * @returns true se for válido, false e mensagem de erro se não for válido
 */
function isValidStreet(street){

    if (REGEX_SPACES.test(street)){
        return [false, MSG_SPACES];
    }

    if (street.length < 10){
        return [false, MSG_STREET_LIMIT];
    }

    if (!REGEX_STREET.test(street)){
        return [false, MSG_STREET_INVALID];
    }

    return [true, ""];
}

/**
 * Valida se a cidade é válida
 * 
 * Regras:
 * - deve ter mais de 3 caracteres
 * - deve conter apenas letras e espaços
 * 
 * @param {String} city 
 * @returns true se for válido, false e mensagem de erro se não for válido
 */
function isValidCity(city){

    if (REGEX_SPACES.test(city)){
        return [false, MSG_SPACES];
    }

    if (city.length < 3){
        return [false, MSG_CITY_LIMIT];
    }

    if (!REGEX_CITY.test(city)){
        return [false, MSG_CITY_INVALID];
    }

    return [true, ""];
}

/**
 * Valida se o distrito é válido
 * 
 * Regras:
 * - deve ter mais de 3 caracteres
 * - deve conter apenas letras e espaços
 * 
 * @param {String} county
 * @returns true se for válido, false e mensagem de erro se não for válido
 */ 
function isValidCounty(county){

    if (REGEX_SPACES.test(county)){
        return [false, MSG_SPACES];
    }

    if (county.length < 3){
        return [false, MSG_COUNTY_LIMIT];
    }

    if (!REGEX_COUNTY.test(county)){
        return [false, MSG_COUNTY_INVALID];
    }

    return [true, ""];
}

/**
 * Valida se o código postal é válido
 * 
 * Regras:
 * - deve ter numeros e hifens
 *  
 * @param {String} postalCode
 * @returns true se for válido, false e mensagem de erro se não for válido
 */
function isValidPostalCode(postalCode){

    if (REGEX_SPACES.test(postalCode)){
        return [false, MSG_SPACES];
    }

    if (!REGEX_POSTAL_CODE.test(postalCode)){
        return [false, MSG_POSTAL_CODE_INVALID];
    }

    return [true, ""];
}

/**
 * Valida o pais é válido
 * 
 * Regras:
 * - deve ter mais de 3 caracteres
 * - deve conter apenas letras e espaços
 * 
 * @param {String} country 
 * @returns true se for válido, false e mensagem de erro se não for válido
 */
function isValidCountry(country){

    if(REGEX_SPACES.test(country)){
        return [false, MSG_SPACES];
    }

    if (country.length < 3){
        return [false, MSG_COUNTRY_LIMIT];
    }

    if (!REGEX_COUNTRY.test(country)){
        return [false, MSG_COUNTRY_INVALID];
    }

    return [true, ""];
}

/**
 * Valida se as coordenadas são válidas
 * 
 * Regras:
 * - deve ter o formato XXX.XXXXXX
 * 
 * @param {String} latitude
 * @param {String} longitude
 * @returns true se for válido, false e mensagem de erro se não for válido
 */
function isValidCoordinates(latitude, longitude){

    if (REGEX_SPACES.test(latitude) || REGEX_SPACES.test(longitude)){
        return [false, MSG_SPACES];
    }

    if (!REGEX_COORDINATES.test(latitude) || !REGEX_COORDINATES.test(longitude)){
        return [false, MSG_COORDINATES_INVALID];
    }

    return [true, ""];
}

function validateFormFind(){

    // validar name
    let [valid, name] = isValidName(document.getElementById("address_find").value);
    if (!valid){
        alert(name);
        return false;
    }

    //return false;
    document.getElementById("form-find").submit();
}

function verifyFormCreate(){

    // validar name
    let [v_name, name] = isValidName(document.getElementById("name").value);
    if (!v_name){
        alert(name);
        return false;
    }

    // validar street
    let [v_street, street] = isValidStreet(document.getElementById("street").value);
    if (!v_street){
        alert(street);
        return false;
    }

    // validar city
    let [v_city, city] = isValidCity(document.getElementById("city").value);
    if (!v_city){
        alert(city);
        return false;
    }

    // validar county
    let [v_county, county] = isValidCounty(document.getElementById("county").value);
    confirm(county);
    if (!v_county){
        alert(county);
        return false;
    }

    // validar postalCode
    let [v_postalCode, postalCode] = isValidPostalCode(document.getElementById("postalCode").value);
    if (!v_postalCode){
        alert(postalCode);
        return false;
    }

    // validar country
    let [v_country, country] = isValidCountry(document.getElementById("country").value);
    if (!v_country){
        alert(country);
        return false;
    }

    // validar coordenadas
    let [v_coordinates, coordinates] = isValidCoordinates(document.getElementById("latitude").value, document.getElementById("longitude").value);
    if (!v_coordinates){
        alert(coordinates);
        return false;
    }
    
    document.getElementById("form-create").submit();
}