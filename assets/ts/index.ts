class Pokemon{
    name:string = ``;
    id:number = -999;
    image:string = ``;
    type:string = ``; 
    types:string[] = [];
    altura:number = -999;
    peso:number = -999;
}

const lista_no_html = document.getElementById(`listagem_pokemons`);

function mexer_html(pokemonio:any){
    const poke_html = pokemonio.map((pokemon_data: { type: any; id: any; name: any; image: any; types: any[] }) => `              
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

function converter(data: any): Pokemon{
    const pokemon = new Pokemon();
    pokemon.name = data.name;
    pokemon.id  = data.id
    pokemon.image = data.sprites.other.dream_world.front_default;

    const types = data.types.map((tipagem: {type: {name: string}}) => tipagem.type.name)
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type; 
    pokemon.altura = data.height/10;
    pokemon.peso = data.weight/10;

    return pokemon;
}

function Checagem__Erro__HTTP(resposta: Response): void{
    if(!resposta.ok){
        throw new Error(`HTTP error! Status ${resposta.status}`)
    }
}

async function pegar__detalhes(lista: {url: string}): Promise<Pokemon>{
    const response = await fetch(lista.url);
    const data = await response.json()
    const convertido = converter(data);
    
    return convertido;
}

async function pegarPokemon(offset:number = 0, limit:number = 20): Promise<string>{
    const url:string = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
                                                        Checagem__Erro__HTTP(response)
    const data = await response.json();

    const lista_pokemons: object[] = data.results;

    const lista_detalhada: object[] = await Promise.all(
        lista_pokemons.map(async (pokemon_individual: any) =>{
            const detalhes = await pegar__detalhes(pokemon_individual)
            return detalhes;
        })
    )
    const convertido_html = mexer_html(lista_detalhada);

    console.log(convertido_html)

    lista_no_html!.innerHTML += convertido_html;

    return convertido_html;
}

pegarPokemon(0,200);