import { useTurneViewModel } from "../features/Turne/hooks/useTurneViewModel";
import { TurnePageTemplate } from "../features/Turne/components/templates/TurnePageTemplate";

export function Turne() {
  const viewModel = useTurneViewModel();

  return <TurnePageTemplate {...viewModel} />;
}
