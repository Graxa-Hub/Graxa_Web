import { useCalendarioViewModel } from "../../features/Calendario/hooks/useCalendarioViewModel";
import { CalendarioPageTemplate } from "../templates/CalendarioPageTemplate";

export const Calendario = () => {
  const viewModel = useCalendarioViewModel();

  return <CalendarioPageTemplate {...viewModel} />;
};
