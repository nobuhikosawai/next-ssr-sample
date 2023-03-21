import axios from "axios";
import { GetServerSideProps } from "next";

type Props = {
  name: string;
  imageUrl: string;
};

export default function Home({ name, imageUrl }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <div className="p-4">
        <h2 className="text-xl">Pokemon</h2>

        <div>
          <p>name: {name}</p>
          <img src={imageUrl} />
        </div>
      </div>
    </div>
  );
}

type Response = {
  name: string;
  sprites: {
    back_default: string;
  };
};

export const getServerSideProps: GetServerSideProps<Props> = async() => {
  const { data } = await axios.get<Response>(
    `https://pokeapi.co/api/v2/pokemon/pikachu`
  );

  // Pass data to the page via props
  const _props: Props = {
    name: data.name,
    imageUrl: data.sprites.back_default,
  };
  return { props: _props };
}
