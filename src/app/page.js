import Image from "next/image";
import PatoImg from "../../public/assets/splash-pato.png";
import Button from "../components/Button.jsx";
import ThemeSwitch from "../components/ThemeSwitch";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-items-center gap-24 justify-center w-full h-screen transition-all duration-300">
      <ThemeSwitch style="fixed top-5 right-5 text-[var(--text)]" />
      <Image
        src={PatoImg}
        className="h-[200px] w-auto object-cover"
        alt="Pato"
        priority
      />
      <div className="flex flex-col items-center justify-items-center lg:mr-15">
        <h1 className="text-2xl font-bold text-center pb-[58px]">
          Já é parceiro do Jubileu?
        </h1>
        <Button
          buttonText="Fazer Login"
          buttonStyle="mb-[40px]"
          buttonLink="/login"
        ></Button>
        <Button buttonText="Cadastrar-se" buttonLink="/register"></Button>
      </div>
    </div>
  );
}
