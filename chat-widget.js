// chat-widget.js — زر دائري عايم بيفتح الشات بكل صفحة
(function () {
  if (document.getElementById("abd-chat-btn")) return;

  var css = document.createElement("style");
  css.textContent =
    "#abd-chat-btn{position:fixed;bottom:20px;left:20px;z-index:9998;width:62px;height:62px;" +
    "border-radius:50%;border:0;cursor:pointer;background:#3b4cca;color:#fff;font-size:28px;" +
    "box-shadow:0 8px 24px rgba(59,76,202,.45);display:grid;place-items:center;transition:transform .2s}" +
    "#abd-chat-btn:hover{transform:scale(1.08)}" +
    "#abd-chat-btn:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 6px #3b4cca}" +
    "#abd-chat-panel{position:fixed;bottom:96px;left:20px;z-index:9999;width:370px;height:540px;" +
    "max-height:calc(100vh - 120px);border-radius:18px;overflow:hidden;background:#fff;" +
    "box-shadow:0 16px 48px rgba(20,30,80,.35);display:none}" +
    "#abd-chat-panel.open{display:block}" +
    "#abd-chat-panel iframe{width:100%;height:100%;border:0}" +
    "@media(max-width:480px){#abd-chat-panel{left:0;right:0;bottom:0;width:100%;height:100%;" +
    "max-height:none;border-radius:0}#abd-chat-btn.open{bottom:auto;top:12px;width:48px;height:48px;font-size:20px}}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "abd-chat-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "افتح المساعد");
  btn.textContent = "💬";

  var panel = document.createElement("div");
  panel.id = "abd-chat-panel";

  var loaded = false;
  btn.addEventListener("click", function () {
    var open = panel.classList.toggle("open");
    btn.classList.toggle("open", open);
    btn.textContent = open ? "✕" : "💬";
    btn.setAttribute("aria-label", open ? "أغلق المساعد" : "افتح المساعد");
    if (open && !loaded) {
      var f = document.createElement("iframe");
      f.src = "chat.html?embed=1";
      f.title = "مساعد Abd Code";
      panel.appendChild(f);
      loaded = true;
    }
  });

  document.body.appendChild(panel);
  document.body.appendChild(btn);
})();
