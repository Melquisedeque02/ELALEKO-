import React, { useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation } from "react-router-dom";

// variável global para controlar a execução
let hasDownloadedOnce = false;

const QRDownload = () => {
  const location = useLocation();
  const qrRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const content = params.get("content");
    const filename = params.get("filename") || "qrcode";

    if (!content || hasDownloadedOnce) return;

    const downloadQR = () => {
      const canvas = qrRef.current?.querySelector("canvas");
      if (canvas) {
        // cria um novo canvas com resolução maior
        const scale = 1;
        const newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.width * scale;
        newCanvas.height = canvas.height * scale;
        const ctx = newCanvas.getContext("2d");

        // desenha o QR original em tamanho ampliado
        ctx.scale(scale, scale);
        ctx.drawImage(canvas, 0, 0);

        // faz o download da imagem em alta resolução
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = newCanvas.toDataURL("image/png", 1.0);
        link.click();

        hasDownloadedOnce = true;

        // fecha a aba após 1 segundo
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    };

    const timer = setTimeout(downloadQR, 500);
    return () => clearTimeout(timer);
  }, [location]);

  const params = new URLSearchParams(location.search);
  const content = params.get("content");

  if (!content) return <p>Nenhum conteúdo recebido para gerar QR Code.</p>;

  return (
    <div style={{ display: "none" }}>
      <div ref={qrRef}>
        <QRCodeCanvas value={content} size={300} includeMargin />
      </div>
    </div>
  );
};

export default QRDownload;
