import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { trackEvent, Events } from './analytics';

// Sentry yapılandırması
export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        // Hassas bilgileri temizle
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
        }
        return event;
      },
    });
  }
};

// Hata raporlama
export const reportError = (error, context = {}) => {
  console.error('Hata oluştu:', error);

  // Analytics'e bildir
  trackEvent(Events.ERROR_OCCURRED, {
    error: error.message,
    type: error.name,
    ...context
  });

  // Production'da Sentry'ye gönder
  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope((scope) => {
      // Context ekle
      Object.keys(context).forEach(key => {
        scope.setExtra(key, context[key]);
      });

      Sentry.captureException(error);
    });
  }
};

// Performance izleme
export const trackPerformance = (metricName, value, context = {}) => {
  // Analytics'e bildir
  trackEvent(Events.PERFORMANCE_ISSUE, {
    metric: metricName,
    value,
    ...context
  });

  // Production'da Sentry'ye gönder
  if (process.env.NODE_ENV === 'production') {
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${metricName}: ${value}`,
      level: 'info',
      data: context
    });

    // Eğer performans kritik seviyede kötüyse hata olarak raporla
    if (isPerformanceCritical(metricName, value)) {
      const error = new Error(`Performance issue: ${metricName}`);
      reportError(error, { metricName, value, ...context });
    }
  }
};

// Performans metriklerinin kritik seviyelerini kontrol et
const isPerformanceCritical = (metricName, value) => {
  const thresholds = {
    'page-load': 5000,    // 5 saniye
    'api-response': 3000, // 3 saniye
    'render-time': 1000,  // 1 saniye
    'memory-usage': 90,   // %90 kullanım
    'cpu-usage': 80      // %80 kullanım
  };

  return value > (thresholds[metricName] || Infinity);
};

// React bileşenleri için hata sınırı
export const ErrorBoundary = Sentry.ErrorBoundary;

// Kullanım örneği:
/*
  // Hata raporlama
  try {
    // ... kod ...
  } catch (error) {
    reportError(error, {
      component: 'LoginForm',
      action: 'submit'
    });
  }

  // Performance izleme
  trackPerformance('page-load', 3200, {
    page: 'home',
    connection: 'wifi'
  });

  // React bileşeninde ErrorBoundary kullanımı
  <ErrorBoundary fallback={<ErrorFallback />}>
    <MyComponent />
  </ErrorBoundary>
*/ 