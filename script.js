const products = [
            { id: 1, name: "SPIDER Oversize", price: 115.000, sizes: ["S", "M", "L",], image: "A.jpg" },
            { id: 2, name: "SQUEZE Oversize", price: 115.000, sizes: ["S", "M", "L"], image: "B.jpg" },
            { id: 3, name: "DINOSAURUS Oversize", price: 115.000, sizes: ["S", "M", "L",], image: "C.jpg" },
            { id: 4, name: "SNAKE Oversize", price: 115.000, sizes: ["S", "M", "L",], image: "D.jpg" },
            { id: 5, name: "HUMANITY Oversize", price: 115.000, sizes: ["S", "M", "L",], image: "E.jpg" },
            { id: 6, name: "SKELETON Oversize", price: 115.000, sizes: ["S", "M", "L"], image: "F.jpg" },
            { id: 7, name: "Bone Oversize", price: 115.000, sizes: ["S", "M", "L"], image: "G.jpg" },
            { id: 8, name: "HOURSE Oversize", price: 115.000, sizes: ["S", "M", "L"], image: "H.jpg" },
        ];

        let cart = [];

        function renderProducts() {
            const productGrid = document.getElementById('productGrid');
            productGrid.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-price">Rp${product.price.toFixed(3)}</p>
                        <div class="product-size">
                            <select id="size-${product.id}">
                                <option value="">Select size</option>
                                ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', addToCart);
            });
        }

        function addToCart(event) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            const sizeSelect = document.getElementById(`size-${productId}`);
            const selectedSize = sizeSelect.value;

            if (!selectedSize) {
                alert('Please select a size');
                return;
            }

            const existingItem = cart.find(item => item.id === productId && item.selectedSize === selectedSize);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1, selectedSize });
            }

            updateCartButton();
            event.target.classList.add('added');
            event.target.textContent = 'Added!';
            setTimeout(() => {
                event.target.classList.remove('added');
                event.target.textContent = 'Add to Cart';
            }, 1000);
        }

        function updateCartButton() {
            const cartButton = document.getElementById('cartButton');
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartButton.textContent = `Cart (${totalItems})`;
        }

        function renderCart() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');

            if (cart.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty</p>';
                cartTotal.textContent = 'Total: Rp 0';
                return;
            }

            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h3>${item.name}</h3>
                        <p>Size: ${item.selectedSize}, Quantity: ${item.quantity}</p>
                    </div>
                    <div>
                        <p>Rp${(item.price * item.quantity).toFixed(3)}</p>
                        <button class="remove-item" data-id="${item.id}" data-size="${item.selectedSize}">❌</button>
                    </div>
                </div>
            `).join('');

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartTotal.textContent = `Total: Rp${total.toFixed(3)}`;

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', removeFromCart);
            });
        }

        function removeFromCart(event) {
            const productId = parseInt(event.target.getAttribute('data-id'));
            const productSize = event.target.getAttribute('data-size');
            cart = cart.filter(item => !(item.id === productId && item.selectedSize === productSize));
            updateCartButton();
            renderCart();
        }

        function sendOrderToWhatsApp() {
            const phoneNumber = "6287871420482"; // Country code followed by the phone number without spaces or symbols
            let message = "New order:\n\n";
            cart.forEach(item => {
                message += `${item.name} (Size: ${item.selectedSize}) - Quantity: ${item.quantity} - Price: Rp${(item.price * item.quantity).toFixed(3)}\n`;
            });
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            message += `\nTotal: Rp${total.toFixed(3)}`;
            const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
            window.open(whatsappUrl, '_blank');
        }

        document.addEventListener('DOMContentLoaded', () => {
            renderProducts();

            const cartButton = document.getElementById('cartButton');
            const cartModal = document.getElementById('cartModal');
            const closeCartButton = document.getElementById('closeCartButton');
            const orderButton = document.getElementById('orderButton');
            const ctaButton = document.getElementById('ctaButton');

            cartButton.addEventListener('click', () => {
                cartModal.style.display = 'flex';
                renderCart();
            });

            closeCartButton.addEventListener('click', () => {
                cartModal.style.display = 'none';
            });

            orderButton.addEventListener('click', sendOrderToWhatsApp);

            ctaButton.addEventListener('click', () => {
                document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
            });

            window.addEventListener('click', (event) => {
                if (event.target === cartModal) {
                    cartModal.style.display = 'none';
                }
            });
        });
