// analytics.js - Zoptymalizowana wersja dla pentestera
(() => {
    const plausible = window.plausible = window.plausible || ((...args) => (window.plausible.q = window.plausible.q || []).push(args));
  
    const trackEvent = (eventName, props) => {
      plausible(eventName, { props });
      console.log('Event tracked:', eventName, props);
    };
  
    const getEnvironmentInfo = () => ({
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      doNotTrack: navigator.doNotTrack,
      cookiesEnabled: navigator.cookieEnabled,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      adBlocker: detectAdBlocker(),
      battery: getBatteryInfo(),
      network: getNetworkInfo(),
      plugins: getPluginsInfo(),
      canvas: getCanvasFingerprint()
    });
  
    const detectAdBlocker = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      document.body.appendChild(testAd);
      const adBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      return adBlocked;
    };
  
    const getBatteryInfo = () => {
      if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
          trackEvent('Battery Info', {
            level: battery.level,
            charging: battery.charging
          });
        });
      }
      return 'Not available';
    };
  
    const getNetworkInfo = () => 
      navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : 'Not available';
  
    const getPluginsInfo = () => 
      Array.from(navigator.plugins).map(plugin => plugin.name);
  
    const getCanvasFingerprint = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.font = "14px 'Arial'";
      ctx.fillText("Hello, World!", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("Hello, World!", 4, 17);
      return canvas.toDataURL();
    };
  
    document.addEventListener('click', e => {
      trackEvent('User Click', {
        elementType: e.target.tagName,
        elementId: e.target.id,
        elementClass: e.target.className,
        pageX: e.pageX,
        pageY: e.pageY
      });
    });
  
    document.addEventListener('input', e => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        trackEvent('Input Interaction', {
          inputType: e.target.type,
          inputName: e.target.name,
          inputId: e.target.id
        });
      }
    });
  
    window.onerror = (message, source, lineno, colno, error) => {
      trackEvent('JavaScript Error', {
        message,
        source,
        lineno,
        colno,
        stack: error ? error.stack : 'N/A'
      });
    };
  
    window.addEventListener('error', e => {
      if (['IMG', 'SCRIPT', 'LINK'].includes(e.target.tagName)) {
        trackEvent('Resource Load Error', {
          resourceType: e.target.tagName,
          source: e.target.src || e.target.href
        });
      }
    }, true);
  
    const initTracking = () => {
      const envInfo = getEnvironmentInfo();
      trackEvent('Session Start', envInfo);
  
      const startTime = new Date();
      window.addEventListener('beforeunload', () => {
        const timeSpent = (new Date() - startTime) / 1000;
        trackEvent('Session End', { duration: timeSpent });
      });
  
      console.log('Enhanced tracking initialized');
    };
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTracking);
    } else {
      initTracking();
    }
  })();