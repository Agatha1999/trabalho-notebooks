const notebooks = [
  {
    nome: "ASUS TUF A15 (RTX 2050, Ryzen 7)",
    imagem: "../img/asus.webp",
    descricao: "Notebook gamer com bom sistema de resfriamento, durável e com bom desempenho para jogos e edição de vídeo leve.",
    positivos: ["Boa construção (militar)", "Bom desempenho térmico", "Upgrade fácil"],
    negativos: ["Tela 60Hz em alguns modelos", "GPU de entrada (RTX 2050)"],
    perfil: "Gamers casuais, criadores de conteúdo iniciantes, multitarefa."
  },
  {
    nome: "Lenovo LOQ-E (RTX 3050, i5 12ª)",
    imagem: "../img/loq.avif",
    descricao: "Notebook gamer intermediário com GPU superior e bom custo-benefício.",
    positivos: ["GPU melhor (RTX 3050)", "Boa refrigeração", "Design discreto"],
    negativos: ["SSD de fábrica pequeno", "Tela apenas ok"],
    perfil: "Gamers e criadores de conteúdo que priorizam performance gráfica."
  },
  {
    nome: "Acer Aspire 5 (Ryzen 7 5700U, 16GB)",
    imagem: "../img/aspire.webp",
    descricao: "Notebook para produtividade com ótimo desempenho multitarefa e bom custo-benefício.",
    positivos: ["Boa autonomia de bateria", "Tela IPS em alguns modelos", "Desempenho consistente"],
    negativos: ["Sem GPU dedicada", "Construção simples"],
    perfil: "Estudantes, programadores, analistas de dados, tarefas de escritório."
  },
  {
    nome: "Lenovo IdeaPad Slim 3 (i5 13ª, IPS)",
    imagem: "../img/ideapad.avif",
    descricao: "Notebook com tela IPS, leve, expansível e com desempenho decente para trabalho e estudos.",
    positivos: ["Tela IPS", "Expansível", "Leve e portátil"],
    negativos: ["Refrigeração limitada", "Construção em plástico"],
    perfil: "Profissionais de escritório, estudantes, trabalho remoto."
  },
  {
    nome: "VAIO FE16",
    imagem: "../img/vaio.webp",
    descricao: "Modelo com construção elegante e bom desempenho para tarefas do dia a dia.",
    positivos: ["Tela Full HD grande", "Bom teclado", "Design sóbrio"],
    negativos: ["Pouca assistência técnica", "Preço acima da média"],
    perfil: "Usuários que prezam por conforto visual e uso casual."
  }
];

const container = document.getElementById("notebook-list");

notebooks.forEach(nb => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${nb.imagem}" alt="${nb.nome}" />
    <h2>${nb.nome}</h2>
    <p>${nb.descricao}</p>
    <p><strong>👍 Positivos:</strong> <span class="positivo">${nb.positivos.join(", ")}</span></p>
    <p><strong>👎 Negativos:</strong> <span class="negativo">${nb.negativos.join(", ")}</span></p>
    <p><strong>Perfil ideal:</strong> ${nb.perfil}</p>
  `;
  container.appendChild(card);
});
