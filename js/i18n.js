/* ============================================================
   i18n - Thai / English text switcher
   Include this AFTER supabase-config.js/auth.js on every page.
   Mark translatable elements with data-i18n="key"
   Mark translatable placeholders with data-i18n-placeholder="key"
   ============================================================ */

const translations = {
    th: {
        nav_home: "หน้าแรก",
        nav_wheels: "ล้อแม็ก",
        nav_tires: "ยาง",
        nav_shock: "โช้คอัพ",
        nav_brake: "เบรก",

        staff_login: "🔒 เข้าสู่ระบบพนักงาน",
        staff_admin: "🛠 แผงควบคุม",
        staff_logout: "ออกจากระบบ",
        staff_back: "← กลับหน้าเว็บ",

        tagline: "จำหน่ายล้อแม็ก-ยางรถยนต์ โช้คสตรัท สปริงโหลด ช่วงล่างครบวงจร",

        cta_call: "📞 โทรเลย",
        cta_line: "💬 แอด LINE",
        footer_products: "สินค้า",
        footer_contact: "ติดต่อเรา",
        hero_kicker: "ล้อแม็ก · ยาง · โช้คอัพ · เบรก",
        hero_title: "ศูนย์รวมช่วงล่างครบวงจร",
        hero_sub: "ล้อแม็ก ยางรถยนต์ โช้คสตรัท สปริงโหลด พร้อมทีมช่างติดตั้งให้ถึงที่ร้าน",
        hero_search_placeholder: "ค้นหาไซส์ยาง เช่น 265/60R18",
        hero_search_btn: "ค้นหา",
        section_categories: "หมวดหมู่สินค้า",
        section_categories_sub: "เลือกดูสินค้าตามหมวดที่ต้องการ",
        cat_wheels_desc: "ล้อแม็กหลากหลายดีไซน์และขนาด",
        cat_tires_desc: "ยางรถยนต์ทุกไซส์ ค้นหาตามขนาดได้",
        cat_shock_desc: "โช้คอัพ โช้คสตรัท สปริงโหลด",
        cat_brake_desc: "ชุดเบรก ผ้าเบรก จานเบรก",
        cat_view: "ดูสินค้า →",
        section_why: "ทำไมต้อง BoyAutoTires",
        why_1_title: "ช่างผู้ชำนาญ",
        why_1_desc: "ติดตั้งและปรับตั้งช่วงล่างโดยทีมช่างประสบการณ์",
        why_2_title: "สินค้าครบ",
        why_2_desc: "ล้อ ยาง โช้ค เบรก ครบจบในร้านเดียว",
        why_3_title: "ให้คำปรึกษา",
        why_3_desc: "แนะนำสินค้าที่เหมาะกับรถและการใช้งานของคุณ",
        why_4_title: "ติดต่อง่าย",
        why_4_desc: "สอบถามได้ทั้งโทรศัพท์ LINE และโซเชียล",
        section_latest: "สินค้ามาใหม่",
        view_all: "ดูทั้งหมด",
        section_gallery: "ผลงานของเรา",
        cta_band_title: "สนใจสินค้าหรือต้องการสอบถาม?",
        cta_band_sub: "ทักมาได้เลย ทีมงานยินดีให้คำแนะนำ",

        page_title_wheels: "ล้อแม็ก (Wheels)",
        page_title_tires: "ยางรถยนต์ (Tires)",
        page_title_shock: "โช้คอัพ (Shock Absorbers)",
        page_title_brake: "เบรก (Brake)",

        products_loading: "กำลังโหลดสินค้า...",
        products_error: "โหลดสินค้าไม่สำเร็จ กรุณาลองใหม่ภายหลัง",
        products_empty: "ยังไม่มีสินค้าในหมวดนี้",
        in_stock: "มีสินค้า",
        out_of_stock: "สินค้าหมด",

        search_placeholder: "ค้นหาไซส์ยาง หรือชื่อยาง...",
        sort_size: "🔢 เรียงตามไซส์",
        sort_name: "🔤 เรียงตามชื่อ",
        sort_price: "💰 เรียงตามราคา",
        sort_size_asc: "ไซส์: เล็ก → ใหญ่",
        sort_size_desc: "ไซส์: ใหญ่ → เล็ก",
        sort_name_asc: "ชื่อ: ก-ฮ / A-Z",
        sort_name_desc: "ชื่อ: ฮ-ก / Z-A",
        sort_price_asc: "ราคา: ถูก → แพง",
        sort_price_desc: "ราคา: แพง → ถูก",
        search_no_results: "ไม่พบยางที่ตรงกับคำค้นหา",

        admin_title: "Staff Admin Panel",
        field_email: "Email",
        field_password: "Password",
        placeholder_password: "••••••••",
        pw_show: "แสดงรหัสผ่าน",
        pw_hide: "ซ่อนรหัสผ่าน",
        btn_login: "เข้าสู่ระบบ",
        login_error_empty: "กรุณากรอกอีเมลและรหัสผ่าน",
        login_error_failed: "เข้าสู่ระบบไม่สำเร็จ: อีเมลหรือรหัสผ่านไม่ถูกต้อง",

        tab_tires: "ยางรถยนต์",
        tab_wheels: "ล้อแม็ก",
        tab_shock: "โช้คอัพ",
        tab_brake: "เบรก",

        form_title_add: "เพิ่มสินค้าใหม่",
        form_title_edit: "แก้ไขสินค้า",
        field_name: "ชื่อสินค้า",
        placeholder_name: "เช่น Michelin Primacy 4",
        field_size: "ไซส์ (สำหรับยาง)",
        placeholder_size: "เช่น 265/60R18",
        field_desc: "รายละเอียด",
        placeholder_desc: "ขนาด, สเปค, ข้อมูลเพิ่มเติม",
        field_price: "ราคา (บาท)",
        field_image: "รูปภาพสินค้า (เลือกได้หลายรูป)",
        image_cover: "รูปหลัก",
        image_remove: "ลบรูปนี้",
        lb_close: "ปิด",
        lb_prev: "รูปก่อนหน้า",
        lb_next: "รูปถัดไป",
        field_instock: "มีสินค้าพร้อมขาย",
        btn_save: "บันทึก",
        btn_clear: "ล้างฟอร์ม",
        btn_edit: "แก้ไข",
        btn_delete: "ลบ",
        confirm_delete: "ยืนยันลบสินค้านี้?",
        list_loading: "กำลังโหลด...",
        list_empty: "ยังไม่มีสินค้าในหมวดนี้",
        list_error: "โหลดข้อมูลไม่สำเร็จ",
        save_error: "บันทึกไม่สำเร็จ: ",
        delete_error: "ลบไม่สำเร็จ: ",
        upload_uploading: "กำลังอัปโหลดรูป...",
        upload_success: "อัปโหลดรูปสำเร็จ",
        upload_error: "อัปโหลดรูปไม่สำเร็จ: ",
        upload_error_retry: "อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่",
        name_required: "กรุณากรอกชื่อสินค้า",
    },
    en: {
        nav_home: "Home",
        nav_wheels: "Wheels",
        nav_tires: "Tires",
        nav_shock: "Shock Absorbers",
        nav_brake: "Brake",

        staff_login: "🔒 Staff Login",
        staff_admin: "🛠 Admin Panel",
        staff_logout: "Log out",
        staff_back: "← Back to site",

        tagline: "Alloy wheels, tires, struts, lowering springs & full suspension service",

        cta_call: "📞 Call us",
        cta_line: "💬 Add LINE",
        footer_products: "Products",
        footer_contact: "Contact",
        hero_kicker: "Wheels · Tires · Shocks · Brakes",
        hero_title: "Your complete suspension shop",
        hero_sub: "Alloy wheels, tires, struts and lowering springs, installed in-store by our technicians",
        hero_search_placeholder: "Search tire size, e.g. 265/60R18",
        hero_search_btn: "Search",
        section_categories: "Product categories",
        section_categories_sub: "Browse products by category",
        cat_wheels_desc: "Alloy wheels in many designs and sizes",
        cat_tires_desc: "Tires in every size, searchable by size",
        cat_shock_desc: "Shock absorbers, struts, lowering springs",
        cat_brake_desc: "Brake kits, pads and rotors",
        cat_view: "View products →",
        section_why: "Why BoyAutoTires",
        why_1_title: "Skilled technicians",
        why_1_desc: "Installation and suspension setup by an experienced team",
        why_2_title: "Everything in one place",
        why_2_desc: "Wheels, tires, shocks and brakes in a single shop",
        why_3_title: "Expert advice",
        why_3_desc: "We recommend what fits your car and how you drive",
        why_4_title: "Easy to reach",
        why_4_desc: "Ask us by phone, LINE or social media",
        section_latest: "New arrivals",
        view_all: "View all",
        section_gallery: "Our work",
        cta_band_title: "Interested or have a question?",
        cta_band_sub: "Message us anytime, we're happy to help",

        page_title_wheels: "Wheels",
        page_title_tires: "Tires",
        page_title_shock: "Shock Absorbers",
        page_title_brake: "Brake",

        products_loading: "Loading products...",
        products_error: "Failed to load products. Please try again later.",
        products_empty: "No products in this category yet.",
        in_stock: "In stock",
        out_of_stock: "Out of stock",

        search_placeholder: "Search by tire size or name...",
        sort_size: "🔢 Sort by size",
        sort_name: "🔤 Sort by name",
        sort_price: "💰 Sort by price",
        sort_size_asc: "Size: Small → Large",
        sort_size_desc: "Size: Large → Small",
        sort_name_asc: "Name: A → Z",
        sort_name_desc: "Name: Z → A",
        sort_price_asc: "Price: Low → High",
        sort_price_desc: "Price: High → Low",
        search_no_results: "No tires match your search",

        admin_title: "Staff Admin Panel",
        field_email: "Email",
        field_password: "Password",
        placeholder_password: "••••••••",
        pw_show: "Show password",
        pw_hide: "Hide password",
        btn_login: "Log in",
        login_error_empty: "Please enter your email and password",
        login_error_failed: "Login failed: incorrect email or password",

        tab_tires: "Tires",
        tab_wheels: "Wheels",
        tab_shock: "Shock Absorbers",
        tab_brake: "Brake",

        form_title_add: "Add new product",
        form_title_edit: "Edit product",
        field_name: "Product name",
        placeholder_name: "e.g. Michelin Primacy 4",
        field_size: "Size (for tires)",
        placeholder_size: "e.g. 265/60R18",
        field_desc: "Description",
        placeholder_desc: "Size, specs, extra details",
        field_price: "Price (THB)",
        field_image: "Product images (select multiple)",
        image_cover: "Cover",
        image_remove: "Remove image",
        lb_close: "Close",
        lb_prev: "Previous image",
        lb_next: "Next image",
        field_instock: "In stock",
        btn_save: "Save",
        btn_clear: "Clear form",
        btn_edit: "Edit",
        btn_delete: "Delete",
        confirm_delete: "Delete this product?",
        list_loading: "Loading...",
        list_empty: "No products in this category yet.",
        list_error: "Failed to load data",
        save_error: "Save failed: ",
        delete_error: "Delete failed: ",
        upload_uploading: "Uploading image...",
        upload_success: "Image uploaded",
        upload_error: "Image upload failed: ",
        upload_error_retry: "Image upload failed, please try again",
        name_required: "Please enter a product name",
    }
};

function getLang() {
    return localStorage.getItem('site_lang') || 'th';
}

function t(key) {
    const lang = getLang();
    return (translations[lang] && translations[lang][key]) ?? key;
}

function applyTranslations() {
    const lang = getLang();
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.placeholder = translations[lang][key];
        }
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

function setLanguage(lang) {
    localStorage.setItem('site_lang', lang);
    applyTranslations();
    if (typeof onLanguageChange === 'function') onLanguageChange(lang);
}

document.addEventListener('DOMContentLoaded', applyTranslations);
