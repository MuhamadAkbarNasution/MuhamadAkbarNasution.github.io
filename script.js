document.addEventListener('DOMContentLoaded', () => {
    // Dummy Data Produk
    const products = [
        {
            id: 'baju-001',
            name: 'Skeleton',
            image: 'Skeleton.jpg',
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'putih'
        },
        {
            id: 'baju-002',
            name: 'Dog and éclipse',
            image: 'Dog.jpg',
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS','S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
        {
            id: 'baju-003',
            name: 'Travis Scoot',
            image: 'Travis scoot.jpg',
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
        {
            id: 'baju-004',
            name: 'Person',
            image: 'Person.jpg',
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
    ];

    // Informasi Penjual
    const sellerInfo = {
        name: "Luxuliver Official",
        address: "Srengseng Sawah, Kel. Srengseng Sawah, Kec. Jagakarsa, Kota Jakarta Selatan, DKI Jakarta, 12640",
        phone: "+62 852-1819-7546",
        email: "info@luxuliver.com",
        instagram: "https://www.instagram.com/luxuliver",
        whatsappAdmin: "6287871420482"
    };

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

    // Confirmation Modal Elements
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');

    // Toast Container
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // =====================================================
    // FITUR TAMBAHAN - DEKLARASI FUNGSI BARU
    // =====================================================
    
    // 1. Fungsi Update Breadcrumbs
    function updateBreadcrumbs() {
        const breadcrumbs = document.querySelector('.breadcrumbs ul');
        if (!breadcrumbs) return;
        
        const currentHash = window.location.hash || '#koleksi';
        const sectionNames = {
            '#koleksi': 'Semua Koleksi',
            '#baju-hitam': 'Baju Hitam',
            '#baju-putih': 'Baju Putih',
            '#keranjang': 'Keranjang Belanja',
            '#favorit': 'Produk Favorit'
        };
        
        const currentPage = sectionNames[currentHash] || 'Koleksi';
        
        breadcrumbs.innerHTML = `
            <li><a href="#">Home</a></li>
            <li class="current-page">${currentPage}</li>
        `;
    }

    // 2. Fungsi Highlight Navigasi Aktif
    function highlightActiveNav() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentHash = window.location.hash || '#koleksi';
        
        navLinks.forEach(link => {
            link.classList.remove('active-category');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active-category');
            }
        });
    }

    // 3. Fungsi Update Progress Bar Checkout
    function updateCheckoutProgress() {
        const steps = document.querySelectorAll('.checkout-progress-step');
        if (!steps.length) return;
        
        steps.forEach(step => step.classList.remove('completed', 'active'));
        
        // Step 1 selalu aktif di halaman keranjang
        if (steps[0]) steps[0].classList.add('completed');
        
        // Step 2 aktif jika form checkout terbuka
        if (checkoutFormContainer.style.display !== 'none' && steps[1]) {
            steps[1].classList.add('active');
        }
    }

    // 4. Fungsi Konfirmasi Add to Cart Visual
    function showAddToCartConfirmation(product) {
        const confirmation = document.getElementById('add-to-cart-confirmation');
        const img = document.getElementById('confirmation-product-image');
        const name = document.getElementById('confirmation-product-name');
        
        img.src = product.image;
        img.alt = product.name;
        name.textContent = `${product.name} telah ditambahkan ke keranjang Anda`;
        
        confirmation.classList.add('show');
        
        document.getElementById('continue-shopping').addEventListener('click', () => {
            confirmation.classList.remove('show');
        }, { once: true });
        
        setTimeout(() => {
            if (confirmation.classList.contains('show')) {
                confirmation.classList.remove('show');
            }
        }, 5000);
    }

    // 5. Fungsi Sticky Header
    function initStickyHeader() {
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // =====================================================
    // INTEGRASI DENGAN KODE YANG SUDAH ADA
    // (Modifikasi fungsi yang sudah ada)
    // =====================================================

    // A. Modifikasi fungsi addToCart asli
    const originalAddToCart = addToCart;
    function addToCart(productId, size) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const price = getPriceBySize(product.basePrice, size);
        const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === size);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity++;
            showToast(`Kuantitas ${product.name} (${size}) diperbarui di keranjang!`, "info");
        } else {
            cart.push({ 
                id: product.id, 
                name: product.name, 
                image: product.image, 
                price: price, 
                size: size, 
                quantity: 1 
            });
            showAddToCartConfirmation(product);
            showToast(`${product.name} (${size}) ditambahkan ke keranjang!`, "success");
        }
        saveCart();
        renderCart();
    }

    // B. Modifikasi fungsi renderCart asli
    const originalRenderCart = renderCart;
    function renderCart() {
        cartItemsContainer.innerHTML = '';
        const { subtotal, discount, total, totalItems } = calculateCartTotals();

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            checkoutBtn.style.display = 'none';
            checkoutFormContainer.style.display = 'none';
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
                        <p class="price">${formatRupiah(item.price)}</p>
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
        
        // Update progress bar (fitur tambahan)
        updateCheckoutProgress();
    }

    // =====================================================
    // INISIALISASI FITUR TAMBAHAN
    // =====================================================
    
    function initAdditionalFeatures() {
        // 1. Aktifkan sticky header
        initStickyHeader();
        
        // 2. Set breadcrumbs dan highlight nav awal
        updateBreadcrumbs();
        highlightActiveNav();
        
        // 3. Set progress bar awal
        updateCheckoutProgress();
        
        // 4. Event listener untuk perubahan URL
        window.addEventListener('hashchange', () => {
            updateBreadcrumbs();
            highlightActiveNav();
        });
        
        // 5. Event listener untuk tombol checkout
        checkoutBtn.addEventListener('click', updateCheckoutProgress);
    }

    // =====================================================
    // KODE ASLI ANDA - FUNGSI BANTUAN
    // =====================================================
    
    // --- Fungsi Bantuan ---
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const getPriceBySize = (basePrice, size) => {
        if (size && size.toUpperCase() === 'XL') {
            return basePrice + 5000;
        }
        return basePrice;
    };

    // Fungsi untuk menampilkan Toast/Snackbar Notification
    const showToast = (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.classList.add('toast-notification', type);
        toast.textContent = message;
        toastContainer.appendChild(toast);

        void toast.offsetWidth;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    };

    // Render Skeleton Loader
    const renderSkeletonLoaders = (containerElement, count) => {
        containerElement.innerHTML = '';
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

    // =====================================================
    // KODE ASLI ANDA - FUNGSI UTAMA
    // =====================================================
    
    // --- Render Produk ---
    const renderProductsInContainer = (productsToRender, containerElement, noResultsElement, initialLoad = false) => {
        if (!initialLoad && productsToRender.length > 0) {
             const skeletonCount = Math.min(productsToRender.length, 8);
             renderSkeletonLoaders(containerElement, skeletonCount);
        }
       
        setTimeout(() => {
            containerElement.innerHTML = '';
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
            updateFavoriteButtons();
        }, initialLoad ? 0 : 700);
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

    // =====================================================
    // KODE ASLI ANDA - EVENT LISTENER & FUNGSI UTAMA
    // =====================================================
    
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
    const updateQuantity = (productId, size, change) => {
        const itemIndex = cart.findIndex(item => item.id === productId && item.size === size);
        if (itemIndex > -1) {
            if (cart[itemIndex].quantity + change <= 0) {
                showConfirmationModal(`Anda yakin ingin menghapus "${cart[itemIndex].name} (${cart[itemIndex].size})" dari keranjang?`, () => {
                    const removedItemName = cart[itemIndex].name;
                    const removedItemSize = cart[itemIndex].size;
                    cart.splice(itemIndex, 1);
                    saveCart();
                    renderCart();
                    showToast(`"${removedItemName} (${removedItemSize})" berhasil dihapus dari keranjang.`, "success");
                });
            } else {
                cart[itemIndex].quantity += change;
                saveCart();
                renderCart();
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
            discount = subtotal * 0.02;
        }

        const total = subtotal - discount;
        return { subtotal, discount, total, totalItems };
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // --- Checkout Form ---
    checkoutBtn.addEventListener('click', () => {
        checkoutFormContainer.style.display = 'block';
        checkoutBtn.style.display = 'none';
        checkoutFormContainer.scrollIntoView({ behavior: 'smooth' });
        updateCheckoutProgress(); // Update progress bar
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const customerName = document.getElementById('customer-name').value;
        const customerPhone = document.getElementById('customer-phone').value;
        const customerAddress = document.getElementById('customer-address').value;
        const expeditionMethod = document.getElementById('expedition-method').value;

        const phoneRegex = /^[0-9]{10,15}$/; 
        if (!phoneRegex.test(customerPhone)) {
            showToast("Nomor WhatsApp tidak valid. Harap masukkan antara 10 hingga 15 digit angka saja.", "error");
            return;
        }
        
        const { total } = calculateCartTotals();
        const orderId = `LXVR-${orderCounter++}`;
        localStorage.setItem('orderCounter', orderCounter);

        let orderDetails = `*Order Baru dari Luxuliver Shop*\n\n`;
        orderDetails += `*ID Pesanan:* ${orderId}\n`;
        orderDetails += `*Nama Pelanggan:* ${customerName}\n`;
        orderDetails += `*Telepon:* ${customerPhone}\n`;
        orderDetails += `*Alamat:* ${customerAddress}\n`;
        orderDetails += `*Metode Ekspedisi:* ${expeditionMethod.toUpperCase().replace('-', ' ')}\n\n`;
        orderDetails += `*Detail Pesanan:*\n`;

        cart.forEach(item => {
            orderDetails += `- ${item.name} (${item.size}) x ${item.quantity} = ${formatRupiah(item.price * item.quantity)}\n`;
        });

        orderDetails += `\n*Total Pembayaran:* ${formatRupiah(total)}\n\n`;
        orderDetails += `Terima kasih telah berbelanja di Luxuliver Shop!`;

        const whatsappUrl = `https://wa.me/${sellerInfo.whatsappAdmin}?text=${encodeURIComponent(orderDetails)}`;
        window.open(whatsappUrl, '_blank');

        cart = [];
        saveCart();
        renderCart();
        checkoutForm.reset();
        checkoutFormContainer.style.display = 'none';
        showToast("Pesanan Anda telah berhasil dibuat! Kami akan menghubungi Anda melalui WhatsApp.", "success");
    });

    // --- Quick View Modal Logic ---
    const openQuickViewModal = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        modalBody.querySelector('img').src = product.image;
        modalBody.querySelector('img').alt = product.name;
        document.getElementById('modal-product-name').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-product-price').textContent = formatRupiah(getPriceBySize(product.basePrice, 'M'));
        modalAddToCartBtn.dataset.id = product.id;

        modalSizeOptions.innerHTML = product.sizes.map(size => `<span class="size-option" data-size="${size}">${size}</span>`).join('');
        modalSizeOptions.querySelectorAll('.size-option').forEach(option => {
            option.addEventListener('click', (e) => {
                modalSizeOptions.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                e.target.classList.add('selected');
                document.getElementById('modal-product-price').textContent = formatRupiah(getPriceBySize(product.basePrice, e.target.dataset.size));
            });
        });

        const defaultSizeOption = modalSizeOptions.querySelector('.size-option[data-size="M"]') || modalSizeOptions.querySelector('.size-option');
        if (defaultSizeOption) {
            defaultSizeOption.classList.add('selected');
            document.getElementById('modal-product-price').textContent = formatRupiah(getPriceBySize(product.basePrice, defaultSizeOption.dataset.size));
        }

        const modalAddtoFavoriteBtn = quickViewModal.querySelector('.modal-add-to-favorite');
        modalAddtoFavoriteBtn.dataset.id = product.id;
        updateFavoriteButtons();

        quickViewModal.classList.add('show');
        body.classList.add('no-scroll');
    };

    closeModalButton.addEventListener('click', () => {
        quickViewModal.classList.remove('show');
        body.classList.remove('no-scroll');
    });

    window.addEventListener('click', (e) => {
        if (e.target === quickViewModal) {
            quickViewModal.classList.remove('show');
            body.classList.remove('no-scroll');
        }
    });

    modalAddToCartBtn.addEventListener('click', (e) => {
        const productId = e.target.dataset.id;
        const selectedSizeElement = modalSizeOptions.querySelector('.size-option.selected');

        if (!selectedSizeElement) {
            showToast("Mohon pilih ukuran baju terlebih dahulu!", "warning");
            return;
        }
        const selectedSize = selectedSizeElement.dataset.size;
        addToCart(productId, selectedSize);

        const originalText = modalAddToCartBtn.textContent;
        modalAddToCartBtn.textContent = "✅ Ditambahkan!";
        modalAddToCartBtn.classList.add('added');
        modalAddToCartBtn.disabled = true;

        setTimeout(() => {
            modalAddToCartBtn.textContent = originalText;
            modalAddToCartBtn.classList.remove('added');
            modalAddToCartBtn.disabled = false;
        }, 1500);
    });

    quickViewModal.querySelector('.modal-add-to-favorite').addEventListener('click', (e) => {
        const modalProductId = e.target.dataset.id || e.target.closest('button').dataset.id;
        toggleFavorite(modalProductId, e.target.closest('button'));
    });

    // --- BACK TO TOP BUTTON ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Skeleton Loader Animation & Scroll Reveal ---
    const animateOnScroll = () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // --- FUNGSI UNTUK FAVORIT ---
    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    const toggleFavorite = (productId, buttonElement = null) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const favoriteIndex = favorites.findIndex(item => item.id === productId);

        if (favoriteIndex > -1) {
            favorites.splice(favoriteIndex, 1);
            showToast(`"${product.name}" dihapus dari favorit.`, "info");
            if (buttonElement) {
                buttonElement.classList.remove('favorited');
                buttonElement.querySelector('i').classList.remove('fas');
                buttonElement.querySelector('i').classList.add('far');
            }
        } else {
            favorites.push({ id: product.id, name: product.name, image: product.image, basePrice: product.basePrice, sizes: product.sizes }); 
            showToast(`"${product.name}" ditambahkan ke favorit!`, "success");
            if (buttonElement) {
                buttonElement.classList.add('favorited');
                buttonElement.querySelector('i').classList.remove('far');
                buttonElement.querySelector('i').classList.add('fas');
            }
        }
        saveFavorites();
        renderFavorites();
        updateFavoriteButtons();
    };

    const renderFavorites = () => {
        favoriteProductsList.innerHTML = '';
        if (favorites.length === 0) {
            emptyFavoritesMessage.style.display = 'block';
        } else {
            emptyFavoritesMessage.style.display = 'none';
            favorites.forEach(favProduct => {
                const product = products.find(p => p.id === favProduct.id);
                if (!product) return;

                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">${formatRupiah(product.basePrice)}</p>
                        <div class="size-options" data-product-id="${product.id}">
                            ${product.sizes.map(size => `<span class="size-option" data-size="${size}">${size}</span>`).join('')}
                        </div>
                        <div class="product-actions">
                            <button class="btn add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> Tambah ke Keranjang</button>
                            <button class="btn quick-view-btn" data-id="${product.id}"><i class="fas fa-eye"></i> Quick View</button>
                            <button class="btn remove-from-favorite btn-danger" data-id="${product.id}"><i class="fas fa-heart-broken"></i> Hapus</button>
                        </div>
                    </div>
                `;
                favoriteProductsList.appendChild(productCard);
            });

            favoriteProductsList.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    const productElement = e.target.closest('.product-card');
                    const selectedSizeElement = productElement.querySelector('.size-option.selected');
                    let selectedSize = 'M';

                    if (selectedSizeElement) {
                        selectedSize = selectedSizeElement.dataset.size;
                    } else if (product.sizes && product.sizes.length > 0) {
                        selectedSize = product.sizes[0];
                    }
                    
                    addToCart(productId, selectedSize);
                });
            });
            
            favoriteProductsList.querySelectorAll('.size-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const parentSizes = e.target.closest('.product-card').querySelector('.size-options');
                    parentSizes.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
                    e.target.classList.add('selected');
                });
            });

            favoriteProductsList.querySelectorAll('.quick-view-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    openQuickViewModal(productId);
                });
            });

            favoriteProductsList.querySelectorAll('.remove-from-favorite').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.dataset.id;
                    toggleFavorite(productId);
                });
            });
        }
        favoriteCountSpan.textContent = favorites.length;
    };

    const updateFavoriteButtons = () => {
        document.querySelectorAll('.add-to-favorite').forEach(button => {
            const productId = button.dataset.id;
            if (favorites.some(fav => fav.id === productId)) {
                button.classList.add('favorited');
                button.querySelector('i').classList.remove('far');
                button.querySelector('i').classList.add('fas');
            } else {
                button.classList.remove('favorited');
                button.querySelector('i').classList.remove('fas');
                button.querySelector('i').classList.add('far');
            }
        });
        
        const modalFavButton = quickViewModal.querySelector('.modal-add-to-favorite');
        if (modalFavButton) {
            const productId = modalFavButton.dataset.id;
            if (favorites.some(fav => fav.id === productId)) {
                modalFavButton.classList.add('favorited');
                modalFavButton.querySelector('i').classList.remove('far');
                modalFavButton.querySelector('i').classList.add('fas');
            } else {
                modalFavButton.classList.remove('favorited');
                modalFavButton.querySelector('i').classList.remove('fas');
                modalFavButton.querySelector('i').classList.add('far');
            }
        }
    };

    // Confirmation Modal
    let confirmCallback = null;
    const showConfirmationModal = (message, callback) => {
        confirmMessage.textContent = message;
        confirmationModal.classList.add('show');
        body.classList.add('no-scroll');
        confirmCallback = callback;
    };

    confirmYesBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback();
        }
        confirmationModal.classList.remove('show');
        body.classList.remove('no-scroll');
        confirmCallback = null;
    });

    confirmNoBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('show');
        body.classList.remove('no-scroll');
        confirmCallback = null;
        showToast("Penghapusan dibatalkan.", "info");
    });

    window.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.classList.remove('show');
            body.classList.remove('no-scroll');
            confirmCallback = null;
        }
    });

    // =====================================================
    // INISIALISASI APLIKASI - DENGAN FITUR TAMBAHAN
    // =====================================================
    const initializeApp = () => {
        renderSkeletonLoaders(productList, 8);
        renderSkeletonLoaders(blackClothingList, 2);
        renderSkeletonLoaders(whiteClothingList, 2);

        setTimeout(() => {
            renderAllProductShowcases(false);
            renderCart();
            renderFavorites();
            currentYearSpan.textContent = new Date().getFullYear();

            sellerAddressSpan.textContent = sellerInfo.address;
            sellerPhoneSpan.textContent = sellerInfo.phone;
            sellerEmailSpan.textContent = sellerInfo.email;

            document.querySelector('nav ul li a[href*="instagram.com"]').href = sellerInfo.instagram;
            document.querySelector('footer a[href*="instagram.com"]').href = sellerInfo.instagram;

            body.classList.remove('no-scroll');
            
            // Inisialisasi fitur tambahan
            initAdditionalFeatures();
        }, 1500);
    };

    initializeApp();
});