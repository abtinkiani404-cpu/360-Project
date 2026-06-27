// --- تنظیم تاریخ شمسی ---
function setJalaliDate() {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    // استفاده از قابلیت بومی جاوااسکریپت برای تاریخ شمسی
    const jalaliDate = new Intl.DateTimeFormat('fa-IR', dateOptions).format(new Date());
    document.getElementById('jalali-date').innerText = jalaliDate;
}

// --- سیستم آب‌نوشی ---
let waterCount = 0;
const MAX_WATER = 10;

function updateWater(amount) {
    waterCount += amount;
    
    // محدود کردن بین ۰ تا ۱۰
    if (waterCount < 0) waterCount = 0;
    if (waterCount > MAX_WATER) waterCount = MAX_WATER;

    // آپدیت متن
    document.getElementById('water-count').innerText = waterCount;

    // آپدیت نوار پیشرفت (پروگرس بار)
    const percentage = (waterCount / MAX_WATER) * 100;
    document.getElementById('water-bar').style.width = percentage + '%';

    // (در آینده) اینجا کدی می‌نویسیم که مقدار آب رو توی Supabase ذخیره کنه
}

// اجرای توابع در زمان لود صفحه
window.onload = () => {
    setJalaliDate();
    // اگر دیتایی از قبل در دیتابیس بود، اینجا لود می‌کنیم
};
