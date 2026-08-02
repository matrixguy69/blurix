// ===== PRODUCT DATA =====
// Swap the `icon` field for real product photos when you have them —
// just replace the emoji with an <img> tag inside renderProducts().
const PRODUCTS = [
  { id: 1, name: "Match Pro '26", cat: "football", price: 3200, icon: "⚽", tag: "Best Seller" },
  { id: 2, name: "Street Panel Ball", cat: "football", price: 1800, icon: "⚽", tag: "" },
  { id: 3, name: "Training Ball 5-Pack", cat: "football", price: 7500, icon: "⚽", tag: "" },
  { id: 4, name: "Mini Skill Ball", cat: "football", price: 1200, icon: "⚽", tag: "" },
  { id: 5, name: "Pro Sparring Gloves", cat: "boxing", price: 4500, icon: "🥊", tag: "New" },
  { id: 6, name: "Focus Pads (Pair)", cat: "boxing", price: 2800, icon: "🥊", tag: "" },
  { id: 7, name: "Heavy Bag Gloves", cat: "boxing", price: 3600, icon: "🥊", tag: "" },
  { id: 8, name: "Hand Wraps Set", cat: "boxing", price: 900, icon: "🥊", tag: "" },
  { id: 9, name: "Weighted Gym Gloves", cat: "gym", price: 2100, icon: "🏋️", tag: "" },
  { id: 10, name: "Resistance Band Set", cat: "gym", price: 1600, icon: "🏋️", tag: "" },
  { id: 11, name: "Leather Lifting Belt", cat: "gym", price: 3900, icon: "🏋️", tag: "" },
  { id: 12, name: "Adjustable Skipping Rope", cat: "gym", price: 950, icon: "🏋️", tag: "" },
  { id: 13, name: "Blurix Tech Tee", cat: "apparel", price: 2200, icon: "👕", tag: "New" },
  { id: 14, name: "Track Jacket", cat: "apparel", price: 4800, icon: "🧥", tag: "" },
  { id: 15, name: "Crew Socks 3-Pack", cat: "apparel", price: 1100, icon: "🧦", tag: "" },
  { id: 16, name: "Snapback Cap", cat: "apparel", price: 1700, icon: "🧢", tag: "" },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('blurix_cart') || '[]');
let activeCat = 'all';
let activeSort = 'featured';

function saveCart(){
  localStorage.setItem('blurix_cart', JSON.stringify(cart));
  updateCartUI();
}

// ===== RENDER PRODUCTS =====
function renderProducts(){
  const grid = document.getElementById('productGrid');
  let list = activeCat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);

  if(activeSort === 'low') list = [...list].sort((a,b)=>a.price-b.price);
  if(activeSort === 'high') list = [...list].sort((a,b)=>b.price-a.price);

  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-media">${p.icon}</div>
      <div class="product-cat">${p.cat}${p.tag ? ' · ' + p.tag : ''}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-bottom">
        <span class="product-price">PKR ${p.price.toLocaleString()}</span>
        <button class="add-btn" data-id="${p.id}" aria-label="Add ${p.name} to cart">+</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.add-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> addToCart(parseInt(btn.dataset.id)));
  });
}

// ===== FILTERS =====
document.getElementById('categoryFilters').addEventListener('click', e=>{
  const chip = e.target.closest('.chip');
  if(!chip) return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  activeCat = chip.dataset.cat;
  renderProducts();
});

document.getElementById('sortSelect').addEventListener('change', e=>{
  activeSort = e.target.value;
  renderProducts();
});

// ===== CART LOGIC =====
function addToCart(id){
  const product = PRODUCTS.find(p=>p.id===id);
  const existing = cart.find(i=>i.id===id);
  if(existing){ existing.qty++; }
  else { cart.push({ id, qty: 1 }); }
  saveCart();
  showToast(`${product.name} added to cart`);
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(i=>i.id!==id);
  saveCart();
}

function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart();
}

function cartTotal(){
  return cart.reduce((sum,item)=>{
    const p = PRODUCTS.find(pr=>pr.id===item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function updateCartUI(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartCount').textContent = count;

  const itemsEl = document.getElementById('cartItems');
  if(cart.length === 0){
    itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty. Go find something worth stitching together.</p>';
  } else {
    itemsEl.innerHTML = cart.map(item=>{
      const p = PRODUCTS.find(pr=>pr.id===item.id);
      if(!p) return '';
      return `
        <div class="cart-item">
          <div class="cart-item-icon">${p.icon}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">PKR ${(p.price*item.qty).toLocaleString()}</div>
            <div class="qty-control">
              <button data-action="dec" data-id="${p.id}">−</button>
              <span>${item.qty}</span>
              <button data-action="inc" data-id="${p.id}">+</button>
              <button class="remove-btn" data-action="remove" data-id="${p.id}">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    itemsEl.querySelectorAll('button[data-action]').forEach(btn=>{
      const id = parseInt(btn.dataset.id);
      const action = btn.dataset.action;
      btn.addEventListener('click', ()=>{
        if(action==='inc') changeQty(id, 1);
        if(action==='dec') changeQty(id, -1);
        if(action==='remove') removeItem(id);
      });
    });
  }

  const total = cartTotal();
  document.getElementById('cartSubtotal').textContent = `PKR ${total.toLocaleString()}`;
  document.getElementById('checkoutTotal').textContent = `PKR ${total.toLocaleString()}`;
}

// ===== CART DRAWER TOGGLE =====
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');

function openCart(){
  cartDrawer.classList.add('open');
  overlay.classList.add('show');
}
function closeCartFn(){
  cartDrawer.classList.remove('open');
  overlay.classList.remove('show');
}
document.getElementById('cartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCartFn);
overlay.addEventListener('click', ()=>{ closeCartFn(); closeCheckoutFn(); });

// ===== CHECKOUT MODAL =====
const checkoutOverlay = document.getElementById('checkoutOverlay');
function openCheckout(){
  if(cart.length === 0){ showToast("Your cart is empty"); return; }
  closeCartFn();
  document.getElementById('checkoutStep1').style.display = 'block';
  document.getElementById('checkoutStep2').style.display = 'none';
  checkoutOverlay.classList.add('show');
}
function closeCheckoutFn(){
  checkoutOverlay.classList.remove('show');
}
document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
document.getElementById('closeCheckout').addEventListener('click', closeCheckoutFn);

document.getElementById('checkoutForm').addEventListener('submit', e=>{
  e.preventDefault();
  // Demo only — no real payment processed. Wire up a real gateway here (JazzCash/Easypaisa API, Stripe, etc).
  document.getElementById('checkoutStep1').style.display = 'none';
  document.getElementById('checkoutStep2').style.display = 'block';
  cart = [];
  saveCart();
});

document.getElementById('continueShoppingBtn').addEventListener('click', closeCheckoutFn);

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-item').forEach(item=>{
  item.querySelector('.faq-q').addEventListener('click', ()=>{
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!wasOpen) item.classList.add('open');
  });
});

// ===== CONTACT FORM (demo submit) =====
document.getElementById('contactForm').addEventListener('submit', e=>{
  e.preventDefault();
  document.getElementById('contactNote').textContent = "Message sent — we'll reply within 24 hours.";
  e.target.reset();
  setTimeout(()=>{ document.getElementById('contactNote').textContent=''; }, 4000);
});

// ===== COOKIE BANNER =====
const cookieBanner = document.getElementById('cookieBanner');
if(!localStorage.getItem('blurix_cookie_choice')){
  setTimeout(()=> cookieBanner.classList.add('show'), 1200);
}
document.getElementById('cookieAccept').addEventListener('click', ()=>{
  localStorage.setItem('blurix_cookie_choice','accepted');
  cookieBanner.classList.remove('show');
});
document.getElementById('cookieDecline').addEventListener('click', ()=>{
  localStorage.setItem('blurix_cookie_choice','declined');
  cookieBanner.classList.remove('show');
});
document.getElementById('cookieLearnMore').addEventListener('click', e=>{
  e.preventDefault();
  showToast("Cookies keep your cart saved between visits. That's it — no tracking sold to third parties.");
});

// ===== TOAST =====
let toastTimeout;
function showToast(msg){
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(()=> toast.classList.remove('show'), 2600);
}

// ===== HERO CARD PARALLAX TILT =====
const heroCard = document.getElementById('heroCard');
if(heroCard && window.matchMedia('(min-width: 900px)').matches){
  document.querySelector('.hero').addEventListener('mousemove', e=>{
    const rect = document.querySelector('.hero').getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    heroCard.style.transform = `translateY(-50%) rotate(${6 + x*10}deg) translate(${x*14}px, ${y*14}px)`;
  });
}

// ===== NAV SCROLL SHADOW =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 20) nav.style.filter = 'drop-shadow(0 10px 30px rgba(0,0,0,0.35))';
  else nav.style.filter = 'none';
});

// ===== INIT =====
renderProducts();
updateCartUI();
