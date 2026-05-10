import { HashRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout.tsx";
import { LocaleProvider } from "./lib/i18n.tsx";
import { ThemeProvider } from "./lib/theme.tsx";
import { Countries } from "./pages/Countries.tsx";
import { Examples } from "./pages/Examples.tsx";
import { Home } from "./pages/Home.tsx";
import { Playground } from "./pages/Playground.tsx";

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
            </Routes>
          </Layout>
        </HashRouter>
      </LocaleProvider>
    </ThemeProvider>
  );
}
