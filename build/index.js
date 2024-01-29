"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Pokemon {
    constructor() {
        this.name = ``;
        this.id = -999;
        this.image = ``;
        this.type = ``;
        this.types = [];
        this.altura = -999;
        this.peso = -999;
    }
}
const lista_no_html = document.getElementById(`listagem_pokemons`);
function mexer_html(pokemonio) {
    const poke_html = pokemonio.map((pokemon_data) => `            

                
    <li class="pokemon  ${pokemon_data.type}">
        <span class="numero">${pokemon_data.id}</span>
        <span class="nome" id="${pokemon_data.id}" >${pokemon_data.name}</span>

        <div class="detalhes">
            
            <ol class="tipos">  
                ${pokemon_data.types.map((i) => `<li class="tipo ${i}">${i}</li>`).join(``)}
            </ol>

            <img src="${pokemon_data.image}" alt="">

        </div>
    </li>

`).join(``);
    return poke_html;
}
function converter(data) {
    const pokemon = new Pokemon();
    pokemon.name = data.name;
    pokemon.id = data.id;
    pokemon.image = data.sprites.other.dream_world.front_default;
    const types = data.types.map((tipagem) => tipagem.type.name);
    const [type] = types;
    pokemon.types = types;
    pokemon.type = type;
    pokemon.altura = data.height / 10;
    pokemon.peso = data.weight / 10;
    return pokemon;
}
function Checagem__Erro__HTTP(resposta) {
    if (!resposta.ok) {
        throw new Error(`HTTP error! Status ${resposta.status}`);
    }
}
function pegar__detalhes(lista) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(lista.url);
        const data = yield response.json();
        const convertido = converter(data);
        return convertido;
    });
}
function pegarPokemon(offset = 0, limit = 20) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
        const response = yield fetch(url);
        Checagem__Erro__HTTP(response);
        const data = yield response.json();
        const lista_pokemons = data.results;
        const lista_detalhada = yield Promise.all(lista_pokemons.map((pokemon_individual) => __awaiter(this, void 0, void 0, function* () {
            const detalhes = yield pegar__detalhes(pokemon_individual);
            return detalhes;
        })));
        const convertido_html = mexer_html(lista_detalhada);
        //exportar este valor para outro arquivo ts
        console.log(convertido_html);
        lista_no_html.innerHTML += convertido_html;
        return convertido_html;
    });
}
pegarPokemon(0, 20);
