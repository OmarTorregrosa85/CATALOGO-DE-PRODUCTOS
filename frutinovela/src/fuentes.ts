import { loadFont } from "@remotion/fonts";
import luckiest from "@fontsource/luckiest-guy/files/luckiest-guy-latin-400-normal.woff2";
import nunito800 from "@fontsource/nunito/files/nunito-latin-800-normal.woff2";
import nunito900 from "@fontsource/nunito/files/nunito-latin-900-normal.woff2";

// Fuentes empaquetadas localmente: el render funciona aunque no haya internet.
// (El subconjunto "latin" ya incluye á, é, í, ó, ú, ñ, ¿ y ¡.)
export const FUENTE_TITULO = "Luckiest Guy";
export const FUENTE_TEXTO = "Nunito";

loadFont({ family: FUENTE_TITULO, url: luckiest, weight: "400" });
loadFont({ family: FUENTE_TEXTO, url: nunito800, weight: "800" });
loadFont({ family: FUENTE_TEXTO, url: nunito900, weight: "900" });
