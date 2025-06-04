import { useState, useEffect } from "react";
import Image from "next/image";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    isVisible && (
      <div className="fixed top-0 left-0 w-full h-full bg-[var(--background)] flex flex-col justify-center items-center z-50 text-4xl font-bold animate-[pulse_0.75s_ease-in-out_infinite] gap-14">
        <h2 className="text-[22px] font-[700] pt-[30px] text-[var(--text)]">
          JubiTasks
        </h2>
        <Image src="/assets/gif-pato.gif" alt="Logo" width={200} height={200} />

        <span className="absolute bottom-8 text-center text-[var(--text)] text-base">
          Desenvolvido por CodeQuack
        </span>
      </div>
    )
  );
};

export default SplashScreen;