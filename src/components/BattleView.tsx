// src/components/BattleView.tsx
import React, { useEffect, useState } from 'react';
import { fetchRandomPokemon } from '../services/pokemonService';
import { Pokemon } from '../types/Pokemon';
import './BattleView.css';
import pokemonLogo from '../assets/images/pokemon-logo.png';  // Importa la imagen

const BattleView: React.FC = (): JSX.Element => {
    const [pokemonOne, setPokemonOne] = useState<Pokemon | null>(null);
    const [pokemonTwo, setPokemonTwo] = useState<Pokemon | null>(null);
    const [pokemonOneHP, setPokemonOneHP] = useState<number>(100);
    const [pokemonTwoHP, setPokemonTwoHP] = useState<number>(100);
    const [battleLog, setBattleLog] = useState<string[]>([]);
    const [turn, setTurn] = useState<number>(1);

    const loadPokemons = async () => {
        const firstPokemon = await fetchRandomPokemon();
        const secondPokemon = await fetchRandomPokemon();
        setPokemonOne(firstPokemon);
        setPokemonTwo(secondPokemon);
        setPokemonOneHP(firstPokemon.stats.find((stat) => stat.stat.name === 'hp')?.base_stat || 100);
        setPokemonTwoHP(secondPokemon.stats.find((stat) => stat.stat.name === 'hp')?.base_stat || 100);
        setBattleLog([]);
        setTurn(1);
    };

    useEffect(() => {
        loadPokemons();
    }, []);

    const getRandomMove = (pokemon: Pokemon) => {
        const randomIndex = Math.floor(Math.random() * pokemon.moves.length);
        return pokemon.moves[randomIndex];
    };

    const handleAttack = () => {
        if (!pokemonOne || !pokemonTwo) return;

        let attacker: Pokemon, defender: Pokemon;
        let setDefenderHP: React.Dispatch<React.SetStateAction<number>>;
        let defenderHP: number;

        if (turn === 1) {
            attacker = pokemonOne;
            defender = pokemonTwo;
            setDefenderHP = setPokemonTwoHP;
            defenderHP = pokemonTwoHP;
        } else {
            attacker = pokemonTwo;
            defender = pokemonOne;
            setDefenderHP = setPokemonOneHP;
            defenderHP = pokemonOneHP;
        }

        const attackMove = getRandomMove(attacker);
        const damage = attackMove ? Math.floor(Math.random() * 20) + 10 : 0;
        const newDefenderHP = defenderHP - damage;

        setDefenderHP(Math.max(newDefenderHP, 0));
        setBattleLog((prevLog) => [
            ...prevLog,
            `${attacker.name} used ${attackMove?.move.name || 'Basic Attack'}, causing ${damage} damage to ${defender.name}.`
        ]);

        setTurn(turn === 1 ? 2 : 1);
    };

    return (
        <div className="container">
            <img id="logo" src={pokemonLogo} alt="Pokemon Logo" />
            <h1 className="title">Pokémon Battle</h1>
            <div className="pokemon-container">
                {pokemonOne && (
                    <div className="pokemonOne">
                        <h2>{pokemonOne.name}</h2>
                        <h2>(HP: {pokemonOneHP})</h2>
                        <img src={pokemonOne.sprites.front_default} alt={pokemonOne.name} />
                    </div>
                )}
                {pokemonTwo && (
                    <div className="pokemonTwo">
                        <h2>{pokemonTwo.name}</h2>
                        <h2>(HP: {pokemonTwoHP})</h2>
                        <img src={pokemonTwo.sprites.front_default} alt={pokemonTwo.name} />
                    </div>
                )}
            </div>
            {pokemonOneHP > 0 && pokemonTwoHP > 0 ? (
                <button className="fight" onClick={handleAttack}>Fight!</button>
            ) : (
                <h2 className="textWin">{pokemonOneHP <= 0 ? pokemonTwo?.name : pokemonOne?.name} wins the battle!</h2>
            )}
            <div className="battle-log">
                <h3>Battle Log</h3>
                <ul>
                    {battleLog.map((log, index) => (
                        <li key={index}>{log}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BattleView;
