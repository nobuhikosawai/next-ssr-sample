import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Link from "next/link";

type Props = {
  name: string;
  imageUrl: string;
};

export default function Home({
  name,
  imageUrl,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { t } = useTranslation("common");

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div className="p-4">
        <h2 className="text-xl">{t("pokemon")}</h2>

        <div>
          <p>
            {t("name")}: {name}
          </p>
          <img src={imageUrl} />
        </div>
      </div>

      <div className="pt-4 lg:hidden">Your are on mobile</div>

      <Link href="/another_index">another_index</Link>
    </div>
  );
}

type Response = {
  name: string;
  sprites: {
    back_default: string;
  };
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  locale,
}) => {
  const { data } = await axios.get<Response>(
    `https://pokeapi.co/api/v2/pokemon/pikachu`
  );

  // Pass data to the page via props
  const _props: Props = {
    name: data.name,
    imageUrl: data.sprites.back_default,
    ...(await serverSideTranslations(locale ?? "ja", ["common"])),
  };
  return { props: _props };
};
