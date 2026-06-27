/**
 * =======================================================================
 * PROJECT 360 - MASTER CONTROL SCRIPT
 * Version: 2.0.0 (Ultra-Advanced Edition)
 * =======================================================================
 */

// ۱. تزریق اتوماتیک کتابخانه‌های فوق‌پیشرفته (بدون نیاز به دستکاری HTML)
(function injectSuperLibraries() {
    // SweetAlert2 برای پاپ‌آپ‌های به شدت زیبا و مدرن
    const swalScript = document.createElement('script');
    swalScript.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    document.head.appendChild(swalScript);

    // Canvas Confetti برای جشن گرفتن اچیومنت‌ها (مثل تکمیل آب روزانه)
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(confettiScript);
})();

// ۲. سیستم هشدار و صداهای رابط کاربری (UI Feedback)
const UI = {
    toast: (title, icon = 'success') => {
        if (typeof Swal !== 'undefined') {
            const Toast = Swal.mixin({
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: 'rgba(30, 41, 59, 0.9)',
                color: '#fff',
                iconColor: '#3b82f6',
                customClass: { popup: 'glass-panel' }
            });
            Toast.fire({ icon: icon, title: title });
        }
    },
    celebrate: () => {
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#06b6d4', '#10b981']
            });
        }
    }
};

// ۳. هسته اصلی پردازش داده‌ها (Alpine.js Core)
document.addEventListener('alpine:init', () => {
    Alpine.data('project360', () => ({
        // وضعیت‌های پایه‌ای
        sidebarOpen: false,
        currentTime: '۰۰:۰۰:۰۰',
        jalaliDate: 'در حال محاسبه...',
        greetingMessage: 'سیستم در حال راه‌اندازی...',
        
        // دیتابیس محلی برای ذخیره آب
        water: parseInt(localStorage.getItem('p360_water_level')) || 0,
        waterGoalReached: localStorage.getItem('p360_water_goal') === 'true',
        
        // سیستم روتین‌های فوق‌پیشرفته (با دیتای کاستوم و هدفمند)
        routines: JSON.parse(localStorage.getItem('p360_routines_data')) || [
            { id: 1, title: 'مرور ریاضی و پیش‌خوانی دروس پایه دهم', category: 'آکادمیک', time: '۰۸:۰۰', done: false },
            { id: 2, title: 'توسعه وبسایت شخصی (Supabase & n8n)', category: 'برنامه‌نویسی', time: '۱۱:۰۰', done: false },
            { id: 3, title: 'تحلیل دقیق وزن (عروض) در غزل و مثنوی', category: 'ادبیات', time: '۱۶:۰۰', done: false },
            { id: 4, title: 'تمرین سه‌تار و کوک کردن ساز', category: 'هنر', time: '۱۸:۳۰', done: false },
            { id: 5, title: 'آزمایش ابزارهای هوش مصنوعی (Vertex AI)', category: 'فناوری', time: '۲۰:۰۰', done: false },
            { id: 6, title: 'پیگیری اخبار و تحلیل بازی‌های استقلال', category: 'ورزش', time: '۲۱:۳۰', done: false }
        ],

        // اجرا در لحظه لود شدن برنامه
        initApp() {
            console.log("%c PROJECT 360 SYSTEM INITIATED ", "background: #3b82f6; color: #fff; font-size: 16px; font-weight: bold; border-radius: 4px;");
            
            this.engineTick();
            setInterval(() => this.engineTick(), 1000); // آپدیت ساعت در هر ثانیه
            
            this.setJalaliDate();
            this.setGreeting();
            
            // رندر نمودار با کمی تاخیر برای اطمینان از لود شدن کتابخانه
            setTimeout(() => this.initAdvancedChart(), 300);
        },

        // قلب تپنده زمان
        engineTick() {
            const now = new Date();
            this.currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
        },

        // تاریخ هجری شمسی با فرمت لوکس
        setJalaliDate() {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            this.jalaliDate = new Intl.DateTimeFormat('fa-IR', options).format(new Date());
        },

        // سیستم احوال‌پرسی داینامیک بر اساس ساعت
        setGreeting() {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) this.greetingMessage = 'صبح بخیر فرمانده! زمان تسخیر اهدافه.';
            else if (hour >= 12 && hour < 18) this.greetingMessage = 'عصر بخیر! موتور پیشرفتت داره با نهایت قدرت کار می‌کنه.';
            else if (hour >= 18 && hour < 23) this.greetingMessage = 'شب بخیر! وقت تحلیل عملکرد و برنامه‌ریزی برای فرداست.';
            else this.greetingMessage = 'نیمه‌شب بخیر! سیستم‌های بدن نیاز به ریکاوری دارند، زودتر بخواب.';
        },

        // موتور پیشرفته مدیریت هیدراتاسیون (آب‌نوشی)
        changeWater(amount) {
            const oldWater = this.water;
            this.water += amount;
            
            // قفل کردن بین ۰ تا ۱۰
            if (this.water < 0) this.water = 0;
            if (this.water > 10) this.water = 10;

            // سیستم اچیومنت آب
            if (this.water === 10 && oldWater < 10 && !this.waterGoalReached) {
                this.waterGoalReached = true;
                setTimeout(() => {
                    UI.celebrate();
                    if(typeof Swal !== 'undefined') {
                        Swal.fire({
                            title: 'اچیومنت باز شد!',
                            text: 'هیدراتاسیون ۱۰۰٪ تکمیل شد. سلول‌های بدنت ازت ممنونن!',
                            icon: 'success',
                            background: '#0f172a',
                            color: '#fff',
                            confirmButtonColor: '#3b82f6'
                        });
                    }
                }, 300);
            } else if (this.water < 10) {
                this.waterGoalReached = false;
            }

            if(amount > 0 && this.water <= 10) UI.toast('یک لیوان آب ثبت شد', 'info');
            
            this.saveData();
        },

        // هندلر تغییر وضعیت روتین‌ها
        toggleRoutine(routine) {
            // وقتی کاربر تیک رو می‌زنه یا برمی‌داره، این تابع صدا زده می‌شه (توسط x-model تو HTML هندل شده)
            this.saveData();
            if(routine.done) {
                UI.toast(`آفرین! روتین "${routine.title}" انجام شد.`);
            }
            
            // چک کردن اینکه آیا همه روتین‌ها تیک خوردن؟
            if(this.completedRoutinesCount === this.routines.length) {
                setTimeout(() => {
                    UI.celebrate();
                    Swal.fire({
                        title: 'شاهکار کردی!',
                        text: 'تمام روتین‌های امروز تیک خورد. آبتینِ جدید بی‌رقیبه!',
                        icon: 'success',
                        background: '#0f172a',
                        color: '#fff',
                        confirmButtonColor: '#10b981'
                    });
                }, 500);
            }
        },

        // موتور ذخیره‌سازی ضد گلوله
        saveData() {
            localStorage.setItem('p360_water_level', this.water);
            localStorage.setItem('p360_water_goal', this.waterGoalReached);
            localStorage.setItem('p360_routines_data', JSON.stringify(this.routines));
        },

        // محاسبات زنده (Reactivity)
        get completedRoutinesCount() {
            return this.routines.filter(r => r.done).length;
        },

        get totalProgress() {
            const routineWeight = 75; // 75% اهمیت به روتین‌ها
            const waterWeight = 25;   // 25% اهمیت به آب
            
            const routineProgress = (this.completedRoutinesCount / this.routines.length) * routineWeight;
            const waterProgress = (this.water / 10) * waterWeight;
            
            return Math.min(100, routineProgress + waterProgress);
        },

        // ۴. پیکربندی حرفه‌ای نمودار (ApexCharts)
        initAdvancedChart() {
            const chartElement = document.querySelector("#mainChart");
            if (!chartElement) return;

            const options = {
                series: [{
                    name: 'سطح عملکرد (٪)',
                    data: [45, 52, 38, 65, 80, 72, 95] // دیتای نمونه هفته
                }],
                chart: {
                    height: 280,
                    type: 'area',
                    fontFamily: 'Vazirmatn',
                    toolbar: { show: false },
                    background: 'transparent',
                    animations: {
                        enabled: true,
                        easing: 'easeinout',
                        speed: 800,
                        animateGradually: { enabled: true, delay: 150 },
                        dynamicAnimation: { enabled: true, speed: 350 }
                    }
                },
                colors: ['#06b6d4'],
                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.6,
                        opacityTo: 0.05,
                        stops: [0, 90, 100],
                        colorStops: [
                            { offset: 0, color: "#3b82f6", opacity: 0.6 },
                            { offset: 100, color: "#06b6d4", opacity: 0.05 }
                        ]
                    }
                },
                dataLabels: { enabled: false },
                stroke: { 
                    curve: 'smooth', 
                    width: 4,
                    colors: ['#3b82f6']
                },
                markers: {
                    size: 5,
                    colors: ['#0f172a'],
                    strokeColors: '#3b82f6',
                    strokeWidth: 3,
                    hover: { size: 8 }
                },
                xaxis: {
                    categories: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'امروز'],
                    labels: { style: { colors: '#64748b', fontFamily: 'Vazirmatn' } },
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    tooltip: { enabled: false }
                },
                yaxis: {
                    max: 100,
                    labels: { 
                        style: { colors: '#64748b', fontFamily: 'Vazirmatn' },
                        formatter: (value) => value + "٪"
                    }
                },
                grid: {
                    borderColor: 'rgba(255,255,255,0.03)',
                    strokeDashArray: 5,
                    yaxis: { lines: { show: true } },
                    xaxis: { lines: { show: false } },
                },
                theme: { mode: 'dark' },
                tooltip: {
                    theme: 'dark',
                    y: { formatter: function (val) { return val + " درصد" } }
                }
            };

            const chart = new ApexCharts(chartElement, options);
            chart.render();
        }
    }));
});

// ۵. افکت‌های وانیلی جاوااسکریپت (ارتقای تجربه کاربری)
// اضافه کردن خاصیت داینامیک به چک‌باکس‌ها در فایل HTML (نیاز به هندلر آپدیت دیتابیس)
// توجه: برای اینکه متد toggleRoutine کار کنه، تگ input روتین‌ها تو فایل HTMLت باید اینطوری تغییر کنه:
// @change="toggleRoutine(routine)"
