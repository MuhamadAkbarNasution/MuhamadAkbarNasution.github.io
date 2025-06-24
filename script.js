document.addEventListener('DOMContentLoaded', () => {
    // Dummy Data Produk
    const products = [
        {
            id: 'baju-001',
            name: 'Skeleton',
            image: 'Skeleton.jpg', // Pastikan gambar ini ada di folder Anda
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'putih',
            stock: { 'XS': 10, 'S': 15, 'M': 20, 'L': 12, 'XL': 5 } // Simulated stock levels
        },
        {
            id: 'baju-002',
            name: 'Dog and éclipse',
            image: 'Dog.jpg', // Pastikan gambar ini ada di folder Anda
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS','S', 'M', 'L', 'XL'],
            color: 'hitam',
            stock: { 'XS': 5, 'S': 8, 'M': 10, 'L': 7, 'XL': 3 }
        },
        {
            id: 'baju-003',
            name: 'Travis Scoot',
            image: 'Travis scoot.jpg', // Pastikan gambar ini ada di folder Anda
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam',
            stock: { 'XS': 3, 'S': 6, 'M': 8, 'L': 5, 'XL': 2 }
        },
        {
            id: 'baju-004',
            name: 'Person',
            image: 'Person.jpg', // Pastikan gambar ini ada di folder Anda
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam',
            stock: { 'XS': 7, 'S': 12, 'M': 15, 'L': 10, 'XL': 4 }
        },
        // Tambahkan produk lain sesuai kebutuhan Anda
    ];

    // --- INFORMASI PENJUAL ---
    const sellerInfo = {
        name: "Luxuliver Official",
        address: "Srengseng Sawah, Kel. Srengseng Sawah, Kec. Jagakarsa, Kota Jakarta Selatan, DKI Jakarta, 12640",
        phone: "+62 852-1819-7546", // Nomor telepon untuk ditampilkan
        email: "info@luxuliver.com",
        instagram: "https://www.instagram.com/luxuliver", // Link Ig
        whatsappAdmin: "6287871420482" // Nomor WhatsApp admin untuk order (tanpa + dan spasi)
    };
    // --- AKHIR INFORMASI PENJUAL ---

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let orderCounter = parseInt(localStorage.getItem('orderCounter')) || 1000;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || []; 

    // DOM Elements
    const body = document.body;
    const productList = document.getElementById('product-list');
    const blackClothingList = document.getElementById('black-clothing-list');
    const whiteClothingList = document.getElementById('white-clothing-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const subtotalPriceSpan = document.getElementById('subtotal-price');
    const discountAmountSpan = document.getElementById('discount-amount');
    const totalPriceSpan = document.getElementById('total-price');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const noResultsMessage = document.getElementById('no-results-message');
    const noBlackClothingMessage = document.getElementById('no-black-clothing');
    const noWhiteClothingMessage = document.getElementById('no-white-clothing');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutFormContainer = document.getElementById('checkout-form-container');
    const checkoutForm = document.getElementById('checkout-form');
    const currentYearSpan = document.getElementById('current-year');

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    const backToTopButton = document.getElementById('back-to-top');

    // Quick View Modal Elements
    const quickViewModal = document.getElementById('quick-view-modal');
    const closeModalButton = quickViewModal.querySelector('.close-button');
    const modalBody = quickViewModal.querySelector('.modal-body');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    const modalSizeOptions = document.getElementById('modal-size-options');
    const modalStockInfo = document.getElementById('modal-stock-info'); // NEW: Stock info element

    // Footer contact info elements
    const sellerAddressSpan = document.getElementById('seller-address');
    const sellerPhoneSpan = document.getElementById('seller-phone');
    const sellerEmailSpan = document.getElementById('seller-email');

    // Favorit DOM Elements
    const favoriteCountSpan = document.getElementById('favorite-count');
    const favoriteProductsList = document.getElementById('favorite-products-list');
    const emptyFavoritesMessage = document.getElementById('empty-favorites-message');

    // Metode Ekspedisi DOM Element
    const expeditionMethodSelect = document.getElementById('expedition-method');

    // NEW: Elemen untuk Confirmation Modal
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');

    // NEW: Elemen untuk Toast/Snackbar Container (akan dibuat dan ditambahkan ke body)
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    // --- Fungsi Bantuan ---
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const getPriceBySize = (basePrice, size) => {
        if (size && size.toUpperCase() === 'XL') {
            return basePrice + 5000; // Contoh: Harga +5000 untuk ukuran XL
        }
        return basePrice;
    };

    // NEW: Fungsi untuk menampilkan Toast/Snackbar Notification
    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.classList.add('toast-notification', type); // Tambahkan kelas 'info', 'success', 'error', 'warning'
        toast.textContent = message;
        toastContainer.appendChild(toast);

        // Paksa reflow untuk animasi (penting untuk CSS transition)
        void toast.offsetWidth; 
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            // Hapus toast dari DOM setelah animasi selesai
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000); // Notifikasi akan hilang setelah 3 detik
    };

    // NEW: Fungsi untuk Validasi Form Checkout (Reusable)
    const validateField = (inputElement) => {
        const value = inputElement.value.trim();
        const feedbackElement = inputElement.nextElementSibling; // Get the .invalid-feedback div

        let isValid = true;
        let errorMessage = '';

        if (inputElement.hasAttribute('required') && value === '') {
            isValid = false;
            errorMessage = 'Bidang ini wajib diisi.';
        } else if (inputElement.type === 'tel') {
            const phoneRegex = /^[0-9]{10,15}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Nomor WhatsApp tidak valid (10-15 digit angka).';
            }
        } else if (inputElement.tagName === 'SELECT' && value === '') {
            isValid = false;
            errorMessage = 'Harap pilih salah satu opsi.';
        }

        if (isValid) {
            inputElement.classList.remove('is-invalid');
            inputElement.classList.add('is-valid');
            if (feedbackElement) feedbackElement.classList.remove('show');
        } else {
            inputElement.classList.add('is-invalid');
            inputElement.classList.remove('is-valid');
            if (feedbackElement) {
                feedbackElement.textContent = errorMessage;
                feedbackElement.classList.add('show');
            }
        }
        return isValid;
    };

    // NEW: Add event listeners for instant validation on input change and blur
    checkoutForm.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });


    // --- Render Skeleton Loader ---
    const renderSkeletonLoaders = (containerElement, count) => {
        containerElement.innerHTML = ''; // Clear existing content
        for (let i = 0; i < count; i++) {
            const skeletonCard = document.createElement('div');
            skeletonCard.classList.add('skeleton-card');
            skeletonCard.innerHTML = `
                <div class="skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton-text skeleton-text-lg"></div>
                    <div class="skeleton-text skeleton-text-sm"></div>
                    <div class="skeleton-text skeleton-text-xs"></div>
                    <div class="skeleton-button"></div>
                </div>
            `;
            containerElement.appendChild(skeletonCard);
        }
    };

    // --- Render Produk (Fungsi yang lebih fleksibel untuk berbagai etalase) ---
    const renderProductsInContainer = (productsToRender, containerElement, noResultsElement, initialLoad = false) => {
        // Tampilkan skeleton jika ini bukan pemanggilan ulang (misal setelah search)
        if (!initialLoad && productsToRender.length > 0) {
             const skeletonCount = Math.min(productsToRender.length, 8); // Max 8 skeletons
             renderSkeletonLoaders(containerElement, skeletonCount);
        }
       
        // Simulasikan loading data dengan setTimeout
        setTimeout(() => {
            containerElement.innerHTML = ''; // Hapus skeleton loader
            if (productsToRender.length === 0) {
                noResultsElement.style.display = 'block';
                if (containerElement === productList) {
                    noResultsElement.textContent = "Produk tidak ditemukan.";
                } else if (containerElement === blackClothingList) {
                    noResultsElement.textContent = "Belum ada koleksi baju hitam saat ini.";
                } else if (containerElement === whiteClothingList) {
                    noResultsElement.textContent = "Belum ada koleksi baju putih saat ini.";
                }
            } else {
                noResultsElement.style.display = 'none';
                productsToRender.forEach(product => {
                    // Determine initial stock status for display
                    const totalStock = Object.values(product.stock).reduce((sum, current) => sum + current, 0);
                    const stockClass = totalStock > 0 ? 'in-stock' : 'out-of-stock';
                    const stockText = totalStock > 0 ? `Stok: Tersedia (${totalStock})` : 'Stok: Habis';

                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="price">${formatRupiah(getPriceBySize(product.basePrice, 'M'))}</p>
                            <div class="stock-info ${stockClass}">${stockText}</div> <div class="size-options" data-product-id="${product.id}">
                                ${product.sizes.map(size => `
                                    <span class="size-option ${product.stock[size] === 0 ? 'disabled' : ''}" 
                                          data-size="${size}" 
                                          data-stock="${product.stock[size]}">
                                        ${size}
                                    </span>
                                `).join('')}
                            </div>
                            <div class="product-actions">
                                <button class="btn add-to-cart" data-id="${product.id}" ${totalStock === 0 ? 'disabled' : ''}><i class="fas fa-shopping-cart"></i> Tambah ke Keranjang</button>
                                <button class="btn quick-view-btn" data-id="${product.id}"><i class="fas fa-eye"></i> Quick View</button>
                                <button class="btn add-to-favorite" data-id="${product.id}"><i class="far fa-heart"></i></button>
                            </div>
                        </div>
                    `;
                    containerElement.appendChild(productCard);
                });

                // Event listener untuk pilihan ukuran
                containerElement.querySelectorAll('.size-option').forEach(option => {
                    option.addEventListener('click', (e) => {
                        if (e.target.classList.contains('disabled')) {
                            showToast("Ukuran ini sedang tidak tersedia.", "error");
                            return;
                        }
                        const parentSizes = e.target.closest('.product-card').querySelector('.size-options');
                        parentSizes.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                        e.target.classList.add('selected');

                        // Enable/disable Add to Cart button based on selected size stock
                        const productId = e.target.closest('.product-card').querySelector('.add-to-cart').dataset.id;
                        const product = products.find(p => p.id === productId);
                        const selectedSize = e.target.dataset.size;
                        const addToCartButton = e.target.closest('.product-card').querySelector('.add-to-cart');

                        if (product.stock[selectedSize] > 0) {
                            addToCartButton.disabled = false;
                            addToCartButton.textContent = "Tambah ke Keranjang";
                            addToCartButton.classList.remove('added');
                        } else {
                            addToCartButton.disabled = true;
                            addToCartButton.textContent = "Stok Habis";
                        }
                    });
                });

                // Event listener untuk tombol Add to Cart
                containerElement.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.id;
                        const selectedSizeElement = e.target.closest('.product-card').querySelector('.size-option.selected');

                        if (!selectedSizeElement) {
                            showToast("Mohon pilih ukuran baju terlebih dahulu!", "warning");
                            return;
                        }
                        const selectedSize = selectedSizeElement.dataset.size;
                        addToCart(productId, selectedSize);

                        // Feedback visual tombol "Ditambahkan!"
                        const originalText = button.textContent;
                        button.textContent = "✅ Ditambahkan!";
                        button.classList.add('added');
                        button.disabled = true;

                        setTimeout(() => {
                            button.textContent = originalText;
                            button.classList.remove('added');
                            button.disabled = false;
                        }, 1500);
                    });
                });

                // Event listener untuk tombol Quick View
                containerElement.querySelectorAll('.quick-view-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.id;
                        openQuickViewModal(productId);
                    });
                });

                // Event listener untuk tombol Favorit
                containerElement.querySelectorAll('.add-to-favorite').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.id || e.target.closest('button').dataset.id;
                        toggleFavorite(productId, e.target.closest('button'));
                    });
                });
            }
            updateFavoriteButtons(); // Pastikan tombol favorit diperbarui setelah render
        }, initialLoad ? 0 : 700); // Waktu loading simulasi
    };

    // --- Fungsi Utama Render Etalase ---
    const renderAllProductShowcases = (searchTerm = '') => {
        let filteredProducts = products;

        const allCollectionsTitle = document.querySelector('#koleksi h2');

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                product.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
            document.getElementById('baju-hitam').style.display = 'none';
            document.getElementById('baju-putih').style.display = 'none';
            allCollectionsTitle.textContent = `Hasil Pencarian untuk "${searchTerm}"`;
        } else {
            document.getElementById('baju-hitam').style.display = 'block';
            document.getElementById('baju-putih').style.display = 'block';
            allCollectionsTitle.textContent = "Semua Koleksi";
        }

        renderProductsInContainer(filteredProducts, productList, noResultsMessage);

        if (!searchTerm) {
            const blackClothing = products.filter(p => p.color && p.color.toLowerCase() === 'hitam');
            renderProductsInContainer(blackClothing, blackClothingList, noBlackClothingMessage);
        } else {
            blackClothingList.innerHTML = '';
            noBlackClothingMessage.style.display = 'none';
        }

        if (!searchTerm) {
            const whiteClothing = products.filter(p => p.color && p.color.toLowerCase() === 'putih');
            renderProductsInContainer(whiteClothing, whiteClothingList, noWhiteClothingMessage);
        } else {
            whiteClothingList.innerHTML = '';
            noWhiteClothingMessage.style.display = 'none';
        }
    };

    // --- Event Listener Pencarian ---
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        renderAllProductShowcases(searchTerm);
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            renderAllProductShowcases(searchTerm);
        }
    });

    // --- Keranjang Belanja ---
    const addToCart = (productId, size) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const currentStock = product.stock[size];
        const existingItemInCart = cart.find(item => item.id === productId && item.size === size);
        const quantityInCart = existingItemInCart ? existingItemInCart.quantity : 0;

        if (currentStock <= 0 || quantityInCart >= currentStock) {
            showToast(`Stok untuk ${product.name} ukuran ${size} habis atau tidak mencukupi!`, "error");
            return;
        }

        const price = getPriceBySize(product.basePrice, size);
        const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity++;
            showToast(`Kuantitas ${product.name} (${size}) diperbarui di keranjang!`, "info");
        } else {
            cart.push({ id: product.id, name: product.name, image: product.image, price: price, size: size, quantity: 1 });
            showToast(`${product.name} (${size}) ditambahkan ke keranjang!`, "success");
        }
        
        product.stock[size]--; // Decrease simulated stock
        saveCart();
        renderCart();
        renderAllProductShowcases(); // Re-render product list to update stock display
    };

    const updateQuantity = (productId, size, change) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);
        if (itemIndex > -1) {
            const currentQuantity = cart[itemIndex].quantity;
            const newQuantity = currentQuantity + change;

            if (newQuantity <= 0) {
                // NEW: Tampilkan modal konfirmasi sebelum menghapus
                showConfirmationModal(`Anda yakin ingin menghapus "${cart[itemIndex].name} (${cart[itemIndex].size})" dari keranjang?`, () => {
                    const removedItemName = cart[itemIndex].name; // Simpan nama sebelum dihapus
                    const removedItemSize = cart[itemIndex].size; // Simpan ukuran sebelum dihapus
                    product.stock[size] += cart[itemIndex].quantity; // Restore stock
                    cart.splice(itemIndex, 1);
                    saveCart();
                    renderCart();
                    renderAllProductShowcases(); // Re-render product list to update stock display
                    showToast(`"${removedItemName} (${removedItemSize})" berhasil dihapus dari keranjang.`, "success");
                });
            } else if (newQuantity > product.stock[size] + currentQuantity) { // Check against original stock + what's already in cart
                showToast(`Stok untuk ${product.name} ukuran ${size} hanya tersisa ${product.stock[size] + currentQuantity} item.`, "error");
            } else {
                cart[itemIndex].quantity = newQuantity;
                product.stock[size] -= change; // Update simulated stock
                saveCart();
                renderCart();
                renderAllProductShowcases(); // Re-render product list to update stock display
                showToast(`Kuantitas "${cart[itemIndex].name} (${cart[itemIndex].size})" diubah.`, "info");
            }
        }
    };

    const calculateCartTotals = () => {
        let subtotal = 0;
        let totalItems = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            totalItems += item.quantity;
        });

        let discount = 0;
        if (totalItems >= 5) {
            discount = subtotal * 0.02; // Diskon 2% jika 5 item atau lebih
        }

        const total = subtotal - discount;
        return { subtotal, discount, total, totalItems };
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        const { subtotal, discount, total, totalItems } = calculateCartTotals();

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.style.display = 'none'; // Sembunyikan tombol checkout
            checkoutFormContainer.style.display = 'none'; // Sembunyikan form checkout
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.style.display = 'block'; // Tampilkan tombol checkout
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name} (${item.size})</h4>
                        <p>${formatRupiah(item.price)}</p>
                    </div>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-id="${item.id}" data-size="${item.size}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}" data-size="${item.size}">+</button>
                    </div>
                    <div class="item-price">${formatRupiah(item.price * item.quantity)}</div>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            // Event listeners untuk tombol quantity
            cartItemsContainer.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const size = e.target.dataset.size;
                    updateQuantity(productId, size, -1);
                });
            });

            cartItemsContainer.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const size = e.target.dataset.size;
                    updateQuantity(productId, size, 1);
                });
            });
        }

        cartCountSpan.textContent = totalItems;
        subtotalPriceSpan.textContent = formatRupiah(subtotal);
        discountAmountSpan.textContent = formatRupiah(discount);
        totalPriceSpan.textContent = formatRupiah(total);
    };

    // --- Checkout Form ---
    checkoutBtn.addEventListener('click', () => {
        checkoutFormContainer.style.display = 'block';
        checkoutBtn.style.display = 'none'; // Sembunyikan tombol checkout setelah form muncul
        // Gulir ke form checkout
        checkoutFormContainer.scrollIntoView({ behavior: 'smooth' });
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform validation for all fields
        const customerNameInput = document.getElementById('customer-name');
        const customerPhoneInput = document.getElementById('customer-phone');
        const customerAddressInput = document.getElementById('customer-address');
        const expeditionMethodInput = document.getElementById('expedition-method');

        const isNameValid = validateField(customerNameInput);
        const isPhoneValid = validateField(customerPhoneInput);
        const isAddressValid = validateField(customerAddressInput);
        const isExpeditionValid = validateField(expeditionMethodInput);

        if (!isNameValid || !isPhoneValid || !isAddressValid || !isExpeditionValid) {
            showToast("Harap lengkapi semua bidang yang wajib diisi dengan benar.", "error");
            return; // Stop submission if any validation fails
        }
        
        const customerName = customerNameInput.value;
        const customerPhone = customerPhoneInput.value;
        const customerAddress = customerAddressInput.value;
        const expeditionMethod = expeditionMethodInput.value;
        
        const { total } = calculateCartTotals();
        const orderId = `LXVR-${orderCounter++}`; // Buat ID pesanan unik
        localStorage.setItem('orderCounter', orderCounter); // Simpan counter baru

        let orderDetails = `*Order Baru dari Luxuliver Shop*\n\n`;
        orderDetails += `*ID Pesanan:* ${orderId}\n`;
        orderDetails += `*Nama Pelanggan:* ${customerName}\n`;
        orderDetails += `*Telepon:* ${customerPhone}\n`;
        orderDetails += `*Alamat:* ${customerAddress}\n`;
        orderDetails += `*Metode Ekspedisi:* ${expeditionMethod.toUpperCase().replace('-', ' ')}\n\n`; // Format J&T, LION PARCEL, JNE
        orderDetails += `*Detail Pesanan:*\n`;

        cart.forEach(item => {
            orderDetails += `- ${item.name} (${item.size}) x ${item.quantity} = ${formatRupiah(item.price * item.quantity)}\n`;
        });

        orderDetails += `\n*Total Pembayaran:* ${formatRupiah(total)}\n\n`;
        orderDetails += `Terima kasih telah berbelanja di Luxuliver Shop!`;

        const whatsappUrl = `https://wa.me/${sellerInfo.whatsappAdmin}?text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappUrl, '_blank');

        // Reset keranjang setelah pesanan
        cart = [];
        saveCart();
        renderCart();
        checkoutForm.reset();
        checkoutFormContainer.style.display = 'none'; // Sembunyikan form kembali
        showToast("Pesanan Anda telah berhasil dibuat! Kami akan menghubungi Anda melalui WhatsApp.", "success");
    });


    // --- Quick View Modal Logic ---
    const openQuickViewModal = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Populate modal content
        modalBody.querySelector('img').src = product.image;
        modalBody.querySelector('img').alt = product.name;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-product-price').textContent = formatRupiah(getPriceBySize(product.basePrice, 'M')); // Default size M for display
        modalAddToCartBtn.dataset.id = product.id; // Set product ID for ATC button

        // Render size options in modal with stock info
        modalSizeOptions.innerHTML = product.sizes.map(size => {
            const stockForSize = product.stock[size] || 0;
            const isDisabled = stockForSize === 0 ? 'disabled' : '';
            return `
                <span class="size-option ${isDisabled}" 
                      data-size="${size}" 
                      data-stock="${stockForSize}">
                    ${size}
                </span>
            `;
        }).join('');

        // Set default selected size to M if available, otherwise first available size
        let defaultSelectedSize = 'M';
        if (!product.sizes.includes('M') || product.stock['M'] === 0) {
            defaultSelectedSize = product.sizes.find(size => product.stock[size] > 0) || product.sizes[0];
        }
        const defaultSizeOptionElement = modalSizeOptions.querySelector(`.size-option[data-size="${defaultSelectedSize}"]`);
        if (defaultSizeOptionElement && !defaultSizeOptionElement.classList.contains('disabled')) {
            defaultSizeOptionElement.classList.add('selected');
            document.getElementById('modal-product-price').textContent = formatRupiah(getPriceBySize(product.basePrice, defaultSelectedSize));
            // Update modal stock info for default selected size
            updateModalStockInfo(product, defaultSelectedSize);
            modalAddToCartBtn.disabled = false;
        } else {
            // If no default size is selectable, disable add to cart
            modalAddToCartBtn.disabled = true;
            modalStockInfo.textContent = 'Stok: Habis';
            modalStockInfo.className = 'stock-info out-of-stock';
        }


        // Add event listeners for size options in modal
        modalSizeOptions.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (e.target.classList.contains('disabled')) {
                    showToast("Ukuran ini sedang tidak tersedia.", "error");
                    return;
                }
                modalSizeOptions.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
                // Update price in modal based on selected size
                document.getElementById('modal-product-price').textContent = formatRupiah(getPriceBySize(product.basePrice, e.target.dataset.size));
                // Update modal stock info based on selected size
                updateModalStockInfo(product, e.target.dataset.size);
                modalAddToCartBtn.disabled = false; // Enable button if a selectable size is chosen
            });
        });

        // Event listener for Add to Cart button in modal
        modalAddToCartBtn.onclick = () => {
            const selectedSizeElement = modalSizeOptions.querySelector('.size-option.selected');
            if (!selectedSizeElement) {
                showToast("Mohon pilih ukuran baju terlebih dahulu!", "warning");
                return;
            }
            const selectedSize = selectedSizeElement.dataset.size;
            addToCart(productId, selectedSize);
            quickViewModal.classList.remove('show'); // Close modal after adding to cart
            body.classList.remove('no-scroll'); // Re-enable scrolling
        };

        // Event listener for Add to Favorite button in modal
        quickViewModal.querySelector('.modal-add-to-favorite').onclick = (e) => {
            const id = e.target.dataset.id || e.target.closest('button').dataset.id;
            toggleFavorite(id, e.target.closest('button'));
        };

        // Show modal
        quickViewModal.classList.add('show');
        body.classList.add('no-scroll'); // Disable scrolling on body
    };

    // NEW: Function to update stock info in Quick View Modal
    const updateModalStockInfo = (product, selectedSize) => {
        const stockForSize = product.stock[selectedSize] || 0;
        if (stockForSize > 0) {
            modalStockInfo.textContent = `Stok: Tersedia (${stockForSize})`;
            modalStockInfo.className = 'stock-info in-stock';
            modalAddToCartBtn.disabled = false;
        } else {
            modalStockInfo.textContent = 'Stok: Habis';
            modalStockInfo.className = 'stock-info out-of-stock';
            modalAddToCartBtn.disabled = true;
        }
    };


    closeModalButton.addEventListener('click', () => {
        quickViewModal.classList.remove('show');
        body.classList.remove('no-scroll');
    });

    window.addEventListener('click', (event) => {
        if (event.target === quickViewModal) {
            quickViewModal.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    });

    // --- Favorit Logic ---
    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    const renderFavorites = () => {
        favoriteProductsList.innerHTML = '';
        if (favorites.length === 0) {
            emptyFavoritesMessage.style.display = 'block';
        } else {
            emptyFavoritesMessage.style.display = 'none';
            favorites.forEach(favId => {
                const product = products.find(p => p.id === favId);
                if (product) {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    const totalStock = Object.values(product.stock).reduce((sum, current) => sum + current, 0);
                    const stockClass = totalStock > 0 ? 'in-stock' : 'out-of-stock';
                    const stockText = totalStock > 0 ? `Stok: Tersedia (${totalStock})` : 'Stok: Habis';

                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="price">${formatRupiah(getPriceBySize(product.basePrice, 'M'))}</p>
                            <div class="stock-info ${stockClass}">${stockText}</div>
                            <div class="size-options" data-product-id="${product.id}">
                                ${product.sizes.map(size => `
                                    <span class="size-option ${product.stock[size] === 0 ? 'disabled' : ''}" 
                                          data-size="${size}" 
                                          data-stock="${product.stock[size]}">
                                        ${size}
                                    </span>
                                `).join('')}
                            </div>
                            <div class="product-actions">
                                <button class="btn add-to-cart" data-id="${product.id}" ${totalStock === 0 ? 'disabled' : ''}><i class="fas fa-shopping-cart"></i> Tambah ke Keranjang</button>
                                <button class="btn quick-view-btn" data-id="${product.id}"><i class="fas fa-eye"></i> Quick View</button>
                                <button class="btn add-to-favorite favorited" data-id="${product.id}"><i class="fas fa-heart"></i></button> </div>
                        </div>
                    `;
                    favoriteProductsList.appendChild(productCard);
                }
            });

            // Re-attach event listeners for newly rendered favorites
            favoriteProductsList.querySelectorAll('.size-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    if (e.target.classList.contains('disabled')) {
                        showToast("Ukuran ini sedang tidak tersedia.", "error");
                        return;
                    }
                    const parentSizes = e.target.closest('.product-card').querySelector('.size-options');
                    parentSizes.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                    e.target.classList.add('selected');
                });
            });

            favoriteProductsList.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const selectedSizeElement = e.target.closest('.product-card').querySelector('.size-option.selected');
                    if (!selectedSizeElement) {
                        showToast("Mohon pilih ukuran baju terlebih dahulu!", "warning");
                        return;
                    }
                    const selectedSize = selectedSizeElement.dataset.size;
                    addToCart(productId, selectedSize);
                });
            });

            favoriteProductsList.querySelectorAll('.quick-view-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    openQuickViewModal(productId);
                });
            });

            favoriteProductsList.querySelectorAll('.add-to-favorite').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id || e.target.closest('button').dataset.id;
                    toggleFavorite(productId, e.target.closest('button'));
                });
            });
        }
        favoriteCountSpan.textContent = favorites.length;
        updateFavoriteButtons(); // Update all favorite buttons across the page
    };

    const toggleFavorite = (productId, buttonElement) => {
        const index = favorites.indexOf(productId);
        if (index > -1) {
            favorites.splice(index, 1);
            showToast("Produk dihapus dari favorit.", "info");
        } else {
            favorites.push(productId);
            showToast("Produk ditambahkan ke favorit!", "success");
        }
        saveFavorites();
        renderFavorites();
        updateFavoriteButtons(); // Crucial for updating buttons on all pages
    };

    const updateFavoriteButtons = () => {
        document.querySelectorAll('.add-to-favorite').forEach(button => {
            const productId = button.dataset.id;
            if (favorites.includes(productId)) {
                button.classList.add('favorited');
                button.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                button.classList.remove('favorited');
                button.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    };

    // --- NEW: Confirmation Modal ---
    let confirmCallback = null; // Callback function to execute on 'Yes'

    const showConfirmationModal = (message, callback) => {
        confirmMessage.textContent = message;
        confirmCallback = callback;
        confirmationModal.classList.add('show');
        body.classList.add('no-scroll');
    };

    confirmYesBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback();
        }
        confirmationModal.classList.remove('show');
        body.classList.remove('no-scroll');
        confirmCallback = null; // Reset callback
    });

    confirmNoBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('show');
        body.classList.remove('no-scroll');
        confirmCallback = null;
    });

    // --- NEW: Scroll-to-Top Button Logic ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Inisialisasi Aplikasi ---
    const initializeApp = () => {
        // Tampilkan skeleton saat inisialisasi
        renderSkeletonLoaders(productList, 8); // Tampilkan 8 skeleton di koleksi utama
        renderSkeletonLoaders(blackClothingList, 2); // 2 di baju hitam
        renderSkeletonLoaders(whiteClothingList, 2); // 2 di baju putih

        // Kemudian baru render produk asli setelah sedikit delay
        setTimeout(() => {
            renderAllProductShowcases(false); // Render semua produk tanpa filter awal
            renderCart(); // Ini akan mengatur visibility form checkout
            renderFavorites(); // Merender favorit saat load
            currentYearSpan.textContent = new Date().getFullYear();

            // Update informasi penjual di footer
            sellerAddressSpan.textContent = sellerInfo.address;
            sellerPhoneSpan.textContent = sellerInfo.phone;
            sellerEmailSpan.textContent = sellerInfo.email;

            // Update link Instagram di header dan footer
            document.querySelector('nav ul li a[href*="instagram.com"]').href = sellerInfo.instagram;
            document.querySelector('footer a[href*="instagram.com"]').href = sellerInfo.instagram;

            // Hapus kelas no-scroll dari body setelah semua konten dimuat
            body.classList.remove('no-scroll');
        }, 1500); // Penundaan 1.5 detik untuk simulasi loading awal
    };

    initializeApp();
});
