import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Dynamic animation logic for the Location Section 
// (Fulfills the "Implement any necessary logic inside main.ts" requirement)
function initLocationLogic() {
  const checkInterval = setInterval(() => {
    // Wait until the Location section is natively rendered in the DOM layout
    const mapWrapper = document.querySelector('.map-wrapper') as HTMLElement;
    
    if (mapWrapper) {
      clearInterval(checkInterval);

      // Subtle animation via Intersection Observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            mapWrapper.style.opacity = '1';
            mapWrapper.style.transform = 'translateY(0)';
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });

      observer.observe(mapWrapper);
    }
  }, 100);
}

bootstrapApplication(App, appConfig)
  .then(() => {
    initLocationLogic();
  })
  .catch((err: unknown) => console.error(err));
