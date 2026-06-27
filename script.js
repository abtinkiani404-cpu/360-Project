// === تنظیم تاریخ شمسی ===
function setJalaliDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const jalaliDate = new Intl.DateTimeFormat('fa-IR', options).format(new Date());
    document.getElementById('jalali-date').innerText = `امروز: ${jalaliDate}`;
}

// === جملات انگیزشی متغیر ===
const quotes = [
    "«وزن زندگی‌ات را خودت کوک کن؛ دقیق و بی‌نقص.»",
    "«هیچ کدی از همان ابتدا بدون باگ نیست؛ صبور باش و دیباگ کن.»",
    "«امروز همان روزی است که آبتینِ جدید در آن ساخته می‌شود.»",
    "«قدم‌های کوچک امروز، دستاوردهای عظیم فردا هستند.»"
];

function setRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-box').innerText = randomQuote;
}

// === سیستم هیدراتاسیون (آب‌نوشی) ===
let waterCount = 0;
const MAX_WATER = 10;

function updateWater(amount) {
    waterCount += amount;
    if (waterCount < 0) waterCount = 0;
    if (waterCount > MAX_WATER) waterCount = MAX_WATER;

    document.getElementById('water-count').innerText = waterCount;
    const percentage = (waterCount / MAX_WATER) * 100;
    document.getElementById('water-bar').style.width = `${percentage}%`;
    
    // در اینجا می‌توان دیتا را در LocalStorage یا Supabase ذخیره کرد
}

// === منوی همبرگری (Sidebar) ===
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// === سیستم روتین‌ها ===
const routines = [
    { id: 1, title: "پیش‌مطالعه دروس پایه دهم", time: "۰۸:۰۰ صبح" },
    { id: 2, title: "توسعه وب (HTML/CSS/JS)", time: "۱۱:۰۰ صبح" },
    { id: 3, title: "مرور عروض و قافیه / غزل‌خوانی", time: "۱۷:۰۰ عصر" },
    { id: 4, title: "تمرین سه‌تار (۳۰ دقیقه)", time: "۲۰:۰۰ شب" }
];

function renderRoutines() {
    const container = document.getElementById('routine-list');
    routines.forEach(routine => {
        const item = document.createElement('div');
        item.className = "flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition border border-transparent hover:border-slate-600";
        item.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" class="routine-checkbox" id="task-${routine.id}">
                <label for="task-${routine.id}" class="cursor-pointer text-gray-200">${routine.title}</label>
            </div>
            <span class="text-xs text-gray-500">${routine.time}</span>
        `;
        container.appendChild(item);
        
        // افکت خط خوردن متن هنگام تیک زدن
        const checkbox = item.querySelector(`#task-${routine.id}`);
        const label = item.querySelector(`label[for="task-${routine.id}"]`);
        checkbox.addEventListener('change', (e) => {
            if(e.target.checked) {
                label.classList.add('line-through', 'text-gray-500');
            } else {
                label.classList.remove('line-through', 'text-gray-500');
            }
        });
    });
}

// === سیستم آنالیز و نمودار (ApexCharts) ===
function initChart() {
    const options = {
        series: [44, 55, 13, 33],
        labels: ['کدنویسی', 'مطالعه تحصیلی', 'موسیقی و شعر', 'استراحت'],
        chart: {
            type: 'donut',
            height: 250,
            fontFamily: 'Vazirmatn'
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '65%',
                    background: 'transparent'
                }
            }
        },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        theme: { mode: 'dark' },
        dataLabels: { enabled: false },
        stroke: { show: false },
        legend: {
            position: 'bottom',
            labels: { colors: '#94a3b8' }
        }
    };

    const chart = new ApexCharts(document.querySelector("#activityChart"), options);
    chart.render();
}

// === راه‌اندازی اولیه داشبورد ===
window.onload = () => {
    setJalaliDate();
    setRandomQuote();
    renderRoutines();
    initChart();
};
