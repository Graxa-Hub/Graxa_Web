import { useTurneViewModel } from "../../hooks/useTurneViewModel";
import { TurnePageTemplate } from "../templates/TurnePageTemplate";

export function Turne() {
  const viewModel = useTurneViewModel();

  return <TurnePageTemplate {...viewModel} />;
}
