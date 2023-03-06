import { TopBar } from "./components/TopBar";
import { Content } from "./components/Content";

document.documentElement.setAttribute("data-theme", "light");

function App() {
  return (
    <>
      <TopBar />
      <Content />
    </>
  );
}

export default App;
