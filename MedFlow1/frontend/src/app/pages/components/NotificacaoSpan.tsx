import React, { useEffect } from "react";

interface NotificacaoProps {
  mensagem: string;
  tipo?: "sucesso" | "erro"; // para definir cor
  onClose: () => void; // para fechar a notificação
}

export const Notificacao: React.FC<NotificacaoProps> = ({
  mensagem,
  tipo = "sucesso",
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // some após 4 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <span
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: tipo === "sucesso" ? "#4CAF50" : "#EF5350",
        color: "#fff",
        textAlign: "left",
        padding: "16px 24px",
        fontWeight: 500,
        zIndex: 1300,
        fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        borderBottom: "4px solid rgba(255,255,255,0.3)",
        transition: "transform 0.3s ease, opacity 0.3s ease",
        userSelect: "none",
        cursor: "default",
      }}
    >
      <span style={{ fontSize: "20px" }}>
        {tipo === "sucesso" ? "✔️" : "⚠️"}
      </span>
      <span>{mensagem}</span>
    </span>
  );
};
