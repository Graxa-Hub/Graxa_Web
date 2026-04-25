import { useCalendarioViewModel } from "../../hooks/useCalendarioViewModel";
import { CalendarioPageTemplate } from "../templates/CalendarioPageTemplate";

export const Calendario = () => {
  const viewModel = useCalendarioViewModel();

  return <CalendarioPageTemplate {...viewModel} />;
};
