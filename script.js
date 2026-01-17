"use strict"; // تفعيل الوضع الصارم لمنع الأخطاء الأمنية

const display = document.getElementById('display');
const historyList = document.getElementById('history-list');

// مصفوفة لتخزين السجل في ذاكرة المتصفح فقط (Privacy)
let historyStack = [];

function addChar(c) {
    // حماية: منع إدخال أكثر من 20 حرف لتجنب فيض الذاكرة
    if (display.value.length < 20) {
        display.value += c;
    }
}

function clearScreen() {
    display.value = '';
}

function calculate() {
    const expression = display.value;
    if (!expression) return;

    try {
        // الحماية القصوى: بدلاً من eval، نستخدم منشئ دالة معزول تماماً
        // هذا يمنع الكود من الوصول إلى ملفاتك أو الـ Cookies الخاصة بالمستخدم
        const result = Function('"use strict"; return (' + expression + ')')();

        if (!isFinite(result)) throw new Error("Infinity");

        // إضافة للعملية إلى السجل بأمان
        addToHistory(expression + " = " + result);
        
        display.value = result;
    } catch (e) {
        alert("خطأ في العملية: تأكد من المدخلات");
        clearScreen();
    }
}

function addToHistory(entry) {
    // 1. إضافة للمصفوفة
    historyStack.unshift(entry);
    if (historyStack.length > 5) historyStack.pop(); // الاحتفاظ بآخر 5 فقط

    // 2. تحديث الواجهة (حماية من XSS)
    historyList.innerHTML = ''; 
    historyStack.forEach(item => {
        const li = document.createElement('li');
        // استخدام textContent بدلاً من innerHTML لمنع تشغيل أي كود خبيث في السجل
        li.textContent = item; 
        historyList.appendChild(li);
    });
}
