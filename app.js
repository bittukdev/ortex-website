document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Smart-Sticky Header Scroll visibility (Ortex.Web style)
    // ==========================================================================
    const siteHeader = document.querySelector('.header');
    let lastY = window.scrollY;
    const SOLID_AT = 8;
    const REVEAL_AT = 120;
    const DELTA = 6;

    const handleHeaderScroll = () => {
        if (!siteHeader) return;
        const y = window.scrollY;

        // Solidify to a frosted bar once scrolled
        if (y > SOLID_AT) {
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        // Hide on scroll-down and show on scroll-up
        if (Math.abs(y - lastY) > DELTA) {
            if (y > lastY && y > REVEAL_AT) {
                siteHeader.classList.add('nav-hidden');
            } else {
                siteHeader.classList.remove('nav-hidden');
            }
        }
        lastY = y;
    };

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    // Run initial scroll check
    handleHeaderScroll();

    // ==========================================================================
    // 2. Dynamic RollText Character Injector (Ortex.Web style)
    // ==========================================================================
    const injectRollTextAnimations = () => {
        const rollLinks = document.querySelectorAll('.roll-link');
        
        rollLinks.forEach(link => {
            const text = link.textContent.trim();
            if (!text) return;
            
            // Build the pixel-matching Keystone HTML structure
            link.innerHTML = `
                <span class="roll-sr">${text}</span>
                <span class="roll-text" aria-hidden="true">
                    ${Array.from(text).map((ch, i) => {
                        const charSpan = ch === " " ? "&nbsp;" : ch;
                        return `<span class="roll-char" style="--i: ${i}">${charSpan}</span>`;
                    }).join('')}
                </span>
            `;
        });
    };

    injectRollTextAnimations();

    // ==========================================================================
    // 3. Mobile Menu & Drawer Toggle
    // ==========================================================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMobileMenu = () => {
        if (!mobileMenuToggle || !mobileDrawer) return;
        mobileMenuToggle.classList.toggle('open');
        mobileDrawer.classList.toggle('open');
        document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer && mobileDrawer.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && mobileDrawer && mobileDrawer.classList.contains('open')) {
            toggleMobileMenu();
        }
    });

    // ==========================================================================
    // 4. Light / Dark Theme Management
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // ==========================================================================
    // 5. Navigation ScrollSpy & Active Indicator
    // ==========================================================================
    const navLinks = document.querySelectorAll('.nav-link:not(.admin-trigger)');
    const sections = document.querySelectorAll('section');

    const changeActiveLink = () => {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        
        navLinks.forEach((link) => link.classList.remove('active'));
        if (sections[index]) {
            const activeId = sections[index].getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', changeActiveLink);

    // ==========================================================================
    // 6. Product Tab Navigation
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active states
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Set current active
            btn.classList.add('active');
            const activeContent = document.getElementById(`${targetTab}-tab`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 7. Quick Inquiry Intercept
    // ==========================================================================
    const inquiryBtns = document.querySelectorAll('.product-inquiry-btn');
    const productSelect = document.getElementById('product');

    inquiryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.getAttribute('data-product');
            
            if (productSelect && productName) {
                productSelect.value = productName;
            }

            // Scroll smoothly to contact
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                // Focus on quantity to prompt input
                setTimeout(() => {
                    const qtyInput = document.getElementById('quantity');
                    if (qtyInput) qtyInput.focus();
                }, 800);
            }
        });
    });

    // ==========================================================================
    // 8. Interactive Live B2B Pricing Estimator Logic
    // ==========================================================================
    const estProductRadios = document.querySelectorAll('input[name="est-product"]');
    const estQtySlider = document.getElementById('est-qty-slider');
    const estQtyDisplay = document.getElementById('est-qty-display');
    const estBrandingSelect = document.getElementById('est-branding');
    const estFabricSelect = document.getElementById('est-fabric');

    const estPriceUnit = document.getElementById('est-price-unit');
    const estPriceSubtotal = document.getElementById('est-price-subtotal');
    const estDiscountPct = document.getElementById('est-discount-pct');
    const estPriceTotal = document.getElementById('est-price-total');
    const estApplyBtn = document.getElementById('est-apply-btn');

    const calculateEstimates = () => {
        if (!estQtySlider) return;

        const quantity = parseInt(estQtySlider.value);
        estQtyDisplay.textContent = quantity.toLocaleString();

        // Get selected product value
        let selectedProduct = 'tshirts';
        estProductRadios.forEach(radio => {
            if (radio.checked) selectedProduct = radio.value;
        });

        // 1. Base Prices
        let basePrice = 150; // Default T-Shirts
        if (selectedProduct === 'caps') basePrice = 80;
        else if (selectedProduct === 'apparel') basePrice = 120;

        // 2. Customization (Branding) addition
        let brandingAdd = 20; // Screen printing standard
        const brandingType = estBrandingSelect.value;
        if (brandingType === 'none') brandingAdd = 0;
        else if (brandingType === 'embroidery') brandingAdd = 40;
        else if (brandingType === 'sublimation') brandingAdd = 35;

        // 3. Material Weight / Quality addition
        let fabricAdd = 0; // Standard default
        const fabricType = estFabricSelect.value;

        if (fabricType === 'medium') {
            if (selectedProduct === 'tshirts') fabricAdd = 40;
            else if (selectedProduct === 'caps') fabricAdd = 20;
            else if (selectedProduct === 'apparel') fabricAdd = 30;
        } else if (fabricType === 'heavy') {
            if (selectedProduct === 'tshirts') fabricAdd = 80;
            else if (selectedProduct === 'caps') fabricAdd = 40;
            else if (selectedProduct === 'apparel') fabricAdd = 60;
        }

        // Raw Subtotal per Piece
        const rawUnitCost = basePrice + brandingAdd + fabricAdd;

        // 4. Volume Discount Percentage Tiering
        let discountPct = 0;
        if (quantity >= 5000) discountPct = 0.30;
        else if (quantity >= 2500) discountPct = 0.25;
        else if (quantity >= 1000) discountPct = 0.20;
        else if (quantity >= 500) discountPct = 0.15;
        else if (quantity >= 300) discountPct = 0.10;
        else if (quantity >= 100) discountPct = 0.05;

        // Calculations
        const finalUnitCost = Math.round(rawUnitCost * (1 - discountPct));
        const subtotal = rawUnitCost * quantity;
        const finalTotal = finalUnitCost * quantity;

        // Populate Outputs in DOM
        if (estPriceUnit) estPriceUnit.textContent = finalUnitCost.toFixed(2);
        if (estPriceSubtotal) estPriceSubtotal.textContent = `₹${subtotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
        if (estDiscountPct) estDiscountPct.textContent = `${(discountPct * 100)}%`;
        if (estPriceTotal) estPriceTotal.textContent = `₹${finalTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}`;
    };

    // Attach listeners to estimator parameters
    if (estQtySlider) {
        estQtySlider.addEventListener('input', calculateEstimates);
        estProductRadios.forEach(radio => radio.addEventListener('change', calculateEstimates));
        estBrandingSelect.addEventListener('change', calculateEstimates);
        estFabricSelect.addEventListener('change', calculateEstimates);
        
        // Run initial load calculations
        calculateEstimates();
    }

    // Apply Estimations to Contact Form
    if (estApplyBtn) {
        estApplyBtn.addEventListener('click', () => {
            let selectedProductVal = 'Customized T-Shirts';
            let selectedProductType = 'tshirts';
            
            estProductRadios.forEach(radio => {
                if (radio.checked) selectedProductType = radio.value;
            });

            if (selectedProductType === 'caps') selectedProductVal = 'Customized Caps';
            else if (selectedProductType === 'apparel') selectedProductVal = 'Campaign & Promotional Apparel';

            // Select elements in main Form
            const mainProductSelect = document.getElementById('product');
            const mainQtyInput = document.getElementById('quantity');
            const mainMessageArea = document.getElementById('message');

            if (mainProductSelect) mainProductSelect.value = selectedProductVal;
            if (mainQtyInput) mainQtyInput.value = estQtySlider.value;

            // Generate Spec description
            const brandText = estBrandingSelect.options[estBrandingSelect.selectedIndex].text;
            const fabricText = estFabricSelect.options[estFabricSelect.selectedIndex].text;
            const unitCost = estPriceUnit ? estPriceUnit.textContent : '0.00';
            const totalCost = estPriceTotal ? estPriceTotal.textContent : '0.00';

            const specMessage = `📌 BUDGET ESTIMATE PARAMETERS APPLIED:\n` +
                                `- Product Interest: ${selectedProductVal}\n` +
                                `- Target Quantity: ${estQtySlider.value} Pcs\n` +
                                `- Material Choice: ${fabricText}\n` +
                                `- Customization Choice: ${brandText}\n` +
                                `- Reference Costing: ₹${unitCost}/pc (Est. Quote: ${totalCost})\n` +
                                `----------------------------------------------------\n` +
                                `Write additional requirements here...`;

            if (mainMessageArea) {
                mainMessageArea.value = specMessage;
            }

            // Scroll down smoothly to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                // Highlight inputs
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus();
                }, 800);
            }
        });
    }

    // ==========================================================================
    // 9. Lead Form Submission & LocalStorage CRM Integration
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const quoteModal = document.getElementById('quote-modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close, #modal-close-btn');
    const modalWhatsappSend = document.getElementById('modal-whatsapp-send');
    let lastQuoteData = null;

    // Helper to generate a Quote reference ID
    const generateQuoteId = () => {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit code
        return `QT-${dateStr}-${randomNum}`;
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Extract inputs
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const company = document.getElementById('company').value.trim() || 'Not specified';
            const product = document.getElementById('product').value;
            const quantity = document.getElementById('quantity').value;
            const message = document.getElementById('message').value.trim() || 'No message details provided.';

            // Phone verification (India format 10 digits)
            if (!/^\d{10}$/.test(phone.replace(/[\s-+]/g, '').slice(-10))) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }

            const quoteId = generateQuoteId();
            const timestamp = new Date().toLocaleString();

            const submission = {
                id: quoteId,
                timestamp,
                name,
                email,
                phone,
                company,
                product,
                quantity,
                message
            };

            // Save to LocalStorage leads DB
            try {
                const leads = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
                leads.unshift(submission); // Add to beginning
                localStorage.setItem('contactSubmissions', JSON.stringify(leads));
            } catch (err) {
                console.error('Failed to save lead details locally:', err);
            }

            // Populate Quotation Receipt inside modal popup
            document.getElementById('quote-id').textContent = quoteId;
            document.getElementById('rec-name').textContent = name;
            document.getElementById('rec-email').textContent = email;
            document.getElementById('rec-phone').textContent = phone;
            document.getElementById('rec-company').textContent = company;
            document.getElementById('rec-product').textContent = product;
            document.getElementById('rec-qty').textContent = `${quantity} Pcs`;

            lastQuoteData = submission;

            // Trigger Modal Open
            if (quoteModal) {
                quoteModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }

            // Reset original contact form
            contactForm.reset();
        });
    }

    // Modal Close Triggers
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (quoteModal) {
                quoteModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });

    // Outside Modal Click Close
    window.addEventListener('click', (e) => {
        if (e.target === quoteModal) {
            quoteModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // Send Quote to WhatsApp Link formatter
    if (modalWhatsappSend) {
        modalWhatsappSend.addEventListener('click', () => {
            if (!lastQuoteData) return;

            const textPayload = `Hello Ortex Industries Team, I just generated a manufacturing quote on your website!\n\n` +
                                `*Quote Reference*: ${lastQuoteData.id}\n` +
                                `*Customer Name*: ${lastQuoteData.name}\n` +
                                `*Company*: ${lastQuoteData.company}\n` +
                                `*Product Category*: ${lastQuoteData.product}\n` +
                                `*Target Quantity*: ${lastQuoteData.quantity} Pcs\n` +
                                `*Phone*: ${lastQuoteData.phone}\n` +
                                `*Email*: ${lastQuoteData.email}\n` +
                                `*Requirements*: ${lastQuoteData.message}`;

            const waLink = `https://wa.me/919211947188?text=${encodeURIComponent(textPayload)}`;
            window.open(waLink, '_blank');
        });
    }

    // ==========================================================================
    // 10. Interactive Admin Leads Dashboard Modal (Simulated CRM)
    // ==========================================================================
    const adminTriggers = document.querySelectorAll('.admin-trigger, #admin-trigger-hidden');
    const adminModal = document.getElementById('admin-modal');
    const adminCloseBtn = document.getElementById('admin-close-btn');
    const leadsTableBody = document.getElementById('leads-table-body');
    const noLeadsMsg = document.getElementById('no-leads-msg');
    const clearLeadsBtn = document.getElementById('clear-leads-btn');
    const exportLeadsBtn = document.getElementById('export-leads-btn');

    const renderLeadsTable = () => {
        let leads = [];
        try {
            leads = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        } catch (err) {
            console.error(err);
        }

        if (!leadsTableBody) return;

        if (leads.length === 0) {
            leadsTableBody.innerHTML = '';
            if (noLeadsMsg) noLeadsMsg.style.display = 'block';
            if (clearLeadsBtn) clearLeadsBtn.style.display = 'none';
            if (exportLeadsBtn) exportLeadsBtn.style.display = 'none';
            return;
        }

        if (noLeadsMsg) noLeadsMsg.style.display = 'none';
        if (clearLeadsBtn) clearLeadsBtn.style.display = 'inline-flex';
        if (exportLeadsBtn) exportLeadsBtn.style.display = 'inline-flex';

        leadsTableBody.innerHTML = leads.map(lead => `
            <tr>
                <td>
                    <b>${lead.id}</b><br>
                    <span style="font-size: 0.75rem; color: hsl(var(--muted-foreground));">${lead.timestamp}</span>
                </td>
                <td><b>${lead.name}</b></td>
                <td>
                    📧 ${lead.email}<br>
                    📱 ${lead.phone}<br>
                    🏢 ${lead.company}
                </td>
                <td><span class="quote-tag" style="background-color: hsl(var(--primary));">${lead.product}</span></td>
                <td><b>${lead.quantity}</b> pcs</td>
                <td style="max-width: 250px; font-size: 0.85rem; white-space: pre-wrap;">${lead.message}</td>
            </tr>
        `).join('');
    };

    adminTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            renderLeadsTable();
            if (adminModal) {
                adminModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (adminCloseBtn) {
        adminCloseBtn.addEventListener('click', () => {
            if (adminModal) {
                adminModal.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // Close admin modal by clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // Clear Leads functionality
    if (clearLeadsBtn) {
        clearLeadsBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all lead entries from local storage?')) {
                localStorage.setItem('contactSubmissions', '[]');
                renderLeadsTable();
            }
        });
    }

    // Export Leads as JSON
    if (exportLeadsBtn) {
        exportLeadsBtn.addEventListener('click', () => {
            const leads = localStorage.getItem('contactSubmissions') || '[]';
            const blob = new Blob([leads], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `ortex_leads_export_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    // ==========================================================================
    // 12. Animated B2B Workflow Wizard (IntersectionObserver + Cycle)
    // ==========================================================================
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const wizardTimeline = document.querySelector('.wizard-timeline');
    
    if (wizardSteps.length > 0) {
        let activeIdx = 0;
        let timer = null;
        const CYCLE_TIME = 4000;
        
        wizardSteps.forEach((step, idx) => {
            step.setAttribute('data-step', idx);
            const pb = document.createElement('div');
            pb.className = 'wizard-progress-bar';
            step.appendChild(pb);
        });

        const setStepActive = (index) => {
            wizardSteps.forEach((step, idx) => {
                if (idx === index) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
            activeIdx = index;
        };

        const startCycle = () => {
            stopCycle();
            setStepActive(activeIdx);
            timer = setInterval(() => {
                const nextIdx = (activeIdx + 1) % wizardSteps.length;
                setStepActive(nextIdx);
            }, CYCLE_TIME);
        };

        const stopCycle = () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };

        setStepActive(0);

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCycle();
                    } else {
                        stopCycle();
                    }
                });
            }, { threshold: 0.15 });
            if (wizardTimeline) observer.observe(wizardTimeline);
        } else {
            startCycle();
        }

        wizardSteps.forEach((step, idx) => {
            step.addEventListener('mouseenter', () => {
                stopCycle();
                setStepActive(idx);
            });
            
            step.addEventListener('mouseleave', () => {
                startCycle();
            });
        });
    }

    // ==========================================================================
    // 12. Chatbot Assistant (PNB-Style Mascot & custom B2B Lead Agent)
    // ==========================================================================
    const initChatbot = () => {
        // Inject Styles
        const style = document.createElement('style');
        style.innerHTML = `
            #ortex-chat-btn {
                position: fixed;
                bottom: 85px;
                right: 24px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background-color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                cursor: pointer;
                z-index: 999;
                transition: var(--transition);
                border: 1px solid hsl(var(--border));
                overflow: hidden;
            }
            #ortex-chat-btn:hover {
                transform: scale(1.1);
            }
            #ortex-chat-btn img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            #ortex-chat-window {
                position: fixed;
                bottom: 160px;
                right: 24px;
                width: 360px;
                height: 500px;
                background-color: hsl(var(--card));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius-lg);
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                z-index: 1000;
                overflow: hidden;
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            #ortex-chat-window.open {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }
            .chat-header {
                background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-hover)) 100%);
                color: #fff;
                padding: 1rem 1.25rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .chat-header-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .chat-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-color: rgba(255,255,255,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
            }
            .chat-header-text h4 {
                font-size: 0.95rem;
                font-weight: 700;
                margin: 0;
            }
            .chat-header-text span {
                font-size: 0.75rem;
                opacity: 0.85;
            }
            .chat-close-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 1.5rem;
                cursor: pointer;
                line-height: 1;
                padding: 0;
                transition: opacity 0.2s;
            }
            .chat-close-btn:hover {
                opacity: 0.7;
            }
            .chat-messages {
                flex-grow: 1;
                padding: 1.25rem;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 1rem;
                background-color: hsl(var(--background));
            }
            .chat-msg {
                max-width: 80%;
                padding: 0.75rem 1rem;
                border-radius: var(--radius);
                font-size: 0.9rem;
                line-height: 1.4;
                white-space: pre-wrap;
            }
            .chat-msg.bot {
                background-color: hsl(var(--secondary));
                color: hsl(var(--foreground));
                align-self: flex-start;
                border-bottom-left-radius: 2px;
            }
            .chat-msg.user {
                background-color: hsl(var(--primary));
                color: #fff;
                align-self: flex-end;
                border-bottom-right-radius: 2px;
            }
            .chat-quick-replies {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                padding: 0.5rem 1.25rem;
                background-color: hsl(var(--background));
                border-top: 1px solid hsl(var(--border));
            }
            .quick-reply-btn {
                background-color: hsl(var(--card));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius-sm);
                padding: 6px 12px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition);
                color: hsl(var(--foreground));
            }
            .quick-reply-btn:hover {
                border-color: hsl(var(--primary));
                background-color: hsla(var(--primary), 0.05);
            }
            .chat-input-area {
                padding: 0.75rem 1.25rem;
                border-top: 1px solid hsl(var(--border));
                display: flex;
                gap: 0.75rem;
                background-color: hsl(var(--card));
            }
            .chat-input {
                flex-grow: 1;
                background-color: hsl(var(--background));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius-sm);
                padding: 8px 12px;
                color: hsl(var(--foreground));
                font-size: 0.9rem;
                outline: none;
            }
            .chat-input:focus {
                border-color: hsl(var(--primary));
            }
            .chat-send-btn {
                background-color: hsl(var(--primary));
                color: #fff;
                border: none;
                border-radius: var(--radius-sm);
                padding: 8px 16px;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition);
            }
            .chat-send-btn:hover {
                background-color: hsl(var(--primary-hover));
            }
            .chat-redirect-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            .chat-redirect-modal.open {
                opacity: 1;
                pointer-events: all;
            }
            .chat-redirect-box {
                background-color: hsl(var(--card));
                border: 1px solid hsl(var(--border));
                border-radius: var(--radius-lg);
                padding: 2rem;
                width: 90%;
                max-width: 400px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.25);
            }
            .chat-redirect-box h3 {
                margin-top: 0;
                font-weight: 800;
                color: hsl(var(--foreground));
            }
            .chat-redirect-box p {
                color: hsl(var(--muted-foreground));
                margin-bottom: 1.5rem;
                font-size: 0.95rem;
            }
            .chat-redirect-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);

        // Inject HTML Markup
        const chatContainer = document.createElement('div');
        chatContainer.innerHTML = `
            <!-- Chat Trigger Button (mascot styled) -->
            <div id="ortex-chat-btn" title="Chat with Ortex Assist">
                <img src="images/chatbot_logo.png" alt="Ortex Assist Mascot">
            </div>

            <!-- Redirect Confirmation Modal (PNB Style redirect popup) -->
            <div id="ortex-chat-redirect" class="chat-redirect-modal">
                <div class="chat-redirect-box">
                    <h3>💬 Connect to AI Assist</h3>
                    <p>You are being redirected to the Ortex automated AI chat portal for immediate assistance. Proceed?</p>
                    <div class="chat-redirect-actions">
                        <button class="btn btn-secondary" id="chat-redirect-cancel">Cancel</button>
                        <button class="btn btn-primary" id="chat-redirect-proceed">Proceed</button>
                    </div>
                </div>
            </div>

            <!-- Chat Window -->
            <div id="ortex-chat-window">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <img src="images/chatbot_logo.png" alt="Ortex Assist Avatar" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; background: #fff; padding: 2px; border: 1px solid rgba(255,255,255,0.2);">
                        <div class="chat-header-text">
                            <h4>Ortex AI Assist</h4>
                            <span>Online • Customer Support</span>
                        </div>
                    </div>
                    <button class="chat-close-btn" id="ortex-chat-close">&times;</button>
                </div>
                <div class="chat-messages" id="chat-messages-container">
                    <div class="chat-msg bot">Hello! I am Ortex Assist, your digital manufacturing advisor. How can I help you today?</div>
                </div>
                <div class="chat-quick-replies" id="chat-quick-replies-container">
                    <button class="quick-reply-btn" data-reply="Products Catalog">📦 Products</button>
                    <button class="quick-reply-btn" data-reply="OEM & Private Label">👕 OEM Service</button>
                    <button class="quick-reply-btn" data-reply="Customization Info">🎨 Customization</button>
                    <button class="quick-reply-btn" data-reply="Quote">💵 Get a Quote</button>
                </div>
                <div class="chat-input-area">
                    <input type="text" class="chat-input" id="chat-text-input" placeholder="Type a message...">
                    <button class="chat-send-btn" id="chat-send-btn">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(chatContainer);

        // State variables
        let chatState = 'idle'; // idle, get_quote_name, get_quote_contact, get_quote_requirements
        let leadData = {
            name: '',
            contact: '',
            requirements: ''
        };

        const chatBtn = document.getElementById('ortex-chat-btn');
        const redirectModal = document.getElementById('ortex-chat-redirect');
        const redirectProceed = document.getElementById('chat-redirect-proceed');
        const redirectCancel = document.getElementById('chat-redirect-cancel');
        const chatWindow = document.getElementById('ortex-chat-window');
        const chatClose = document.getElementById('ortex-chat-close');
        const messagesContainer = document.getElementById('chat-messages-container');
        const inputField = document.getElementById('chat-text-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const quickRepliesContainer = document.getElementById('chat-quick-replies-container');

        // Toggle chat flow
        chatBtn.addEventListener('click', () => {
            if (chatWindow.classList.contains('open')) {
                chatWindow.classList.remove('open');
            } else {
                redirectModal.classList.add('open');
            }
        });

        redirectCancel.addEventListener('click', () => {
            redirectModal.classList.remove('open');
        });

        redirectProceed.addEventListener('click', () => {
            redirectModal.classList.remove('open');
            chatWindow.classList.add('open');
            setTimeout(scrollToBottom, 50);
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('open');
        });

        const scrollToBottom = () => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-msg ${sender}`;
            msgDiv.innerText = text;
            messagesContainer.appendChild(msgDiv);
            scrollToBottom();
        };

        const handleSend = () => {
            const text = inputField.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            inputField.value = '';

            setTimeout(() => {
                processMessage(text);
            }, 500);
        };

        sendBtn.addEventListener('click', handleSend);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });

        // Quick replies container click handler
        quickRepliesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply-btn')) {
                const reply = e.target.getAttribute('data-reply');
                if (reply === 'Quote') {
                    startQuoteFlow();
                } else {
                    addMessage(e.target.innerText, 'user');
                    setTimeout(() => {
                        processMessage(reply);
                    }, 500);
                }
            }
        });

        const startQuoteFlow = () => {
            addMessage("Get a Custom Quote", 'user');
            chatState = 'get_quote_name';
            setTimeout(() => {
                addMessage("I would be glad to help you request a custom B2B manufacturing quote! To get started, what is your Full Name?", 'bot');
                quickRepliesContainer.style.display = 'none'; // Hide quick replies during form flow
            }, 500);
        };

        const processMessage = (text) => {
            const lowerText = text.toLowerCase();

            // Check Form Flow States
            if (chatState === 'get_quote_name') {
                leadData.name = text;
                chatState = 'get_quote_contact';
                addMessage(`Nice to meet you, ${text}! What is your email address or phone number so our sales team can contact you?`, 'bot');
                return;
            }

            if (chatState === 'get_quote_contact') {
                leadData.contact = text;
                chatState = 'get_quote_requirements';
                addMessage("Got it. Finally, tell me about your project requirements (e.g., 200 Polo T-shirts with embroidery). Please also mention your company name if applicable.", 'bot');
                return;
            }

            if (chatState === 'get_quote_requirements') {
                leadData.requirements = text;
                chatState = 'idle';
                quickRepliesContainer.style.display = 'flex'; // Restore quick replies

                // Create lead submission matching our B2B CRM database
                try {
                    const submission = {
                        id: 'Q-' + Math.floor(1000 + Math.random() * 9000),
                        timestamp: new Date().toLocaleString(),
                        name: leadData.name,
                        email: leadData.contact.includes('@') ? leadData.contact : 'Not specified',
                        phone: !leadData.contact.includes('@') ? leadData.contact : 'Not specified',
                        company: 'Chatbot Lead',
                        product: 'Custom Apparel',
                        quantity: 100, // Default bulk starting quantity
                        message: leadData.requirements
                    };

                    const leads = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
                    leads.unshift(submission);
                    localStorage.setItem('contactSubmissions', JSON.stringify(leads));

                    // Trigger render table if dashboard is open
                    if (typeof renderLeadsTable === 'function') {
                        renderLeadsTable();
                    }
                } catch (e) {
                    console.error("Failed to save chatbot lead locally:", e);
                }

                addMessage(`Thank you, ${leadData.name}! Your request has been recorded. Our team will get back to you shortly.`, 'bot');
                return;
            }

            // Keyword / Intent Matching (Training)
            if (lowerText.includes('product') || lowerText.includes('catalog') || lowerText.includes('tshirt') || lowerText.includes('t-shirt') || lowerText.includes('polo') || lowerText.includes('jersey')) {
                addMessage("Ortex Industries manufactures a wide range of premium apparel:\n\n• Customized T-Shirts (Polo, Round Neck, Dry Fit, Sports Jerseys)\n• Premium Caps (Cotton, Baseball, Corporate)\n• Promotional Garments (Hoodies, Jackets, Aprons)\n• Political Campaign Merchandise & Flags\n\nYou can browse our catalog on the 'Product' page.", 'bot');
            } else if (lowerText.includes('oem') || lowerText.includes('label') || lowerText.includes('brand') || lowerText.includes('tag')) {
                addMessage("We provide complete white-label OEM manufacturing solutions:\n\n• Low MOQs starting at just 50 pieces per design\n• Custom woven neck tags and printed care labels\n• Premium branded polybag and box packaging\n• Blind drop shipping directly to your clients", 'bot');
            } else if (lowerText.includes('custom') || lowerText.includes('print') || lowerText.includes('embroidery') || lowerText.includes('dtf') || lowerText.includes('sublimation')) {
                addMessage("We offer state-of-the-art branding options:\n\n• Premium Screen Printing & Embroidery\n• Direct-To-Film (DTF) & Puff 3D Printing\n• Sublimation & Heat Transfer\n• Custom Woven Labels & Rubber Logos", 'bot');
            } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('moq') || lowerText.includes('minimum') || lowerText.includes('how much')) {
                addMessage("Our starting Minimum Order Quantity (MOQ) is 50 pieces. Pricing depends on fabric selection, quantity, and customization options. Type 'Quote' to request custom pricing details directly from our sales team.", 'bot');
            } else if (lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email') || lowerText.includes('address') || lowerText.includes('location') || lowerText.includes('delhi')) {
                addMessage("Ortex Industries Contact Details:\n\n📞 Phone: +91 92119 47188\n📧 Email: sales@ortexindustries.in\n📍 Location: Karol Bagh, New Delhi, India\n🕒 Business Hours: Mon-Sat, 9:00 AM - 6:00 PM", 'bot');
            } else if (lowerText.includes('flag') || lowerText.includes('political') || lowerText.includes('tiranga') || lowerText.includes('bjp')) {
                addMessage("We manufacture premium flags and election merchandise:\n\n• National Flags (Tiranga Flags in Cotton, Polyester, and Paper)\n• Political Party Flags (BJP, Congress, AAP, SP, BSP Flags)\n• Campaign Badges, Keychains, Patta/Scarves, and Caps\n• Rapid turnaround times for election rally accessories", 'bot');
            } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
                addMessage("Hi there! How can I assist you with your garment manufacturing needs today?", 'bot');
            } else if (lowerText.includes('quote')) {
                startQuoteFlow();
            } else {
                addMessage("I am here to assist you with customized apparel, OEM branding, political flags, and bulk pricing. You can also type 'Quote' to send a request directly to our team.", 'bot');
            }
        };

        // Auto-open chatbot after 5 seconds if not already open
        setTimeout(() => {
            if (!chatWindow.classList.contains('open') && !redirectModal.classList.contains('open')) {
                chatWindow.classList.add('open');
                scrollToBottom();
            }
        }, 5000);
    };

    // Initialize the Chatbot
    initChatbot();
});
