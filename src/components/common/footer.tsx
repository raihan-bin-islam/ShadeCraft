import React from "react";

export const Footer = () => {
  return (
    <footer className="z-50 sticky bottom-0 backdrop-blur-2xl w-full flex items-center justify-center p-2.5 h-11 bg-foreground/3 border-t">
      <h2>
        Built by{" "}
        <a target="_blank" href="https://raihanbinislam.vercel.app/" className="text-primary">
          Raihan Bin Islam
        </a>
      </h2>
    </footer>
  );
};
