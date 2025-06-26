document.addEventListener('DOMContentLoaded', () => {
    // Dummy Data Produk
    const products = [
        {
            id: 'baju-001',
            name: 'Skeleton',
            image: 'Skeleton.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'putih'
        },
        {
            id: 'baju-002',
            name: 'Dog and éclipse',
            image: 'Dog.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS','S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
        {
            id: 'baju-003',
            name: 'Travis Scoot',
            image: 'Travis scoot.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
        {
            id: 'baju-004',
            name: 'Person',
            image: 'Person.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'putih'
        },
        {
            id: 'baju-005',
            name: 'Cat',
            image: 'Cat.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
        {
            id: 'baju-006',
            name: 'Astronaut',
            image: 'Astronaut.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'putih'
        },
        {
            id: 'baju-007',
            name: 'Robot',
            image: 'Robot.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'hitam'
        },
        {
            id: 'baju-008',
            name: 'Rilakuma',
            image: 'Rilakuma.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'putih'
        },
        {
            id: 'baju-009',
            name: 'Panda',
            image: 'Panda.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'putih'
        },
        {
            id: 'baju-010',
            name: 'Butterfly',
            image: 'Butterfly.jpg', // Pastikan gambar ini ada di folder img/produk/
            description: 'T-Shirt paling nyaman dan bagus untuk dipakai setiap hari, cocok disemua musim.',
            basePrice: 95000,
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: 'putih'
        },
    ];

    // Elemen Global
    const body = document.body;
    const navLinks = document.querySelectorAll('nav a');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const backToTopBtn = document.getElementById('back-to-top');
    const productList = document.getElementById('product-list'); // Untuk koleksi utama
    const blackClothingList = document.getElementById('baju-hitam').querySelector('.product-grid'); // Untuk baju hitam
    const whiteClothingList = document.getElementById('baju-putih').querySelector('.product-grid'); // Untuk baju putih
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Shopping Cart & Favorites Elements
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPriceSpan = document.getElementById('cart-total-price');
    const cartCountSpan = document.getElementById('cart-count');
    const favoriteItemsContainer = document.getElementById('favorite-items');
    const favoriteCountSpan = document.getElementById('favorite-count');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    
    // Quick View Modal Elements
    const quickViewModal = document.getElementById('quick-view-modal');
    const closeButtons = document.querySelectorAll('.close-button'); // Untuk semua modal
    
    // Confirmation Modal Elements
    const confirmModal = document.getElementById('confirmation-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');
    let confirmCallback = null;

    // Footer Elements
    const currentYearSpan = document.getElementById('current-year');
    const sellerAddressSpan = document.getElementById('seller-address');
    const sellerPhoneSpan = document.getElementById('seller-phone');
    const sellerEmailSpan = document.getElementById('seller-email');

    // --- Helper Functions ---

    // Toggle Mobile Menu
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                // Close mobile menu after clicking a link
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            }
        });
    });

    // Show/Hide Back to Top Button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Scroll to Top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Format Price to IDR
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // --- Product Rendering & Filtering ---

    // Skeleton loader function (sesuai tampilan awal Anda)
    const renderSkeletonLoaders = (container, count) => {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeletonCard = document.createElement('div');
            skeletonCard.classList.add('product-card', 'skeleton-loader');
            skeletonCard.innerHTML = `
                <div class="skeleton-image"></div>
                <div class="skeleton-line title"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line price"></div>
                <div class="sizes">
                    <span class="skeleton-line size"></span>
                    <span class="skeleton-line size"></span>
                    <span class="skeleton-line size"></span>
                </div>
            `;
            container.appendChild(skeletonCard);
        }
    };

    // Render product cards (sesuai tampilan awal Anda)
    const renderProductShowcase = (container, productsToRender, isFiltered = false) => {
        container.innerHTML = ''; // Clear existing products or skeletons
        if (productsToRender.length === 0 && isFiltered) {
            container.innerHTML = '<p class="no-results">Tidak ada produk ditemukan untuk filter ini.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.dataset.id = product.id; // Penting untuk Quick View dan Add to Cart/Favorite
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img src="img/produk/${product.image}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="btn btn-secondary quick-view-btn" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                        <button class="btn add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn btn-secondary add-to-favorite" data-id="${product.id}">
                            <i class="far fa-heart"></i> Add to Favorite
                        </button>
                    </div>
                </div>
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <p class="price">${formatPrice(product.basePrice)}</p>
                <div class="sizes">
                    ${product.sizes.map(size => `<span class="size">${size}</span>`).join('')}
                </div>
            `;
            container.appendChild(productCard);
        });

        // Attach event listeners for Add to Cart, Add to Favorite, and Quick View
        // Pastikan ini dipanggil setiap kali produk dirender ulang
        container.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => handleAddToCart(e.currentTarget.dataset.id));
        });
        container.querySelectorAll('.add-to-favorite').forEach(button => {
            button.addEventListener('click', (e) => handleAddToFavorite(e.currentTarget.dataset.id));
        });
        container.querySelectorAll('.quick-view-btn').forEach(button => {
            button.addEventListener('click', (e) => openQuickViewModal(e.currentTarget.dataset.id));
        });
    };

    // Render all product showcases based on filters
    const renderAllProductShowcases = (isFiltered = false) => {
        // Render main collection
        renderProductShowcase(productList, products, isFiltered);

        // Render specific collections (e.g., for black and white clothing)
        const blackProducts = products.filter(p => p.color === 'hitam');
        renderProductShowcase(blackClothingList, blackProducts, isFiltered);

        const whiteProducts = products.filter(p => p.color === 'putih');
        renderProductShowcase(whiteClothingList, whiteProducts, isFiltered);
    };

    // Setup filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            let filteredProducts = [];
            if (filter === 'all') {
                filteredProducts = products;
            } else {
                filteredProducts = products.filter(product => product.color === filter);
            }
            renderProductShowcase(productList, filteredProducts, true); // Use productList for main filtering
        });
    });

    // --- Shopping Cart & Favorites Logic ---

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        renderCart();
    };

    const saveFavorites = () => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoriteCount();
        renderFavorites();
    };

    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
    };

    const updateFavoriteCount = () => {
        favoriteCountSpan.textContent = favorites.length;
    };

    const renderCart = () => {
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-message">Keranjang Anda kosong.</p>';
            checkoutBtn.style.display = 'none';
            checkoutForm.style.display = 'none';
        } else {
            let totalPrice = 0;
            cart.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product) {
                    const itemTotal = product.basePrice * item.quantity;
                    totalPrice += itemTotal;

                    const cartItemDiv = document.createElement('div');
                    cartItemDiv.classList.add('cart-item');
                    cartItemDiv.innerHTML = `
                        <img src="img/produk/${product.image}" alt="${product.name}">
                        <div class="item-details">
                            <h4>${product.name}</h4>
                            <p>Ukuran: ${item.size}</p>
                            <p>${formatPrice(product.basePrice)} per item</p>
                        </div>
                        <div class="item-quantity">
                            <button data-id="${item.productId}" data-size="${item.size}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button data-id="${item.productId}" data-size="${item.size}" data-action="increase">+</button>
                        </div>
                        <span class="item-price">${formatPrice(itemTotal)}</span>
                        <button class="remove-btn" data-id="${item.productId}" data-size="${item.size}"><i class="fas fa-trash"></i></button>
                    `;
                    cartItemsContainer.appendChild(cartItemDiv);
                }
            });
            cartTotalPriceSpan.textContent = formatPrice(totalPrice);
            checkoutBtn.style.display = 'block';
        }

        // Attach event listeners for quantity and remove buttons
        cartItemsContainer.querySelectorAll('.item-quantity button').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                const size = e.currentTarget.dataset.size;
                const action = e.currentTarget.dataset.action;
                const itemIndex = cart.findIndex(item => item.productId === productId && item.size === size);

                if (itemIndex > -1) {
                    if (action === 'increase') {
                        cart[itemIndex].quantity++;
                    } else if (action === 'decrease') {
                        cart[itemIndex].quantity--;
                        if (cart[itemIndex].quantity <= 0) {
                            showConfirmModal('Apakah Anda yakin ingin menghapus item ini dari keranjang?', () => {
                                cart.splice(itemIndex, 1);
                                saveCart();
                            });
                            return; // Stop further execution until confirmation
                        }
                    }
                    saveCart();
                }
            });
        });

        cartItemsContainer.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                const size = e.currentTarget.dataset.size;
                showConfirmModal('Apakah Anda yakin ingin menghapus item ini dari keranjang?', () => {
                    cart = cart.filter(item => !(item.productId === productId && item.size === size));
                    saveCart();
                });
            });
        });
    };

    const renderFavorites = () => {
        favoriteItemsContainer.innerHTML = '';
        if (favorites.length === 0) {
            favoriteItemsContainer.innerHTML = '<p class="empty-message">Daftar favorit Anda kosong.</p>';
        } else {
            favorites.forEach(favoriteId => {
                const product = products.find(p => p.id === favoriteId);
                if (product) {
                    const favoriteItemDiv = document.createElement('div');
                    favoriteItemDiv.classList.add('favorite-item');
                    favoriteItemDiv.innerHTML = `
                        <img src="img/produk/${product.image}" alt="${product.name}">
                        <div class="item-details">
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                            <p class="price">${formatPrice(product.basePrice)}</p>
                        </div>
                        <button class="remove-favorite-btn" data-id="${product.id}"><i class="fas fa-trash"></i> Hapus</button>
                    `;
                    favoriteItemsContainer.appendChild(favoriteItemDiv);
                }
            });
        }

        favoriteItemsContainer.querySelectorAll('.remove-favorite-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.currentTarget.dataset.id;
                showConfirmModal('Apakah Anda yakin ingin menghapus item ini dari favorit?', () => {
                    favorites = favorites.filter(id => id !== productId);
                    saveFavorites();
                });
            });
        });
    };

    const handleAddToCart = (productId, selectedSize = null) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        // Jika produk memiliki ukuran dan belum dipilih (dari Quick View)
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert('Silakan pilih ukuran terlebih dahulu.'); // Atau tampilkan UI pilihan ukuran
            return; // Hentikan eksekusi
        }

        const existingItemIndex = cart.findIndex(item => item.productId === productId && item.size === selectedSize);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity++;
        } else {
            cart.push({ productId, quantity: 1, size: selectedSize || 'One Size' });
        }
        saveCart();
        alert(`${product.name} (Ukuran: ${selectedSize || 'One Size'}) ditambahkan ke keranjang!`);
    };

    const handleAddToFavorite = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        if (!favorites.includes(productId)) {
            favorites.push(productId);
            saveFavorites();
            alert(`${product.name} ditambahkan ke favorit!`);
        } else {
            alert(`${product.name} sudah ada di favorit Anda.`);
        }
    };

    // --- Quick View Modal Logic ---

    // Fungsi untuk membuka modal Quick View
    const openQuickViewModal = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('modal-product-name').textContent = product.name;
            document.getElementById('modal-product-description').textContent = product.description;
            document.getElementById('modal-product-price').textContent = formatPrice(product.basePrice);

            const modalSizeOptions = document.getElementById('modal-size-options');
            modalSizeOptions.innerHTML = ''; // Bersihkan opsi ukuran sebelumnya
            let selectedSizeForModal = null; // Untuk melacak ukuran yang dipilih di modal

            if (product.sizes && product.sizes.length > 0) {
                product.sizes.forEach(size => {
                    const button = document.createElement('button');
                    button.classList.add('size-option');
                    button.textContent = size;
                    button.dataset.size = size;
                    button.addEventListener('click', () => {
                        // Hapus 'active' dari semua tombol ukuran
                        modalSizeOptions.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
                        // Tambahkan 'active' ke tombol yang diklik
                        button.classList.add('active');
                        selectedSizeForModal = size; // Simpan ukuran yang dipilih
                    });
                    modalSizeOptions.appendChild(button);
                });
            } else {
                modalSizeOptions.innerHTML = '<span class="size">One Size</span>'; // Tampilkan "One Size" jika tidak ada ukuran spesifik
            }


            // Update gambar modal
            const modalProductImage = quickViewModal.querySelector('.modal-body img');
            modalProductImage.src = `img/produk/${product.image}`;
            modalProductImage.alt = product.name;

            // Update data-id pada tombol add to cart dan add to favorite di modal
            const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');
            const modalAddToFavoriteBtn = document.querySelector('#quick-view-modal .modal-add-to-favorite');

            modalAddToCartBtn.dataset.id = product.id;
            modalAddToFavoriteBtn.dataset.id = product.id;

            // Pastikan event listener untuk tombol add to cart di modal
            modalAddToCartBtn.onclick = () => {
                if (product.sizes && product.sizes.length > 0 && !selectedSizeForModal) {
                    alert('Silakan pilih ukuran terlebih dahulu untuk menambahkan ke keranjang.');
                    return;
                }
                handleAddToCart(product.id, selectedSizeForModal || 'One Size'); // Kirim One Size jika tidak ada pilihan ukuran
                closeAllModals(); // Tutup modal setelah menambahkan ke keranjang
            };

            // Pastikan event listener untuk tombol add to favorite di modal
            modalAddToFavoriteBtn.onclick = () => {
                handleAddToFavorite(product.id);
                closeAllModals(); // Tutup modal setelah menambahkan ke favorit
            };


            quickViewModal.style.display = 'block'; // Menampilkan modal
            body.classList.add('no-scroll'); // Mencegah scroll pada body
        }
    };

    // Fungsi untuk menutup semua modal
    const closeAllModals = () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        body.classList.remove('no-scroll'); // Mengaktifkan scroll kembali
    };

    // Event listener untuk tombol tutup (X) pada semua modal
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals);
    });

    // Tutup modal jika klik di luar konten modal
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // --- Confirmation Modal Logic ---
    const showConfirmModal = (message, callback) => {
        confirmMessage.textContent = message;
        confirmModal.style.display = 'block';
        body.classList.add('no-scroll');
        confirmCallback = callback;
    };

    confirmYesBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback();
        }
        confirmModal.style.display = 'none';
        body.classList.remove('no-scroll');
        confirmCallback = null;
    });

    confirmNoBtn.addEventListener('click', () => {
        confirmModal.style.display = 'none';
        body.classList.remove('no-scroll');
        confirmCallback = null;
    });

    // --- Data Informasi Penjual (untuk footer dan link IG) ---
    const sellerInfo = {
        address: 'Jl. Merdeka No. 123, Jakarta Pusat',
        phone: '+62 812-3456-7890',
        email: 'info@luxuliver.com',
        instagram: 'https://www.instagram.com/luxuliver'
    };


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
            updateCartCount(); // Pastikan jumlah keranjang diperbarui di awal
            updateFavoriteCount(); // Pastikan jumlah favorit diperbarui di awal

            // Update tahun saat ini di footer
            if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

            // Update informasi penjual di footer
            if (sellerAddressSpan) sellerAddressSpan.textContent = sellerInfo.address;
            if (sellerPhoneSpan) sellerPhoneSpan.textContent = sellerInfo.phone;
            if (sellerEmailSpan) sellerEmailSpan.textContent = sellerInfo.email;

            // Update link Instagram di header dan footer
            const instagramLinkNav = document.querySelector('nav ul li a[href*="instagram.com"]');
            if (instagramLinkNav) instagramLinkNav.href = sellerInfo.instagram;
            const instagramLinkFooter = document.querySelector('footer a[href*="instagram.com"]');
            if (instagramLinkFooter) instagramLinkFooter.href = sellerInfo.instagram;

            // Hapus kelas no-scroll dari body setelah semua konten dimuat
            body.classList.remove('no-scroll');
        }, 1500); // Penundaan 1.5 detik untuk simulasi loading awal
    };

    initializeApp();
});