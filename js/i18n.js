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
        field_image: "รูปภาพสินค้า",
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
        field_image: "Product image",
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
