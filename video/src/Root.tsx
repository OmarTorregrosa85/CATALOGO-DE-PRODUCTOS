import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Golazo } from "./Golazo/Golazo";
import { FPS, golazoSchema, TOTAL as GOLAZO_TOTAL } from "./Golazo/constants";
import { Entrevista } from "./Entrevista/Entrevista";
import { entrevistaSchema, TOTAL as ENTREVISTA_TOTAL } from "./Entrevista/constants";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />
      <Composition
        // npx remotion render Golazo out/Golazo.mp4
        id="Golazo"
        component={Golazo}
        durationInFrames={GOLAZO_TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
        schema={golazoSchema}
        defaultProps={{
          playerName: "TORREGROSA",
          playerNumber: 10,
          homeTeam: "LEONES",
          awayTeam: "ÁGUILAS",
        }}
      />
      <Composition
        // npx remotion render Entrevista out/Entrevista.mp4
        id="Entrevista"
        component={Entrevista}
        durationInFrames={ENTREVISTA_TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
        schema={entrevistaSchema}
        defaultProps={{
          playerName: "TORREGROSA",
          playerNumber: 10,
          teamName: "ÁGUILAS",
          question: "¡Felicidades, campeón! ¿Cómo te sientes después del partido?",
          answer: [
            "¡Uf… todavía no me lo creo!",
            "Cuando vi la falta en el minuto 90, sentí que era mi momento.",
            "Le pegué con el corazón… ¡y entró por la escuadra!",
            "Este título es para mi familia y para toda nuestra afición.",
            "¡Somos campeones de Europa!",
          ],
        }}
      />
    </>
  );
};
