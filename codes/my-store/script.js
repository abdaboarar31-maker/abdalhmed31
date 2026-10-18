// ===== نمسك العناصر اللي بدنا نتحكم فيها =====
const modeBtn = document.getElementById("mode");
const countEl = document.getElementById("count");
let count = 0; // عدد المنتجات بالسلة

// ===== الوضع الفاتح / الغامق =====
modeBtn.onclick = function () {
  document.body.classList.toggle("light");
};

// ===== زر أضف للسلة =====
document.querySelectorAll(".add").forEach(function (btn) {
  btn.onclick = function () {
    count++; // نزيد واحد
    countEl.textContent = count; // نعرض الرقم
  };
});

// ===== نموذج التواصل =====
document.querySelector("form").onsubmit = function (e) {
  e.preventDefault(); // نمنع تحديث الصفحة
  document.getElementById("msg").textContent = "✅ وصلت رسالتك، شكراً!";
};
