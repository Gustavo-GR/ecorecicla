// ========================================
// APLICAÇÃO ECORECICLA - JavaScript
// ========================================

// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api/trpc';

// ========================================
// ROTEAMENTO
// ========================================

const pages = {
  home: 'home',
  about: 'about',
  contact: 'contact',
  donate: 'donate',
  centers: 'centers'
};

function getCurrentPage() {
  const hash = window.location.hash.slice(1) || 'home';
  return hash.split('/')[0] || 'home';
}

function navigateTo(page) {
  window.location.hash = page;
}

function handleRouting() {
  const page = getCurrentPage();
  
  // Esconder todas as páginas
  Object.values(pages).forEach(p => {
    const element = document.getElementById(`page-${p}`);
    if (element) element.style.display = 'none';
  });
  
  // Mostrar página ativa
  const activePage = document.getElementById(`page-${page}`);
  if (activePage) {
    activePage.style.display = 'block';
  } else {
    document.getElementById('page-home').style.display = 'block';
  }
  
  // Atualizar navegação ativa
  document.querySelectorAll('nav a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href').slice(1);
    if (href === page) {
      link.classList.add('active');
    }
  });
  
  // Scroll para o topo
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);

// ========================================
// VALIDAÇÃO DE FORMULÁRIOS
// ========================================

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.add('error');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.remove('error');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.textContent = '';
    }
  }
}

function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.innerHTML = `
    <span>${message}</span>
  `;
  
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.insertBefore(alertDiv, mainElement.firstChild);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}

// ========================================
// FORMULÁRIO DE CONTATO
// ========================================

async function handleContactSubmit(e) {
  e.preventDefault();
  
  const nome = document.getElementById('contact-nome').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const telefone = document.getElementById('contact-telefone').value.trim();
  const mensagem = document.getElementById('contact-mensagem').value.trim();
  
  // Validação
  let isValid = true;
  
  if (!nome) {
    showError('contact-nome', 'Nome é obrigatório');
    isValid = false;
  } else {
    clearError('contact-nome');
  }
  
  if (!email) {
    showError('contact-email', 'Email é obrigatório');
    isValid = false;
  } else if (!validateEmail(email)) {
    showError('contact-email', 'Email inválido');
    isValid = false;
  } else {
    clearError('contact-email');
  }
  
  if (!mensagem) {
    showError('contact-mensagem', 'Mensagem é obrigatória');
    isValid = false;
  } else {
    clearError('contact-mensagem');
  }
  
  if (!isValid) return;
  
  // Desabilitar botão
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  
  try {
    const response = await fetch(`${API_BASE_URL}/contact.submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome,
        email,
        telefone: telefone || undefined,
        mensagem
      })
    });
    
    if (response.ok) {
      showAlert('Mensagem enviada com sucesso!', 'success');
      e.target.reset();
    } else {
      showAlert('Erro ao enviar mensagem', 'error');
    }
  } catch (error) {
    console.error('Erro:', error);
    showAlert('Erro ao enviar mensagem', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Mensagem';
  }
}

// ========================================
// FORMULÁRIO DE DOAÇÃO
// ========================================

async function handleDonationSubmit(e) {
  e.preventDefault();
  
  const donorName = document.getElementById('donate-name').value.trim();
  const donorEmail = document.getElementById('donate-email').value.trim();
  const donorPhone = document.getElementById('donate-phone').value.trim();
  const itemType = document.getElementById('donate-type').value;
  const quantity = document.getElementById('donate-quantity').value.trim();
  const pickup = document.getElementById('donate-pickup').checked;
  const address = document.getElementById('donate-address').value.trim();
  
  // Validação
  let isValid = true;
  
  if (!donorName) {
    showError('donate-name', 'Nome é obrigatório');
    isValid = false;
  } else {
    clearError('donate-name');
  }
  
  if (!donorEmail) {
    showError('donate-email', 'Email é obrigatório');
    isValid = false;
  } else if (!validateEmail(donorEmail)) {
    showError('donate-email', 'Email inválido');
    isValid = false;
  } else {
    clearError('donate-email');
  }
  
  if (!itemType) {
    showError('donate-type', 'Tipo de item é obrigatório');
    isValid = false;
  } else {
    clearError('donate-type');
  }
  
  if (!quantity) {
    showError('donate-quantity', 'Quantidade é obrigatória');
    isValid = false;
  } else {
    clearError('donate-quantity');
  }
  
  if (pickup && !address) {
    showError('donate-address', 'Endereço é obrigatório quando a coleta é solicitada');
    isValid = false;
  } else {
    clearError('donate-address');
  }
  
  if (!isValid) return;
  
  // Desabilitar botão
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registrando Doação...';
  
  try {
    const response = await fetch(`${API_BASE_URL}/donation.submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        donorName,
        donorEmail,
        donorPhone: donorPhone || undefined,
        itemType,
        quantity,
        pickup,
        address: address || undefined
      })
    });
    
    if (response.ok) {
      showAlert('Doação registrada com sucesso! Obrigado pela contribuição!', 'success');
      e.target.reset();
    } else {
      showAlert('Erro ao registrar doação', 'error');
    }
  } catch (error) {
    console.error('Erro:', error);
    showAlert('Erro ao registrar doação', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Registrar Doação';
  }
}

// ========================================
// MAPA E CENTROS DE DOAÇÃO
// ========================================

let map = null;
let markers = [];

async function loadDonationCenters(type = '') {
  try {
    const response = await fetch(`${API_BASE_URL}/donationCenters.list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: type || undefined })
    });
    
    if (response.ok) {
      const data = await response.json();
      const centers = data.result?.data || [];
      
      // Limpar marcadores anteriores
      markers.forEach(marker => map.removeLayer(marker));
      markers = [];
      
      // Adicionar novos marcadores
      centers.forEach(center => {
        if (center.lat && center.lng) {
          const marker = L.marker([parseFloat(center.lat), parseFloat(center.lng)])
            .addTo(map)
            .bindPopup(`
              <div style="padding: 10px;">
                <h4 style="margin: 0 0 5px 0; color: #15803d;">${center.name}</h4>
                <p style="margin: 0 0 5px 0; font-size: 0.9rem;">${center.address || 'Endereço não informado'}</p>
                ${center.types ? `<p style="margin: 0; font-size: 0.85rem; color: #16a34a;">${center.types.join(', ')}</p>` : ''}
              </div>
            `);
          markers.push(marker);
        }
      });
      
      // Renderizar lista de centros
      renderCentersList(centers);
    }
  } catch (error) {
    console.error('Erro ao carregar centros:', error);
    showAlert('Erro ao carregar centros de doação', 'error');
  }
}

function renderCentersList(centers) {
  const listContainer = document.getElementById('centers-list');
  if (!listContainer) return;
  
  if (centers.length === 0) {
    listContainer.innerHTML = `
      <div class="alert alert-info">
        <span>Nenhum centro de doação encontrado para o filtro selecionado.</span>
      </div>
    `;
    return;
  }
  
  listContainer.innerHTML = centers.map(center => `
    <div class="center-card">
      <h4>${center.name}</h4>
      ${center.address ? `
        <div class="center-info">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <p>${center.address}</p>
        </div>
      ` : ''}
      ${center.types && center.types.length > 0 ? `
        <div style="margin-top: 1rem;">
          ${center.types.map(type => `<span class="type-badge">${type}</span>`).join('')}
        </div>
      ` : ''}
      <div class="center-info" style="margin-top: 1rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <p>Seg-Sex: 8h-18h | Sab: 8h-13h</p>
      </div>
      <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="window.open('https://www.google.com/maps/search/${center.lat},${center.lng}', '_blank')">
        Ver no Mapa
      </button>
    </div>
  `).join('');
}

function initializeMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;
  
  // Verificar se Leaflet está disponível
  if (typeof L === 'undefined') {
    console.error('Leaflet não está carregado');
    mapContainer.innerHTML = '<div class="alert alert-info">Mapa não disponível. Consulte a lista de centros abaixo.</div>';
    return;
  }
  
  try {
    map = L.map('map').setView([-23.5505, -46.6333], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    
    // Carregar centros de doação
    loadDonationCenters();
  } catch (error) {
    console.error('Erro ao inicializar mapa:', error);
    mapContainer.innerHTML = '<div class="alert alert-info">Mapa não disponível. Consulte a lista de centros abaixo.</div>';
  }
}

// Filtro de centros
function handleCenterFilter(type) {
  if (map) {
    loadDonationCenters(type);
  }
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar roteamento
  handleRouting();
  
  // Adicionar listeners aos formulários
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  
  const donateForm = document.getElementById('donate-form');
  if (donateForm) {
    donateForm.addEventListener('submit', handleDonationSubmit);
  }
  
  // Mostrar/esconder campo de endereço na doação
  const pickupCheckbox = document.getElementById('donate-pickup');
  const addressGroup = document.getElementById('address-group');
  if (pickupCheckbox && addressGroup) {
    pickupCheckbox.addEventListener('change', (e) => {
      addressGroup.style.display = e.target.checked ? 'block' : 'none';
    });
  }
  
  // Inicializar mapa quando a página de centros for carregada
  const centersPage = document.getElementById('page-centers');
  if (centersPage) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.style.display !== 'none' && !map) {
          initializeMap();
        }
      });
    });
    
    observer.observe(centersPage, { attributes: true, attributeFilter: ['style'] });
  }
});
