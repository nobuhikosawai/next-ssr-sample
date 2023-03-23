import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useState } from "react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";

type Pokemon = {
  name: string;
};

type Props = {
  pokemons: Pokemon[];
  next: string;
};

async function getPokemons() {
  const { data } = await axios.get<Response>(
    `https://pokeapi.co/api/v2/pokemon`
  );
  return {
    pokemons: data.results,
    next: data.next,
  };
}

export default function Home({
  pokemons: _pokemons,
  next: _next,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");

  const { data, isLoading } = useQuery(["pokemons"], getPokemons, {
    staleTime: Infinity,
  });

  // const [pokemons, setPokemons] = useState<Pokemon[]>(_pokemons);
  // const [next, setNext] = useState<string>(_next);
  //
  async function handleGetMore() {
    // const { data } = await axios.get<Response>(next);
    // setPokemons([...pokemons, ...data.results]);
    // setNext(data.next);
  }

  if (!data || isLoading) return <div>loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("pokemon")}</h1>
      <div className="p-4">
        <ul>
          {data.pokemons.map((pokemon) => {
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["pokemons"], getPokemons);

  const _props = {
    dehydratedState: dehydrate(queryClient),
    ...(await serverSideTranslations(locale ?? "ja", ["common"])),
  };
  return { props: _props };
};
