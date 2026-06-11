import { HashRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout.tsx";
import { LocaleProvider } from "./lib/i18n.tsx";
import { ThemeProvider } from "./lib/theme.tsx";
import { Countries } from "./pages/Countries.tsx";
import { Examples } from "./pages/Examples.tsx";
import { Home } from "./pages/Home.tsx";
import { Mrz } from "./pages/Mrz.tsx";
import { Passports } from "./pages/Passports.tsx";
import { Playground } from "./pages/Playground.tsx";
import { React as ReactPage } from "./pages/React.tsx";

export function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/countries" element={<Countries />} />
              <Route path="/examples" element={<Examples />} />
              <Route path="/passports" element={<Passports />} />
              <Route path="/mrz" element={<Mrz />} />
              <Route path="/react" element={<ReactPage />} />
            </Routes>
          </Layout>
        </HashRouter>
      </LocaleProvider>
    </ThemeProvider>
  );
}
