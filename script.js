// Carrinho de Compras
const cart = {
  items: [],
  
  add(product, price) {
    const existingItem = this.items.find(item => item.product === product);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, price, quantity: 1 });
    }
    this.save();
    this.updateUI();
  },
  
  remove(product) {
    this.items = this.items.filter(item => item.product !== product);
    this.save();
    this.updateUI();
  },
  
  updateQuantity(product, quantity) {
    const item = this.items.find(item => item.product === product);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
      this.updateUI();
    }
  },
  
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  },
  
  load() {
    const saved = localStorage.getItem('cart');
    this.items = saved ? JSON.parse(saved) : [];
  },
  
  getTotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  updateUI() {
    const count = this.items.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    this.renderCartItems();
    this.updateTotal();
  },
  
  renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    
    if (this.items.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio</p>';
      return;
    }
    
    cartItems.innerHTML = this.items.map((item, index) => `
      <div class="cart-item" style="animation: slideIn 0.3s ease-out;">
        <div class="cart-item-info">
          <h4>${item.product}</h4>
          <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="cart.updateQuantity('${item.product}', ${item.quantity - 1})">−</button>
          <input type="number" class="qty-input" value="${item.quantity}" 
            onchange="cart.updateQuantity('${item.product}', parseInt(this.value))">
          <button class="qty-btn" onclick="cart.updateQuantity('${item.product}', ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">
          R$ ${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="cart-item-remove" onclick="cart.remove('${item.product}')">
          ✕
        </button>
      </div>
    `).join('');
  },
  
  updateTotal() {
    const total = this.getTotal();
    document.getElementById('cartTotal').textContent = `R$ ${total.toFixed(2)}`;
  }
};

// Inicializar carrinho
document.addEventListener('DOMContentLoaded', function() {
  cart.load();
  cart.updateUI();
  
  // Botões de adicionar ao carrinho
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const product = this.dataset.product;
      const price = parseFloat(this.dataset.price);
      
      if (price === 0) {
        // Redirecionar para WhatsApp
        window.open('https://wa.me/message/W4JF637ON4FRA1', '_blank');
        return;
      }
      
      cart.add(product, price);
      
      // Animação de feedback
      this.classList.add('button-clicked');
      setTimeout(() => this.classList.remove('button-clicked'), 600);
      
      // Toast notification
      showNotification(`${product} adicionado ao carrinho!`);
    });
  });
  
  // Carrinho button
  document.getElementById('cartButton').addEventListener('click', toggleCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
});

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  
  if (sidebar.classList.contains('active')) {
    closeCart();
  } else {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('active');
  document.getElementById('cartOverlay').classList.remove('active');
}

// Notificação
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      const target = document.querySelector(href);
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Animações ao scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .category-item').forEach(el => {
  observer.observe(el);
});
