import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

type Pokemon = {
  name: string;
};

type Props = {
  pokemons: Pokemon[];
};

export default function Home({
  pokemons,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");

  return (
    <div>
      <h1 className="text-3xl font-bold">{t("pokemon")}</h1>
      <div className="p-4">
        <ul>
          {pokemons.map((pokemon) => {
            return <li key={pokemon.name}>{pokemon.name}</li>;
          })}
        </ul>
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
    ...(await serverSideTranslations(locale ?? "ja", ["common"])),
  };
  return { props: _props };
};
