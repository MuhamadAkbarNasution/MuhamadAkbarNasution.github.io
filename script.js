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
            color: 'putih'
        },
        {
            id: 'baju-002',
            name: 'Dog and éclipse',
            image: 'Dog.jpg', // Pastikan gambar ini ada di folder Anda
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS','S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
        {
            id: 'baju-003',
            name: 'Travis Scoot',
            image: 'Travis scoot.jpg', // Pastikan gambar ini ada di folder Anda
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
        {
            id: 'baju-004',
            name: 'Person',
            image: 'Person.jpg', // Pastikan gambar ini ada di folder Anda
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam'
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

    // NEW: Elemen Breadcrumbs
    const breadcrumbs = document.querySelector('.breadcrumbs');
    const breadcrumbList = document.getElementById('breadcrumb-list');

    // NEW: Elemen Checkout Progress Bar
    const checkoutProgressBar = document.getElementById('checkout-progress-bar');
    const stepCart = document.getElementById('step-cart');
    const stepInfo = document.getElementById('step-info');
    const stepConfirm = document.getElementById('step-confirm');
    const stepDone = document.getElementById('step-done');

    // NEW: Elemen Interactive Order Summary
    const orderSummaryInteractive = document.getElementById('order-summary-interactive');
    const summaryItemsList = document.getElementById('summary-items-list');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryDiscount = document.getElementById('summary-discount');
    const summaryTotal = document.getElementById('summary-total');

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
    const renderProductsInContainer = (productsToRender, containerElement, noResultsElement) => {
        if (productsToRender.length === 0) {
            containerElement.innerHTML = '';
            noResultsElement.style.display = 'block';
            if (containerElement === blackClothingList) {
                noResultsElement.textContent = "Belum ada koleksi baju hitam saat ini.";
            } else if (containerElement === whiteClothingList) {
                noResultsElement.textContent = "Belum ada koleksi baju putih saat ini.";
            }
        } else {
            noResultsElement.style.display = 'none';
            containerElement.innerHTML = ''; // Clear previous products
            productsToRender.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-card-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="price">${formatRupiah(product.basePrice)}</p>
                        <button class="btn btn-primary btn-quick-view" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                `;
                containerElement.appendChild(productCard);
            });

            // Tambahkan event listener untuk tombol Quick View
            containerElement.querySelectorAll('.btn-quick-view').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    openQuickViewModal(productId);
                });
            });
        }
    };

    const renderAllProductShowcases = (searchTerm = '') => {
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.color.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Render untuk Semua Koleksi
        if (searchTerm) {
            // Jika ada pencarian, hanya tampilkan hasil di 'Semua Koleksi'
            document.getElementById('koleksi').style.display = 'block';
            document.getElementById('search-section').style.display = 'block';
            document.getElementById('baju-hitam').style.display = 'none';
            document.getElementById('baju-putih').style.display = 'none';
            document.getElementById('keranjang').style.display = 'none';
            document.getElementById('favorit').style.display = 'none';

            renderProductsInContainer(filteredProducts, productList, noResultsMessage);
            if (filteredProducts.length > 0) {
                noResultsMessage.style.display = 'none';
            } else {
                noResultsMessage.style.display = 'block';
                noResultsMessage.textContent = `Tidak ada produk yang cocok dengan "${searchTerm}".`;
            }
        } else {
            // Jika tidak ada pencarian, tampilkan semua sesuai kategori
            document.getElementById('koleksi').style.display = 'block';
            document.getElementById('search-section').style.display = 'block';
            document.getElementById('baju-hitam').style.display = 'block';
            document.getElementById('baju-putih').style.display = 'block';
            document.getElementById('keranjang').style.display = 'block';
            document.getElementById('favorit').style.display = 'block';

            renderProductsInContainer(products, productList, noResultsMessage);

            const blackClothing = products.filter(p => p.color === 'hitam');
            renderProductsInContainer(blackClothing, blackClothingList, noBlackClothingMessage);

            const whiteClothing = products.filter(p => p.color === 'putih');
            renderProductsInContainer(whiteClothing, whiteClothingList, noWhiteClothingMessage);
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

    // --- Quick View Modal Logic ---
    const openQuickViewModal = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        quickViewModal.querySelector('img').src = product.image;
        quickViewModal.querySelector('img').alt = product.name;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-product-price').textContent = formatRupiah(product.basePrice);

        // Simpan product ID for ATC button
        modalAddToCartBtn.dataset.id = product.id;

        // Render size options in modal
        modalSizeOptions.innerHTML = product.sizes.map(size => `<span class="size-option" data-size="${size}">${size}</span>`).join('');

        // Add event listeners for size options in modal
        modalSizeOptions.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                modalSizeOptions.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
                
                // Update price based on selected size (e.g., XL might be more expensive)
                const selectedSize = e.target.dataset.size;
                const updatedPrice = getPriceBySize(product.basePrice, selectedSize);
                document.getElementById('modal-product-price').textContent = formatRupiah(updatedPrice);
            });
        });

        // Pre-select the first size if available
        if (product.sizes.length > 0) {
            modalSizeOptions.querySelector('.size-option').classList.add('selected');
            const updatedPrice = getPriceBySize(product.basePrice, product.sizes[0]);
            document.getElementById('modal-product-price').textContent = formatRupiah(updatedPrice);
        } else {
             // If no sizes, clear selected state and ensure base price is shown
             modalSizeOptions.innerHTML = '';
             document.getElementById('modal-product-price').textContent = formatRupiah(product.basePrice);
        }

        // Update add to favorite button in modal
        const modalAddToFavoriteBtn = quickViewModal.querySelector('.modal-add-to-favorite');
        modalAddToFavoriteBtn.dataset.id = product.id;
        if (favorites.some(fav => fav.id === product.id)) {
            modalAddToFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Hapus dari Favorit';
            modalAddToFavoriteBtn.classList.add('favorited');
        } else {
            modalAddToFavoriteBtn.innerHTML = '<i class="far fa-heart"></i> Tambah ke Favorit';
            modalAddToFavoriteBtn.classList.remove('favorited');
        }

        quickViewModal.classList.add('open');
        body.classList.add('no-scroll'); // Prevent background scroll
    };

    closeModalButton.addEventListener('click', () => {
        quickViewModal.classList.remove('open');
        body.classList.remove('no-scroll');
    });

    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.classList.remove('open');
            body.classList.remove('no-scroll');
        }
    });

    // Handle Add to Cart from Quick View Modal
    modalAddToCartBtn.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        const selectedSizeElement = modalSizeOptions.querySelector('.size-option.selected');
        const selectedSize = selectedSizeElement ? selectedSizeElement.dataset.size : (products.find(p => p.id === productId)?.sizes[0] || 'Unknown'); // Default to first size if not selected

        if (productId && selectedSize) {
            addToCart(productId, selectedSize);
            quickViewModal.classList.remove('open'); // Close modal after adding
            body.classList.remove('no-scroll');
        } else {
            showToast('Pilih ukuran terlebih dahulu!', 'warning');
        }
    });

    // Handle Add/Remove to Favorite from Quick View Modal
    quickViewModal.querySelector('.modal-add-to-favorite').addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        toggleFavorite(productId, e.target); // Pass the button element
    });


    // --- Cart Logic ---
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    const addToCart = (productId, size = 'M', quantity = 1) => {
        const product = products.find(p => p.id === productId);
        if (!product) {
            showToast('Produk tidak ditemukan!', 'error');
            return;
        }

        const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
            showToast(`${product.name} (${size}) jumlah diperbarui di keranjang!`, 'info');
        } else {
            const price = getPriceBySize(product.basePrice, size);
            cart.push({ ...product, size, quantity, price });
            showToast(`${product.name} (${size}) ditambahkan ke keranjang!`, 'success');
        }
        saveCart();
        renderCart();
    };

    const removeFromCart = (productId, size) => {
        cart = cart.filter(item => !(item.id === productId && item.size === size));
        saveCart();
        renderCart();
        showToast('Produk dihapus dari keranjang.', 'info');
    };

    const updateQuantity = (productId, size, change) => {
        const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                removeFromCart(productId, size);
            } else {
                saveCart();
                renderCart();
            }
        }
    };

    const calculateCartTotals = () => {
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        // Contoh diskon: 10% jika subtotal di atas Rp500.000
        const discountPercentage = subtotal >= 500000 ? 0.10 : 0;
        const discountAmount = subtotal * discountPercentage;
        const total = subtotal - discountAmount;

        return { subtotal, discountAmount, total };
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.style.display = 'none';
            checkoutFormContainer.style.display = 'none'; // Sembunyikan form checkout jika keranjang kosong
        } else {
            emptyCartMessage.style.display = 'none';
            checkoutBtn.style.display = 'block';
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
                    <div class="item-total-price">${formatRupiah(item.price * item.quantity)}</div>
                    <button class="remove-item" data-id="${item.id}" data-size="${item.size}">&times;</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });

            // Add event listeners for quantity controls and remove buttons
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

            cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const size = e.target.dataset.size;
                    showConfirmationModal('Apakah Anda yakin ingin menghapus produk ini dari keranjang?', () => {
                        removeFromCart(productId, size);
                    });
                });
            });
        }

        const { subtotal, discountAmount, total } = calculateCartTotals();
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        subtotalPriceSpan.textContent = formatRupiah(subtotal);
        discountAmountSpan.textContent = formatRupiah(discountAmount);
        totalPriceSpan.textContent = formatRupiah(total);

        // Update interactive order summary if checkout form is visible
        if (checkoutFormContainer.style.display === 'block') {
            renderOrderSummary();
        }
    };

    // Initial render of cart
    renderCart();

    // --- Checkout Logic ---
    checkoutBtn.addEventListener('click', () => {
        checkoutFormContainer.style.display = 'block';
        checkoutBtn.style.display = 'none'; // Sembunyikan tombol checkout setelah diklik
        checkoutProgressBar.style.display = 'flex'; // Tampilkan progress bar
        updateCheckoutProgressBar('info'); // Set langkah ke 'Informasi'
        renderOrderSummary(); // Tampilkan ringkasan pesanan
        orderSummaryInteractive.style.display = 'block'; // Pastikan ringkasan pesanan terlihat

        // Smooth scroll ke form checkout
        checkoutFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerAddress = document.getElementById('customer-address').value;
        const expeditionMethod = document.getElementById('expedition-method').value;

        if (!customerName || !customerPhone || !customerAddress || !expeditionMethod) {
            showToast('Mohon lengkapi semua informasi pengiriman.', 'warning');
            return;
        }

        showConfirmationModal('Apakah informasi pesanan Anda sudah benar? Anda akan diarahkan ke WhatsApp.', () => {
            const { total } = calculateCartTotals();
            const orderNumber = `LUX-${orderCounter++}`;
            localStorage.setItem('orderCounter', orderCounter.toString()); // Simpan orderCounter baru

            let message = `*Pesanan Baru Luxuliver Shop*\n\n`;
            message += `*Nomor Pesanan:* ${orderNumber}\n`;
            message += `*Nama:* ${customerName}\n`;
            message += `*Nomor WhatsApp:* ${customerPhone}\n`;
            message += `*Alamat:* ${customerAddress}\n`;
            message += `*Metode Ekspedisi:* ${expeditionMethod}\n\n`;
            message += `*Detail Pesanan:*\n`;

            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.name} (${item.size}) - ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.quantity * item.price)}\n`;
            });

            message += `\n*Subtotal:* ${subtotalPriceSpan.textContent}\n`;
            message += `*Diskon:* ${discountAmountSpan.textContent}\n`;
            message += `*Total Pembayaran:* ${totalPriceSpan.textContent}\n\n`;
            message += `Terima kasih telah berbelanja di Luxuliver Shop!`;

            const whatsappUrl = `https://wa.me/${sellerInfo.whatsappAdmin}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            // Clear cart after successful order
            cart = [];
            saveCart();
            renderCart();
            checkoutForm.reset();
            checkoutFormContainer.style.display = 'none'; // Sembunyikan form
            checkoutProgressBar.style.display = 'none'; // Sembunyikan progress bar
            updateCheckoutProgressBar('done'); // Set langkah ke 'Selesai' (opsional, tergantung alur)
            showToast('Pesanan Anda berhasil dibuat! Mohon lanjutkan ke WhatsApp untuk konfirmasi.', 'success');

            // Optionally scroll back to top or a success message
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Confirmation Modal Logic ---
    let confirmCallback = null; // Callback function for confirmation

    const showConfirmationModal = (message, onConfirm) => {
        confirmMessage.textContent = message;
        confirmCallback = onConfirm;
        confirmationModal.classList.add('open');
        body.classList.add('no-scroll');
    };

    confirmYesBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('open');
        body.classList.remove('no-scroll');
        if (confirmCallback) {
            confirmCallback();
            confirmCallback = null; // Clear callback
        }
    });

    confirmNoBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('open');
        body.classList.remove('no-scroll');
        confirmCallback = null;
    });

    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.classList.remove('open');
            body.classList.remove('no-scroll');
            confirmCallback = null;
        }
    });

    // --- Favorites Logic ---
    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        favoriteCountSpan.textContent = favorites.length;
    };

    const renderFavorites = () => {
        favoriteProductsList.innerHTML = '';
        if (favorites.length === 0) {
            emptyFavoritesMessage.style.display = 'block';
        } else {
            emptyFavoritesMessage.style.display = 'none';
            favorites.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-card-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="price">${formatRupiah(product.basePrice)}</p>
                        <button class="btn btn-primary btn-quick-view" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                        <button class="btn btn-danger remove-from-favorite" data-id="${product.id}">
                            <i class="fas fa-heart-crack"></i> Hapus Favorit
                        </button>
                    </div>
                `;
                favoriteProductsList.appendChild(productCard);
            });

            // Add event listeners for Quick View
            favoriteProductsList.querySelectorAll('.btn-quick-view').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    openQuickViewModal(productId);
                });
            });

            // Add event listeners for remove from favorite buttons
            favoriteProductsList.querySelectorAll('.remove-from-favorite').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    toggleFavorite(productId); // Ini akan menghapus dan memperbarui tampilan
                });
            });
        }
        favoriteCountSpan.textContent = favorites.length;
    };

    const toggleFavorite = (productId, buttonElement = null) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const favoriteIndex = favorites.findIndex(item => item.id === productId);

        if (favoriteIndex > -1) {
            // Remove from favorites
            favorites.splice(favoriteIndex, 1);
            showToast(`"${product.name}" dihapus dari favorit.`, "info");
            if (buttonElement) {
                buttonElement.innerHTML = '<i class="far fa-heart"></i> Tambah ke Favorit';
                buttonElement.classList.remove('favorited');
            }
        } else {
            // Add to favorites
            favorites.push(product);
            showToast(`"${product.name}" ditambahkan ke favorit!`, "success");
            if (buttonElement) {
                buttonElement.innerHTML = '<i class="fas fa-heart"></i> Hapus dari Favorit';
                buttonElement.classList.add('favorited');
            }
        }
        saveFavorites();
        renderFavorites();
    };


    // --- Back to Top Button ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Tampilkan setelah scroll 300px
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


    // NEW FEATURES IMPLEMENTATION
    // --- Sticky Header (Already in CSS, just add class toggle for extra effects) ---
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Optional: Hide/Show header on scroll down/up
        // if (window.scrollY > lastScrollY && window.scrollY > 200) { // Scrolling down
        //     header.style.transform = 'translateY(-100%)';
        // } else { // Scrolling up
        //     header.style.transform = 'translateY(0)';
        // }
        // lastScrollY = window.scrollY;

        updateActiveNavLink(); // Update active nav link on scroll
        updateBreadcrumbs(); // Update breadcrumbs on scroll
    });

    // --- Highlight Active Category in Navigation ---
    const navLinks = document.querySelectorAll('header nav ul li a');
    const sections = document.querySelectorAll('main section[id]');

    const updateActiveNavLink = () => {
        let currentActiveSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight; // Adjust for sticky header
            const sectionBottom = sectionTop + section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentActiveSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // Call on load and scroll
    updateActiveNavLink();


    // --- Breadcrumbs Logic ---
    const updateBreadcrumbs = () => {
        let currentPath = [];
        let currentSectionName = 'Beranda'; // Default

        const heroSection = document.getElementById('hero');
        const heroRect = heroSection.getBoundingClientRect();
        if (heroRect.top <= 0 && heroRect.bottom > 0) {
             currentSectionName = 'Beranda';
             breadcrumbs.style.display = 'none'; // Hide breadcrumbs on hero
             return; // Exit early if on hero section
        } else {
            breadcrumbs.style.display = 'block'; // Show breadcrumbs
        }

        // Check for specific sections
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                switch (section.id) {
                    case 'koleksi':
                        currentSectionName = 'Semua Koleksi';
                        break;
                    case 'baju-hitam':
                        currentSectionName = 'Baju Hitam';
                        break;
                    case 'baju-putih':
                        currentSectionName = 'Baju Putih';
                        break;
                    case 'keranjang':
                        currentSectionName = 'Keranjang Belanja';
                        break;
                    case 'favorit':
                        currentSectionName = 'Produk Favorit';
                        break;
                    default:
                        currentSectionName = 'Produk'; // Fallback
                }
            }
        });
        
        // Build breadcrumb path
        currentPath.push({ name: 'Beranda', href: '#hero' });

        if (currentSectionName !== 'Beranda') {
            const currentSectionLink = navLinks.find(link => link.textContent.includes(currentSectionName));
            if (currentSectionLink && currentSectionLink.getAttribute('href') !== '#hero') {
                currentPath.push({ name: currentSectionName, href: currentSectionLink.getAttribute('href') });
            } else {
                currentPath.push({ name: currentSectionName, href: '#' + currentSectionName.toLowerCase().replace(/\s/g, '-') });
            }
        }
        
        breadcrumbList.innerHTML = '';
        currentPath.forEach((item, index) => {
            const li = document.createElement('li');
            if (index < currentPath.length - 1) {
                li.innerHTML = `<a href="${item.href}">${item.name}</a>`;
            } else {
                li.textContent = item.name;
            }
            breadcrumbList.appendChild(li);
        });
    };

    // Call on load and scroll
    updateBreadcrumbs();


    // --- Checkout Progress Bar Logic ---
    const updateCheckoutProgressBar = (currentStepId) => {
        const steps = [stepCart, stepInfo, stepConfirm, stepDone];
        let foundActive = false;

        steps.forEach(step => {
            step.classList.remove('active');
            if (step.id === `step-${currentStepId}`) {
                foundActive = true;
            }
            if (foundActive) {
                step.classList.add('active');
            }
        });
    };

    // Initial state for checkout progress bar
    if (checkoutFormContainer.style.display === 'block') {
        checkoutProgressBar.style.display = 'flex';
        updateCheckoutProgressBar('info'); // Assuming it starts at info if form is open
    } else {
        checkoutProgressBar.style.display = 'none';
    }


    // --- Interactive Order Summary Logic ---
    const renderOrderSummary = () => {
        summaryItemsList.innerHTML = '';
        if (cart.length === 0) {
            summaryItemsList.innerHTML = '<p style="text-align: center; color: var(--light-text);">Keranjang kosong.</p>';
            orderSummaryInteractive.style.display = 'none'; // Sembunyikan jika kosong
        } else {
            orderSummaryInteractive.style.display = 'block'; // Tampilkan jika ada item
            cart.forEach(item => {
                const summaryItemDiv = document.createElement('div');
                summaryItemDiv.classList.add('summary-item');
                summaryItemDiv.innerHTML = `
                    <span>${item.name} (${item.size}) <span class="item-qty">x${item.quantity}</span></span>
                    <span class="item-price">${formatRupiah(item.price * item.quantity)}</span>
                `;
                summaryItemsList.appendChild(summaryItemDiv);
            });
        }

        const { subtotal, discountAmount, total } = calculateCartTotals();
        summarySubtotal.textContent = formatRupiah(subtotal);
        summaryDiscount.textContent = formatRupiah(discountAmount);
        summaryTotal.textContent = formatRupiah(total);
    };

    // Update summary whenever form fields change (optional, for real-time updates)
    checkoutForm.addEventListener('input', renderOrderSummary);


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

            // Initial calls for new features
            updateActiveNavLink();
            updateBreadcrumbs();
            // renderOrderSummary(); // Called within renderCart or checkout button click
        }, 1500); // Penundaan 1.5 detik untuk simulasi loading awal
    };

    initializeApp();
});