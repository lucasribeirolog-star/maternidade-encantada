import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Maternidade Encantada — Boneca Reborn em Sorocaba",
    short_name: "Maternidade Encantada",
    description:
      "Bonecas reborn feitas à mão em Sorocaba, com realismo e carinho, há 15 anos.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF6F1",
    theme_color: "#FDF6F1",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "1080x1080",
        type: "image/jpeg",
      },
    ],
  };
}
