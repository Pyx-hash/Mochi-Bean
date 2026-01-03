  const products = [
    {
        id: 1,
        name: "Caramel Macchiato",
        description: "Rich espresso and vanilla and caramel drizzle.",
        price: 323,
        category: "coffee",
        image: "assets/images/carramel.avif"
    },
    {
        id: 2,
        name: "Matcha Latte",
        description: "Premium ceremonial grade matcha with oat milk.",
        price: 353,
        category: "coffee",
        image: "assets/images/Matcha-Latte.jpg"
    },
    {
        id: 3,
        name: "Strawberry Croissant",
        description: "Buttery pastry filled with fresh strawberry cream.",
        price: 250,
        category: "pastry",
        image: "assets/images/strawberry croissant.webp"
    },
    {
        id: 4,
        name: "Classic Cappuccino",
        description: "Double shot espresso with steamed milk foam.",
        price: 279,
        category: "coffee",
        image: "assets/images/capuccino-classic-1.jpg"
    },
    {
        id: 5,
        name: "Blueberry Muffin",
        description: "Soft, moist muffin bursting with blueberries.",
        price: 205,
        category: "pastry",
        image: "assets/images/blueberry muffin.jpg"
    },
    {
        id: 6,
        name: "Iced Americano",
        description: "Chilled espresso served over ice and water.",
        price: 235,
        category: "coffee",
        image: "assets/images/iced americano.webp"
    }
];
  let cart = JSON.parse(localStorage.getItem('coffeeShopCart')) || [];

        // --- 3. INITIALIZATION ---
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts('all');
            updateCartUI();
            
            // Filter functionality
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Remove active class from all
                    filterBtns.forEach(b => {
                        b.classList.remove('bg-coffee-500', 'text-white');
                        b.classList.add('bg-coffee-50', 'text-coffee-600');
                    });
                    // Add active class to clicked
                    e.target.classList.remove('bg-coffee-50', 'text-coffee-600');
                    e.target.classList.add('bg-coffee-500', 'text-white');
                    
                    renderProducts(e.target.dataset.category);
                });
            });
        });

        // --- 4. RENDER PRODUCTS ---
        function renderProducts(category) {
            const grid = document.getElementById('product-grid');
            grid.innerHTML = '';
            
            const filtered = category === 'all' 
                ? products 
                : products.filter(p => p.category === category);

            filtered.forEach(product => {
                const card = document.createElement('div');
                card.className = "bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-coffee-50 flex flex-col group";
                card.innerHTML = `
                    <div class="relative overflow-hidden rounded-2xl h-48 mb-4">
                        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                        <button onclick="addToCart(${product.id})" class="absolute bottom-3 right-3 bg-white p-3 rounded-full shadow-md hover:bg-coffee-500 hover:text-white text-coffee-600 transition-colors">
                            <i class="ph-bold ph-plus"></i>
                        </button>
                    </div>
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h3 class="font-bold text-lg text-coffee-900">${product.name}</h3>
                            <p class="text-sm text-coffee-400 line-clamp-2">${product.description}</p>
                        </div>
                        <span class="font-bold text-coffee-600 text-lg">$${product.price.toFixed(2)}</span>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

        // --- 5. CART LOGIC ---
        function addToCart(id) {
            const product = products.find(p => p.id === id);
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.qty++;
            } else {
                cart.push({ ...product, qty: 1 });
            }

            saveCart();
            updateCartUI();
            showToast(`Added ${product.name}`);
            
            // Auto open cart on first add (optional user experience choice)
            // toggleCart(true); 
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            saveCart();
            updateCartUI();
        }

        function changeQty(id, change) {
            const item = cart.find(i => i.id === id);
            if (item) {
                item.qty += change;
                if (item.qty <= 0) removeFromCart(id);
                else saveCart();
            }
            updateCartUI();
        }

        function saveCart() {
            localStorage.setItem('coffeeShopCart', JSON.stringify(cart));
        }

        function updateCartUI() {
            // Update badge
            const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
            const badge = document.getElementById('cart-count');
            badge.innerText = totalQty;
            
            if (totalQty > 0) {
                badge.classList.remove('scale-0');
            } else {
                badge.classList.add('scale-0');
            }

            // Update List
            const container = document.getElementById('cart-items-container');
            const emptyMsg = document.getElementById('empty-cart-msg');
            const totalEl = document.getElementById('cart-total');

            if (cart.length === 0) {
                container.innerHTML = '';
                container.appendChild(emptyMsg);
                emptyMsg.style.display = 'flex';
                totalEl.innerText = '$0.00';
                return;
            }

            emptyMsg.style.display = 'none';
            container.innerHTML = '';

            let totalPrice = 0;

            cart.forEach(item => {
                totalPrice += item.price * item.qty;
                const div = document.createElement('div');
                div.className = "flex items-center gap-4 bg-white p-2 rounded-xl border border-coffee-50";
                div.innerHTML = `
                    <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover">
                    <div class="flex-1">
                        <h4 class="font-bold text-coffee-800 text-sm">${item.name}</h4>
                        <div class="text-coffee-500 text-sm">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="flex items-center bg-coffee-50 rounded-lg">
                            <button onclick="changeQty(${item.id}, -1)" class="w-6 h-6 flex items-center justify-center text-coffee-600 hover:text-coffee-800">-</button>
                            <span class="text-xs font-bold w-4 text-center">${item.qty}</span>
                            <button onclick="changeQty(${item.id}, 1)" class="w-6 h-6 flex items-center justify-center text-coffee-600 hover:text-coffee-800">+</button>
                        </div>
                    </div>
                    <button onclick="removeFromCart(${item.id})" class="text-rose-400 hover:text-rose-600">
                        <i class="ph-fill ph-trash"></i>
                    </button>
                `;
                container.appendChild(div);
            });

            totalEl.innerText = '$' + totalPrice.toFixed(2);
        }

        // --- 6. UI INTERACTION ---
        function toggleCart(forceOpen = null) {
            const drawer = document.getElementById('cart-drawer');
            const overlay = document.getElementById('cart-overlay');
            const isOpen = !drawer.classList.contains('translate-x-full');
            
            if (forceOpen === true || (!isOpen && forceOpen === null)) {
                // Open
                drawer.classList.remove('translate-x-full');
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.remove('opacity-0'), 10); // fade in
            } else {
                // Close
                drawer.classList.add('translate-x-full');
                overlay.classList.add('opacity-0');
                setTimeout(() => overlay.classList.add('hidden'), 300); // wait for fade out
            }
        }

        function showToast(message) {
            const toast = document.getElementById('toast');
            const msgSpan = toast.querySelector('span');
            msgSpan.innerText = message;
            
            toast.classList.remove('translate-x-full', 'opacity-0');
            
            setTimeout(() => {
                toast.classList.add('translate-x-full', 'opacity-0');
            }, 3000);
        }

        function checkout() {
            if (cart.length === 0) {
                showToast("Your cart is empty!");
                return;
            }
            alert("Thank you for your order! ☕️\nThis is a demo template.");
            cart = [];
            saveCart();
            updateCartUI();
            toggleCart();
        }