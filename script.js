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
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductDescription = document.getElementById('modal-product-description');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
    const modalSizeOptions = document.getElementById('modal-size-options');
    const modalAddToFavoriteBtn = quickViewModal.querySelector('.modal-add-to-favorite');


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
    let confirmCallback = null; // Untuk menyimpan callback konfirmasi

    // NEW: Elemen untuk Toast/Snackbar Container (akan dibuat dan ditambahkan ke body)
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    // NEW: Elemen untuk Breadcrumbs
    const currentPageSpan = document.getElementById('current-page');
    const navLinks = document.querySelectorAll('header nav ul li a');

    // NEW: Elemen untuk Checkout Multi-Step Form
    const checkoutProgressSteps = document.querySelectorAll('.checkout-progress-bar .progress-step');
    const formSections = document.querySelectorAll('.form-section');
    const nextToExpeditionBtn = document.getElementById('next-to-expedition');
    const prevToContactBtn = document.getElementById('prev-to-contact');
    const nextToSummaryBtn = document.getElementById('next-to-summary');
    const prevToExpeditionSummaryBtn = document.getElementById('prev-to-expedition');
    const orderSummaryDetails = document.getElementById('order-summary-details');

    let currentStep = 1; // Mulai dari langkah pertama

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
    const showToast = (message, type = 'info', iconClass = '') => {
        const toast = document.createElement('div');
        toast.classList.add('toast-notification', type); // Tambahkan kelas 'info', 'success', 'error', 'warning'
        
        if (iconClass) {
            const icon = document.createElement('i');
            icon.classList.add('fas', iconClass);
            toast.appendChild(icon);
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        toast.appendChild(textSpan);
        
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

    // NEW: Fungsi untuk menampilkan Confirmation Modal
    const showConfirmationModal = (message, onConfirm) => {
        confirmMessage.textContent = message;
        confirmCallback = onConfirm; // Simpan callback
        confirmationModal.classList.add('show'); // Tampilkan modal
    };

    // NEW: Handler untuk tombol Ya pada konfirmasi modal
    confirmYesBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback(); // Jalankan callback jika ada
        }
        confirmationModal.classList.remove('show'); // Sembunyikan modal
        confirmCallback = null; // Reset callback
    });

    // NEW: Handler untuk tombol Tidak pada konfirmasi modal
    confirmNoBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('show'); // Sembunyikan modal
        confirmCallback = null;
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
                } else if (containerElement === favoriteProductsList) {
                    noResultsElement.textContent = "Anda belum menambahkan produk ke favorit.";
                }
            } else {
                noResultsElement.style.display = 'none';
                productsToRender.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('product-card');
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p class="price">${formatRupiah(getPriceBySize(product.basePrice, 'M'))}</p>
                            <div class="size-options" data-product-id="${product.id}">
                                ${product.sizes.map(size => `<span class="size-option" data-size="${size}">${size}</span>`).join('')}
                            </div>
                            <div class="product-actions">
                                <button class="btn add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> Tambah ke Keranjang</button>
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
                        const parentSizes = e.target.closest('.product-card').querySelector('.size-options');
                        parentSizes.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                        e.target.classList.add('selected');
                    });
                });

                // Event listener untuk tombol Add to Cart
                containerElement.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.id;
                        const selectedSizeElement = e.target.closest('.product-card').querySelector('.size-option.selected');

                        if (!selectedSizeElement) {
                            showToast("Mohon pilih ukuran baju terlebih dahulu!", "warning", "exclamation-triangle");
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
            currentPageSpan.textContent = `Hasil Pencarian: "${searchTerm}"`; // Update breadcrumbs
        } else {
            document.getElementById('baju-hitam').style.display = 'block';
            document.getElementById('baju-putih').style.display = 'block';
            allCollectionsTitle.textContent = "Semua Koleksi";
            currentPageSpan.textContent = "Koleksi"; // Update breadcrumbs
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

        const price = getPriceBySize(product.basePrice, size);
        const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity++;
            showToast(`Kuantitas ${product.name} (${size}) diperbarui di keranjang!`, "info", "info-circle");
        } else {
            cart.push({ id: product.id, name: product.name, image: product.image, price: price, size: size, quantity: 1 });
            showToast(`${product.name} (${size}) ditambahkan ke keranjang!`, "success", "check-circle");
        }
        saveCart();
        renderCart();
    };

    const updateQuantity = (productId, size, change) => {
        const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);
        if (itemIndex > -1) {
            if (cart[itemIndex].quantity + change <= 0) {
                // Tampilkan modal konfirmasi sebelum menghapus
                showConfirmationModal(`Anda yakin ingin menghapus "${cart[itemIndex].name} (${cart[itemIndex].size})" dari keranjang?`, () => {
                    const removedItemName = cart[itemIndex].name; // Simpan nama sebelum dihapus
                    const removedItemSize = cart[itemIndex].size; // Simpan ukuran sebelum dihapus
                    cart.splice(itemIndex, 1);
                    saveCart();
                    renderCart();
                    showToast(`"${removedItemName} (${removedItemSize})" berhasil dihapus dari keranjang.`, "success", "trash-alt");
                });
            } else {
                cart[itemIndex].quantity += change;
                saveCart();
                renderCart();
                showToast(`Kuantitas "${cart[itemIndex].name} (${cart[itemIndex].size})" diubah.`, "info", "sync-alt");
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
            // Reset checkout steps if cart is empty
            currentStep = 1;
            updateCheckoutFormStep();
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
        updateOrderSummary(); // Update order summary on cart change
    };

    // --- Checkout Form Multi-Step Logic ---
    const updateCheckoutFormStep = () => {
        formSections.forEach((section, index) => {
            if (index + 1 === currentStep) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        checkoutProgressSteps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === currentStep) {
                step.classList.add('active');
            }
        });

        // Scroll to the top of the form container when step changes
        checkoutFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Update order summary if on summary step
        if (currentStep === 3) {
            updateOrderSummary();
        }
    };

    const validateStep1 = () => {
        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const customerAddress = document.getElementById('customer-address').value.trim();

        if (!customerName || !customerPhone || !customerAddress) {
            showToast("Harap lengkapi semua informasi kontak dan alamat!", "error", "times-circle");
            return false;
        }
        const phoneRegex = /^[0-9]{10,15}$/; 
        if (!phoneRegex.test(customerPhone)) {
            showToast("Nomor WhatsApp tidak valid. Harap masukkan antara 10 hingga 15 digit angka saja.", "error", "exclamation-circle");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const expeditionMethod = document.getElementById('expedition-method').value;
        if (!expeditionMethod) {
            showToast("Harap pilih metode ekspedisi!", "error", "times-circle");
            return false;
        }
        return true;
    };

    nextToExpeditionBtn.addEventListener('click', () => {
        if (validateStep1()) {
            currentStep = 2;
            updateCheckoutFormStep();
        }
    });

    prevToContactBtn.addEventListener('click', () => {
        currentStep = 1;
        updateCheckoutFormStep();
    });

    nextToSummaryBtn.addEventListener('click', () => {
        if (validateStep2()) {
            currentStep = 3;
            updateCheckoutFormStep();
        }
    });

    prevToExpeditionSummaryBtn.addEventListener('click', () => {
        currentStep = 2;
        updateCheckoutFormStep();
    });

    checkoutProgressSteps.forEach(step => {
        step.addEventListener('click', (e) => {
            const stepNumber = parseInt(e.currentTarget.dataset.step);
            if (stepNumber < currentStep) { // Allow going back to previous steps
                currentStep = stepNumber;
                updateCheckoutFormStep();
            } else if (stepNumber === currentStep + 1) { // Allow going to next step if current is valid
                if (currentStep === 1 && validateStep1()) {
                    currentStep = stepNumber;
                    updateCheckoutFormStep();
                } else if (currentStep === 2 && validateStep2()) {
                    currentStep = stepNumber;
                    updateCheckoutFormStep();
                }
            } else if (stepNumber === currentStep) {
                // If clicked on current step, just re-render (useful for re-validation)
                updateCheckoutFormStep();
            }
        });
    });

    const updateOrderSummary = () => {
        const customerName = document.getElementById('customer-name').value || 'Belum diisi';
        const customerPhone = document.getElementById('customer-phone').value || 'Belum diisi';
        const customerAddress = document.getElementById('customer-address').value || 'Belum diisi';
        const expeditionMethod = document.getElementById('expedition-method').value || 'Belum dipilih';

        const { subtotal, discount, total } = calculateCartTotals();

        let summaryHtml = `
            <p><strong>Nama:</strong> <span class="value">${customerName}</span></p>
            <p><strong>No. WhatsApp:</strong> <span class="value">${customerPhone}</span></p>
            <p><strong>Alamat:</strong> <span class="value">${customerAddress}</span></p>
            <p><strong>Ekspedisi:</strong> <span class="value">${expeditionMethod.toUpperCase().replace('-', ' ')}</span></p>
            <br>
            <p><strong>Subtotal Produk:</strong> <span class="value">${formatRupiah(subtotal)}</span></p>
            <p><strong>Diskon (2% untuk >= 5 item):</strong> <span class="value">${formatRupiah(discount)}</span></p>
        `;

        cart.forEach(item => {
            summaryHtml += `<p><strong>${item.name} (${item.size}) x ${item.quantity}:</strong> <span class="value">${formatRupiah(item.price * item.quantity)}</span></p>`;
        });

        summaryHtml += `
            <p><strong>Total Pembayaran:</strong> <span class="value">${formatRupiah(total)}</span></p>
        `;
        orderSummaryDetails.innerHTML = summaryHtml;
    };


    checkoutBtn.addEventListener('click', () => {
        checkoutFormContainer.style.display = 'block';
        checkoutBtn.style.display = 'none'; // Sembunyikan tombol checkout setelah form muncul
        currentStep = 1; // Pastikan mulai dari langkah pertama
        updateCheckoutFormStep();
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateStep1() || !validateStep2()) {
            showToast("Harap lengkapi informasi yang diperlukan pada langkah sebelumnya.", "error", "exclamation-triangle");
            return;
        }

        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerAddress = document.getElementById('customer-address').value;
        const expeditionMethod = document.getElementById('expedition-method').value;
        
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
        showToast("Pesanan Anda telah berhasil dibuat! Kami akan menghubungi Anda melalui WhatsApp.", "success", "paper-plane");
    });


    // --- Quick View Modal Logic ---
    const openQuickViewModal = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Populate modal content
        modalBody.querySelector('img').src = product.image;
        modalBody.querySelector('img').alt = product.name;
        modalProductName.textContent = product.name;
        modalProductDescription.textContent = product.description;
        modalProductPrice.textContent = formatRupiah(getPriceBySize(product.basePrice, 'M')); // Default to M size price

        // Render size options in modal
        modalSizeOptions.innerHTML = product.sizes.map(size => 
            `<span class="size-option" data-size="${size}">${size}</span>`
        ).join('');

        // Event listener for modal size options
        modalSizeOptions.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                modalSizeOptions.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
                // Update price based on selected size
                modalProductPrice.textContent = formatRupiah(getPriceBySize(product.basePrice, e.target.dataset.size));
            });
        });

        // Set data-id for Add to Cart button in modal
        modalAddToCartBtn.dataset.id = productId;

        // Update favorite button in modal
        const isFavorited = favorites.some(favId => favId === productId);
        if (isFavorited) {
            modalAddToFavoriteBtn.classList.add('favorited');
            modalAddToFavoriteBtn.querySelector('i').classList.replace('far', 'fas');
            modalAddToFavoriteBtn.querySelector('i').classList.add('fa-heart');
            modalAddToFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Hapus dari Favorit';
        } else {
            modalAddToFavoriteBtn.classList.remove('favorited');
            modalAddToFavoriteBtn.querySelector('i').classList.replace('fas', 'far');
            modalAddToFavoriteBtn.querySelector('i').classList.add('fa-heart');
            modalAddToFavoriteBtn.innerHTML = '<i class="far fa-heart"></i> Tambah ke Favorit';
        }
        modalAddToFavoriteBtn.dataset.id = productId; // Set data-id for modal favorite button

        // Display the modal
        quickViewModal.classList.add('show');
    };

    // Close Modal Event Listener
    closeModalButton.addEventListener('click', () => {
        quickViewModal.classList.remove('show');
    });

    window.addEventListener('click', (event) => {
        if (event.target == quickViewModal) {
            quickViewModal.classList.remove('show');
        }
    });

    // Add to Cart from Modal
    modalAddToCartBtn.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        const selectedSizeElement = modalSizeOptions.querySelector('.size-option.selected');

        if (!selectedSizeElement) {
            showToast("Mohon pilih ukuran baju terlebih dahulu!", "warning", "exclamation-triangle");
            return;
        }
        const selectedSize = selectedSizeElement.dataset.size;
        addToCart(productId, selectedSize);
        // No need to close modal, user might want to add more with different sizes
        // showToast feedback is enough
    });

    // Add to Favorite from Modal
    modalAddToFavoriteBtn.addEventListener('click', (e) => {
        const productId = e.target.dataset.id || e.target.closest('button').dataset.id;
        toggleFavorite(productId, e.target.closest('button'));
    });


    // --- Favorit Logic ---
    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    const toggleFavorite = (productId, buttonElement) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const index = favorites.indexOf(productId);
        if (index > -1) {
            favorites.splice(index, 1);
            showToast(`${product.name} dihapus dari favorit.`, "info", "minus-circle");
        } else {
            favorites.push(productId);
            showToast(`${product.name} ditambahkan ke favorit!`, "success", "heart");
        }
        saveFavorites();
        renderFavorites();
        updateFavoriteButtons(); // Update all favorite buttons on the page
    };

    const renderFavorites = () => {
        favoriteProductsList.innerHTML = '';
        const favoriteProducts = products.filter(p => favorites.includes(p.id));

        if (favoriteProducts.length === 0) {
            emptyFavoritesMessage.style.display = 'block';
        } else {
            emptyFavoritesMessage.style.display = 'none';
            renderProductsInContainer(favoriteProducts, favoriteProductsList, emptyFavoritesMessage, true); // Use renderProductsInContainer
        }
        favoriteCountSpan.textContent = favorites.length;
    };

    const updateFavoriteButtons = () => {
        document.querySelectorAll('.add-to-favorite').forEach(button => {
            const productId = button.dataset.id;
            if (favorites.includes(productId)) {
                button.classList.add('favorited');
                button.querySelector('i').classList.replace('far', 'fas'); // Ganti ikon menjadi solid
            } else {
                button.classList.remove('favorited');
                button.querySelector('i').classList.replace('fas', 'far'); // Ganti ikon menjadi outline
            }
        });
        // Also update the modal favorite button if it's open and for the same product
        if (quickViewModal.classList.contains('show') && modalAddToFavoriteBtn.dataset.id === modalProductName.dataset.productId) {
            const productId = modalAddToFavoriteBtn.dataset.id;
            if (favorites.includes(productId)) {
                modalAddToFavoriteBtn.classList.add('favorited');
                modalAddToFavoriteBtn.querySelector('i').classList.replace('far', 'fas');
                modalAddToFavoriteBtn.innerHTML = '<i class="fas fa-heart"></i> Hapus dari Favorit';
            } else {
                modalAddToFavoriteBtn.classList.remove('favorited');
                modalAddToFavoriteBtn.querySelector('i').classList.replace('fas', 'far');
                modalAddToFavoriteBtn.innerHTML = '<i class="far fa-heart"></i> Tambah ke Favorit';
            }
        }
    };


    // --- Scroll Events for Back to Top and Section Animations & Sticky Header ---
    const sections = document.querySelectorAll('section.animated-section');
    const header = document.querySelector('header');

    const checkScroll = () => {
        // Back to Top button
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }

        // Section animations
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const screenHeight = window.innerHeight;
            if (sectionTop < screenHeight * 0.75) { // When 75% of section is visible
                section.classList.add('visible');
            } else {
                section.classList.remove('visible'); // Allow re-animation on scroll up
            }
        });

        // Sticky Header Effect
        if (window.scrollY > header.offsetHeight / 2) { // Add scrolled class after scrolling past half of header height
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update active navigation link and breadcrumbs based on scroll position
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - document.querySelector('.breadcrumbs').offsetHeight;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
                if (currentSectionId === 'keranjang' || currentSectionId === 'favorit') {
                    // Special handling for cart/favorite links as they don't have standard section titles
                    currentPageSpan.textContent = link.textContent.trim().split(' ')[0]; // Take only the word "Keranjang" or "Favorit"
                } else {
                    const sectionTitle = document.querySelector(`#${currentSectionId} h2`) ? document.querySelector(`#${currentSectionId} h2`).textContent : '';
                    currentPageSpan.textContent = sectionTitle.replace('Semua ', '').replace('Koleksi ', ''); // Clean up title for breadcrumbs
                }
            }
        });

        // Special handling for hero section or when at the very top
        if (window.scrollY < document.getElementById('koleksi').offsetTop - header.offsetHeight - document.querySelector('.breadcrumbs').offsetHeight) {
             document.querySelector('nav ul li a[href="#koleksi"]').classList.add('active');
             currentPageSpan.textContent = "Home"; // Or "Koleksi" as default
        }
    };

    window.addEventListener('scroll', checkScroll);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initialize section visibility on load
    checkScroll();

    // Event listener for smooth scrolling on navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    const offset = header.offsetHeight + document.querySelector('.breadcrumbs').offsetHeight + 20; // Add some extra padding
                    const bodyRect = body.getBoundingClientRect().top;
                    const elementRect = targetSection.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active class immediately on click
                    navLinks.forEach(nav => nav.classList.remove('active'));
                    this.classList.add('active');

                    // Update breadcrumbs immediately
                    if (targetId === 'keranjang' || targetId === 'favorit') {
                        currentPageSpan.textContent = this.textContent.trim().split(' ')[0];
                    } else {
                        const sectionTitle = document.querySelector(`#${targetId} h2`) ? document.querySelector(`#${targetId} h2`).textContent : '';
                        currentPageSpan.textContent = sectionTitle.replace('Semua ', '').replace('Koleksi ', '');
                    }
                }
            }
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