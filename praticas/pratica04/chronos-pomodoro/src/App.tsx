import "./styles/theme.css";
import "./styles/globals.css";
import { Heading } from "./components/Heading";
import { Timer } from "lucide-react"; // Importando o ícone

export function App() {
  return (
    <>
      <Heading>
        Histórico
        <button>
          <Timer />
        </button>
      </Heading>
    </>
  );
}
