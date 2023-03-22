import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useState } from "react";

type Pokemon = {
  name: string;
};

type Props = {
  pokemons: Pokemon[];
  next: string;
};

export default function Home({
  pokemons: _pokemons,
  next: _next,
  count: _count,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");

  const [pokemons, setPokemons] = useState<Pokemon[]>(_pokemons);
  const [next, setNext] = useState<string>(_next);

  async function handleGetMore() {
    const { data } = await axios.get<Response>(next);
    setPokemons([...pokemons, ...data.results]);
    setNext(data.next);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("pokemon")}</h1>
      <div className="p-4">
        <ul>
          {pokemons.map((pokemon) => {
            return (
              <li key={pokemon.name} className="underline">
                <Link href={`/pokemon/${pokemon.name}`}>{pokemon.name}</Link>
              </li>
            );
          })}
        </ul>

        <button onClick={handleGetMore}>More</button>
      </div>

      <div className="pt-4 lg:hidden">Your are on mobile</div>
    </div>
  );
}

type Result = {
  name: string;
};

type Response = {
  next: string;
  count: number;
  results: Result[];
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  locale,
}) => {
  const { data } = await axios.get<Response>(
    `https://pokeapi.co/api/v2/pokemon`
  );

  // Pass data to the page via props
  const _props: Props = {
    pokemons: data.results,
    next: data.next,
    ...(await serverSideTranslations(locale ?? "ja", ["common"])),
  };
  return { props: _props };
};
