const fs = require("fs");

// Função para remover números do início das linhas
const removeNumbers = (text) => {
  return text.replace(/^\d+\.\s+/gm, "");
};

// Caminho para o arquivo de entrada e saída
const inputFilePath = "maqs.txt";
const outputFilePath = "maqsNova.txt";

// Ler o arquivo
fs.readFile(inputFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo:", err);
    return;
  }

  // Processar o texto para remover os números
  const cleanedText = removeNumbers(data);

  // Escrever o texto processado em um novo arquivo
  fs.writeFile(outputFilePath, cleanedText, "utf8", (err) => {
    if (err) {
      console.error("Erro ao escrever o arquivo:", err);
      return;
    }

    console.log(`Arquivo processado com sucesso! Verifique`);
  });
});
