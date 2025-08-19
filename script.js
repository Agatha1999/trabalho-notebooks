document.addEventListener('DOMContentLoaded', () => {
  // Simula um loading enquanto os dados são carregados
  const container = document.getElementById('notebooks-container');
  container.innerHTML = '<div class="no-results">Carregando...</div>';

  // Carrega os dados
  fetch('./data/notebooks.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na rede');
      }
      return response.json();
    })
    .then(data => {
      window.notebooksData = data; // Store globally for filtering/sorting/comparison
      setupUI(data);
      exibirNotebooks(data);
    })
    .catch(error => {
      console.error("Erro ao carregar dados:", error);
      container.innerHTML = `
        <div class="no-results">
          <p>Ocorreu um erro ao carregar os dados.</p>
          <p>Por favor, tente recarregar a página.</p>
        </div>
      `;
    });
});

function setupUI(notebooks) {
  setupDynamicFilterOptions(notebooks);
  setupFiltro(notebooks);
  setupSort(notebooks);
  setupBudgetFilter(notebooks);
  setupComparison();
}

function setupDynamicFilterOptions(notebooks) {
  const selectPerfil = document.getElementById('perfil');
  // Get unique profiles from notebooks
  const profilesSet = new Set();
  notebooks.forEach(nb => {
    nb.perfil.forEach(p => profilesSet.add(p));
  });
  const profiles = Array.from(profilesSet).sort();

  // Clear existing options
  selectPerfil.innerHTML = '';

  // Add "Todos os modelos" option
  const allOption = document.createElement('option');
  allOption.value = 'todos';
  allOption.textContent = 'TODOS OS MODELOS';
  selectPerfil.appendChild(allOption);

  // Add options dynamically
  profiles.forEach(profile => {
    const option = document.createElement('option');
    option.value = profile;
    option.textContent = profile.toUpperCase();
    selectPerfil.appendChild(option);
  });
}

function exibirNotebooks(notebooks, filtro = 'todos', sort = 'default', budget = 6000, selectedForCompare = []) {
  const container = document.getElementById('notebooks-container');
  
  // Filtra os notebooks por perfil
  let notebooksFiltrados = filtro === 'todos' 
    ? notebooks 
    : notebooks.filter(nb => nb.perfil.includes(filtro));

  // Filtra por orçamento
  notebooksFiltrados = notebooksFiltrados.filter(nb => nb.preco <= budget);

  // Ordena os notebooks
  switch(sort) {
    case 'preco-asc':
      notebooksFiltrados.sort((a, b) => a.preco - b.preco);
      break;
    case 'preco-desc':
      notebooksFiltrados.sort((a, b) => b.preco - a.preco);
      break;
    case 'nome-asc':
      notebooksFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
      break;
    case 'nome-desc':
      notebooksFiltrados.sort((a, b) => b.nome.localeCompare(a.nome));
      break;
    default:
      // No sorting
      break;
  }

  // Se não houver resultados
  if (notebooksFiltrados.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <p>Nenhum notebook encontrado para o filtro selecionado.</p>
        <p>Tente alterar os critérios de busca.</p>
      </div>
    `;
    return;
  }

  // Limpa o container
  container.innerHTML = '';

  // Adiciona os cards
  notebooksFiltrados.forEach(nb => {
    const isChecked = selectedForCompare.includes(nb.nome) ? 'checked' : '';
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <input type="checkbox" class="compare-checkbox" data-name="${nb.nome}" ${isChecked} title="Selecionar para comparar" />
      <img src="${nb.imagem}" alt="${nb.nome}" loading="lazy" class="card-image" />
      <div class="card-header">
        <h2>${nb.nome}</h2>
        <p class="price">R$ ${nb.preco.toLocaleString('pt-BR')}</p>
        <div class="perfil">${nb.perfil.join(" • ").toUpperCase()}</div>
      </div>
      <div class="card-details hidden">
        <p><strong>Descrição:</strong> ${nb.descricao}</p>
        
        <div class="especificacoes">
          <p><strong>Processador:</strong> ${nb.especificacoes.processador}</p>
          <p><strong>RAM:</strong> ${nb.especificacoes.ram}</p>
          <p><strong>Armazenamento:</strong> ${nb.especificacoes.ssd}</p>
          <p><strong>Tela:</strong> ${nb.especificacoes.tela}</p>
          <p><strong>GPU:</strong> ${nb.especificacoes.gpu}</p>
        </div>
        
        <p><strong class="positivo">Pontos fortes:</strong> ${nb.positivos.join(" • ")}</p>
        <p><strong class="negativo">Limitações:</strong> ${nb.negativos.join(" • ")}</p>
      </div>
    `;
    container.appendChild(card);
  });

  // Remove previous toggle event listeners and implement new expand/collapse behavior
  let expandedCard = null;

  // Remove any existing event listener to avoid duplicates
  container.replaceWith(container.cloneNode(true));
  const newContainer = document.getElementById('notebooks-container');

  newContainer.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;

    const details = card.querySelector('.card-details');
    if (!details) return;

    const isHidden = details.classList.contains('hidden');

    if (expandedCard && expandedCard !== card) {
      // Collapse previously expanded card
      const prevDetails = expandedCard.querySelector('.card-details');
      if (prevDetails) {
        prevDetails.classList.add('hidden');
      }
      expandedCard.classList.remove('expanded');
    }

    if (isHidden) {
      details.classList.remove('hidden');
      card.classList.add('expanded');
      expandedCard = card;
    } else {
      details.classList.add('hidden');
      card.classList.remove('expanded');
      expandedCard = null;
    }
  });

  // Collapse all cards when clicking outside
  document.addEventListener('click', (event) => {
    if (expandedCard) {
      if (!expandedCard.contains(event.target)) {
        const details = expandedCard.querySelector('.card-details');
        if (details) {
          details.classList.add('hidden');
        }
        expandedCard.classList.remove('expanded');
        expandedCard = null;
      }
    }
  });

  // Setup checkbox event listeners
  const checkboxes = container.querySelectorAll('.compare-checkbox');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const name = cb.getAttribute('data-name');
      if (cb.checked) {
        if (!selectedForCompare.includes(name)) {
          selectedForCompare.push(name);
        }
      } else {
        const index = selectedForCompare.indexOf(name);
        if (index > -1) {
          selectedForCompare.splice(index, 1);
        }
      }
      window.selectedForCompare = selectedForCompare;
      updateCompareButton();
    });
  });
}

function setupFiltro(notebooks) {
  const selectPerfil = document.getElementById('perfil');
  selectPerfil.addEventListener('change', () => {
    applyFilters();
  });
}

function setupSort(notebooks) {
  const selectSort = document.getElementById('sort');
  selectSort.addEventListener('change', () => {
    applyFilters();
  });
}

function setupBudgetFilter(notebooks) {
  const budgetInput = document.getElementById('budget');
  const budgetValue = document.getElementById('budget-value');
  budgetInput.addEventListener('input', () => {
    budgetValue.textContent = `Até R$ ${parseInt(budgetInput.value).toLocaleString('pt-BR')}`;
    applyFilters();
  });
}

function applyFilters() {
  const filtro = document.getElementById('perfil').value;
  const sort = document.getElementById('sort').value;
  const budget = parseInt(document.getElementById('budget').value);
  const selectedForCompare = window.selectedForCompare || [];
  exibirNotebooks(window.notebooksData, filtro, sort, budget, selectedForCompare);
}

function setupComparison() {
  // Add compare button below filters
  const filtroDiv = document.querySelector('.filtro');
  const compareBtn = document.createElement('button');
  compareBtn.id = 'compare-btn';
  compareBtn.textContent = 'Comparar selecionados';
  compareBtn.disabled = true;
  compareBtn.style.marginLeft = '1rem';
  filtroDiv.appendChild(compareBtn);

  compareBtn.addEventListener('click', () => {
    const selectedForCompare = window.selectedForCompare || [];
    if (selectedForCompare.length < 2) {
      alert('Selecione pelo menos dois notebooks para comparar.');
      return;
    }
    showComparisonModal(selectedForCompare);
  });
}

function showComparisonModal(selectedNames) {
  const notebooks = window.notebooksData.filter(nb => selectedNames.includes(nb.nome));
  // Create modal container
  let modal = document.getElementById('comparison-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'comparison-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }
  // Build comparison table
  let html = `
    <div class="modal-content">
      <h2>Comparação de Notebooks</h2>
      <button id="close-modal">Fechar</button>
      <table>
        <thead>
          <tr>
            <th>Especificação</th>
  `;
  selectedNames.forEach(name => {
    html += `<th>${name}</th>`;
  });
  html += `</tr></thead><tbody>`;

  const specs = ['processador', 'ram', 'ssd', 'tela', 'gpu', 'sistema'];
  specs.forEach(spec => {
    html += `<tr><td><strong>${spec.charAt(0).toUpperCase() + spec.slice(1)}</strong></td>`;
    notebooks.forEach(nb => {
      html += `<td>${nb.especificacoes[spec]}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;

  modal.innerHTML = html;

  // Close modal event
  document.getElementById('close-modal').addEventListener('click', () => {
    modal.remove();
  });
}

function updateCompareButton() {
  const compareBtn = document.getElementById('compare-btn');
  const selectedForCompare = window.selectedForCompare || [];
  compareBtn.disabled = selectedForCompare.length < 2;
}
