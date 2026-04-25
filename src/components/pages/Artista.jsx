import { useArtistaPageViewModelAtomic } from "../../hooks/useArtistaPageViewModelAtomic";
import { ArtistaPageTemplate } from "../templates/ArtistaPageTemplate";

export function Artista() {
  const viewModel = useArtistaPageViewModelAtomic();

  return <ArtistaPageTemplate {...viewModel} />;
}
