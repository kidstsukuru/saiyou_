/**
 * 採用チャットボット 埋め込みウィジェット
 *
 * 使い方：
 * <script src="https://your-app.vercel.app/widget.js" data-tenant="your-tenant-id"></script>
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var tenantId = script && script.getAttribute('data-tenant');
  var appUrl = script && script.getAttribute('data-url');

  if (!tenantId) {
    console.error('[ChatBot] data-tenant attribute is required.');
    return;
  }

  if (!appUrl) {
    var src = script.getAttribute('src') || '';
    appUrl = src.replace(/\/widget\.js.*$/, '');
  }

  var chatUrl = appUrl + '/chat/' + encodeURIComponent(tenantId);
  var isOpen = false;

  var style = document.createElement('style');
  style.textContent = '\
    #chatbot-widget-btn {\
      position: fixed;\
      bottom: 20px;\
      right: 20px;\
      width: 52px;\
      height: 52px;\
      border-radius: 50%;\
      border: none;\
      background: #0d9488;\
      color: #fff;\
      font-size: 13px;\
      font-weight: 600;\
      cursor: pointer;\
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\
      z-index: 999999;\
      transition: transform 0.15s, box-shadow 0.15s;\
      display: flex;\
      align-items: center;\
      justify-content: center;\
      font-family: sans-serif;\
    }\
    #chatbot-widget-btn:hover {\
      transform: scale(1.05);\
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);\
    }\
    #chatbot-widget-frame {\
      position: fixed;\
      bottom: 84px;\
      right: 20px;\
      width: 380px;\
      height: 540px;\
      max-width: calc(100vw - 40px);\
      max-height: calc(100vh - 120px);\
      border: 1px solid #e2e8f0;\
      border-radius: 12px;\
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);\
      z-index: 999998;\
      opacity: 0;\
      transform: translateY(8px);\
      transition: opacity 0.2s, transform 0.2s;\
      pointer-events: none;\
      background: #f8fafc;\
    }\
    #chatbot-widget-frame.open {\
      opacity: 1;\
      transform: translateY(0);\
      pointer-events: auto;\
    }\
    @media (max-width: 480px) {\
      #chatbot-widget-frame {\
        bottom: 0;\
        right: 0;\
        width: 100vw;\
        height: 100vh;\
        max-width: 100vw;\
        max-height: 100vh;\
        border-radius: 0;\
        border: none;\
      }\
    }\
  ';
  document.head.appendChild(style);

  var iframe = document.createElement('iframe');
  iframe.id = 'chatbot-widget-frame';
  iframe.src = chatUrl;
  iframe.title = '採用Q&A';
  iframe.setAttribute('loading', 'lazy');
  document.body.appendChild(iframe);

  var btn = document.createElement('button');
  btn.id = 'chatbot-widget-btn';
  btn.textContent = 'Q&A';
  btn.setAttribute('aria-label', '質問する');
  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    isOpen = !isOpen;
    iframe.classList.toggle('open', isOpen);
    btn.textContent = isOpen ? '✕' : 'Q&A';
    btn.setAttribute('aria-label', isOpen ? '閉じる' : '質問する');
  });
})();
