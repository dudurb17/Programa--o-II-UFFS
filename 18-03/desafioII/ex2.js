// 2) Entrada e Saída de Data

// O seu professor gostaria de fazer um programa com as seguintes características:
// Leia uma data no formato DD/MM/AA;
// Imprima a data no formato MM/DD/AA;
// Imprima a data no formato AA/MM/DD;
// Imprima a data no formato DD-MM-AA.
// Entrada
// A entrada consiste vários arquivos de teste. Em cada arquivo de teste tem uma linha. A linha tem o seguinte formato DD/MM/AA onde DD, MM, AA são números inteiros. Conforme mostrado no exemplo de entrada a seguir.
// Saída
// Para cada arquivo da entrada, terá um arquivo de saída. O arquivo de saída tem três linhas conforme os procedimentos 2, 3 e 4. Conforme mostra o exemplo de saída a seguir.
// 2) Entrada e Saída de Data
//
// Lê DD/MM/AA e imprime MM/DD/AA, AA/MM/DD e DD-MM-AA (uma linha por formato).
const entrada = prompt("Informe a data no formato DD/MM/AA:").trim();
const partes = entrada.split("/");
const dd = partes[0];
const mm = partes[1];
const aa = partes[2];

alert(`${mm}/${dd}/${aa} \n${aa}/${mm}/${dd}\n${dd}-${mm}-${aa}`);
