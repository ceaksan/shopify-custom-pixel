const analyticsTools = {
  logging: false,
  ga4: {
    enabled: true,
    debug_mode: false,
    id: 'G-XXXXXXXXXX',
  },
  gtm: {
    enabled: true,
    id: 'GTM-XXXXXXXXXX',
  },
  fbq: {
    enabled: true,
    id: 'XXXXXXXXXX',
  },
};

function log(message = '') {
  window.console.log(message);
}

window.dataLayer = window.dataLayer || [];

const gtag = function () {
  dataLayer.push(arguments);
};

function initializeGoogleAnalytics4() {
  log(`Initializing Google Analytics 4 with ID ${analyticsTools.ga4.id}`);
  const script = document.createElement('script');
  script.setAttribute(
    'src',
    'https://www.googletagmanager.com/gtag/js?id=' + analyticsTools.ga4.id);
  script.setAttribute('async', '');
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', analyticsTools.ga4.id, {
    send_page_view: false,
    debug_mode: analyticsTools.ga4.debug_mode
  });
}

function initializeFacebookPixel() {
  log(`Initializing Facebook Meta Pixel with ID ${analyticsTools.fbq.id}`);
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', analyticsTools.fbq.id);
}

function initializeGoogleTagManager() {
  log(`Initializing Google Tag Manager with ID ${analyticsTools.gtm.id}`);
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer', analyticsTools.gtm.id);
}

function sendEventToGoogleAnalytics4(eventName, eventData) {
  if (analyticsTools.ga4.enabled) {
    gtag('event', eventName, eventData);
  }
}

function sendEventToGoogleTagManager(eventName, eventData) {
  if (analyticsTools.gtm.enabled) {
    dataLayer.push({ event: eventName, ...eventData });
  }
}

function sendEventToFacebookPixel(eventName, eventData) {
  if (analyticsTools.fbq.enabled) {
    fbq('track', eventName, eventData);
  }
}

// Step 2. Subscribe to customer events using the analytics.subscribe() API

// collection_viewed
analytics.subscribe("collection_viewed", async (event) => {
  sendEventToGoogleAnalytics4("view_item_list", event.data);
  sendEventToGoogleTagManager("collection_viewed", event.data);
  sendEventToFacebookPixel("ViewContent", {
    content_ids: [event.data.collection.id],
    content_type: 'product_group',
  });
  if(analyticsTools.logging) log(JSON.stringify(event));
});

// page_viewed
analytics.subscribe("page_viewed", async (event) => {
  const href = event.context.document.location.href;
  let data = {
    page_location: href,
    page_title: event.context.document.title,
    page_referrer: event.context.document.referrer,
    language: event.context.language,
  };
  
  sendEventToGoogleAnalytics4("page_view", data);
  sendEventToGoogleTagManager("page_viewed", data);
  sendEventToFacebookPixel("PageView");
  
  if (href.includes("/cart")) {
    sendEventToGoogleAnalytics4("view_cart", data);
    sendEventToGoogleTagManager("cart_viewed", data);
  }
  if (href.includes("/information")) {
    sendEventToGoogleAnalytics4("add_contact_information", data);
    sendEventToGoogleTagManager("contact_step_viewed", data);
  }
  if (href.includes("/shipping")) {
    sendEventToGoogleAnalytics4("add_shipping_info", data);
    sendEventToGoogleTagManager("shipping_step_viewed", data);
  }
  
  if(analyticsTools.logging) log(JSON.stringify(event));
});

// product_viewed
analytics.subscribe("product_viewed", async (event) => {
  let data = {
    currency: event.data.productVariant.price.currencyCode,
    value: event.data.productVariant.price.amount,
    items: [
      { 
        item_id: event.data.productVariant.id, 
        item_name: event.data.productVariant.product.title,
        item_brand: event.data.productVariant.product.vendor,
        price: event.data.productVariant.price.amount,
        item_variant: event.data.productVariant.title,
        item_sku: event.data.productVariant.sku,
        currency: event.data.productVariant.price.currencyCode,
        quantity: 1
      }
    ],
  };
  
  sendEventToGoogleAnalytics4("view_item", data);
  sendEventToGoogleTagManager("product_viewed", data);
  sendEventToFacebookPixel("ViewContent", {
    content_ids: [event.data.productVariant.id],
    content_name: event.data.productVariant.title,
    currency: event.data.productVariant.price.currencyCode,
    value: event.data.productVariant.price.amount,
  });
  
  if(analyticsTools.logging) log(JSON.stringify(event));
});

// search_submitted
analytics.subscribe("search_submitted", async (event) => {
  sendEventToGoogleAnalytics4("search", { search_term: event.data.searchResult.query });
  sendEventToGoogleTagManager("search_submitted", { search_term: event.data.searchResult.query });
  sendEventToFacebookPixel("Search", {
    search_string: event.searchResult.query
  });
  
  if(analyticsTools.logging) log(JSON.stringify(event));
});

// product_added_to_cart
analytics.subscribe("product_added_to_cart", async (event) => {
  if(event.data.cartLine.merchandise.price.amount > 0) {
    let data = {
      currency: event.data.cartLine.merchandise.price.currencyCode,
      value: event.data.cartLine.merchandise.price.amount,
      items: [
        { 
          item_id: event.data.cartLine.merchandise.product.id, 
          item_name: event.data.cartLine.merchandise.product.title,
          item_variant: event.data.cartLine.merchandise.title,
          item_brand: event.data.cartLine.merchandise.product.vendor,
          price: event.data.cartLine.merchandise.price.amount,
          quantity: event.data.cartLine.quantity,
          discount: parseFloat(
            Number(event.data.cartLine.merchandise.price.amount) -
            Number(event.data.cartLine.cost.totalAmount.amount)),
          currency: event.data.cartLine.merchandise.price.currencyCode,
        }
      ],
    }

    // Send events to analytics tools
    sendEventToGoogleAnalytics4('add_to_cart', data);
    sendEventToGoogleTagManager('item_added', data);
    sendEventToFacebookPixel('AddToCart', {
      content_ids: [event.data.cartLine.merchandise.product.id],
      content_name: event.data.cartLine.merchandise.product.title,
      currency: event.data.cartLine.merchandise.price.currencyCode,
      value: event.data.cartLine.merchandise.price.amount,
    });
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});

// checkout_started
analytics.subscribe("checkout_started", async (event) => {
  if (event.data.checkout.totalPrice.amount > 0) {
    const items = event.data.checkout.lineItems.map((item) => ({
      item_id: item.variant.product.id,
      item_name: item.variant.product.title,
      item_brand: item.variant.product.vendor,
      item_variant: item.variant.title,
      item_sku: item.variant.sku,
      price: item.variant.price.amount,
      currency: item.variant.price.currencyCode,
      quantity: item.quantity,
    }));

    const data = {
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      items,
    };

    sendEventToGoogleAnalytics4("begin_checkout", data);
    sendEventToGoogleTagManager("checkout", data);
    sendEventToFacebookPixel("InitiateCheckout", {
      value: event.data.checkout.totalPrice.amount,
      currency: event.data.checkout.currencyCode,
      content_type: 'product',
      content_ids: items.map((item) => item.item_id),
      contents: items.map((item) => ({
        id: item.item_id,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
});

// payment_info_submitted
analytics.subscribe("payment_info_submitted", async (event) => {
  if (event.data.checkout.totalPrice.amount > 0) {
    const items = event.data.checkout.lineItems.map((item) => ({
      item_id: item.variant.product.id,
      item_name: item.variant.product.title,
      item_brand: item.variant.product.vendor,
      item_variant: item.variant.title,
      item_sku: item.variant.sku,
      price: item.variant.price.amount,
      currency: item.variant.price.currencyCode,
      quantity: item.quantity,
    }));

    const data = {
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      items,
    };

    sendEventToGoogleAnalytics4("add_payment_info", data);
    sendEventToGoogleTagManager("payment_step_viewed", data);
    sendEventToFacebookPixel("AddPaymentInfo", {
      value: event.data.checkout.totalPrice.amount,
      currency: event.data.checkout.currencyCode,
    });
  }
});

// checkout_completed
analytics.subscribe("checkout_completed", async (event) => {
  if (event.data.checkout.totalPrice.amount > 0) {
    const items = event.data.checkout.lineItems.map(item => {
      return {
        item_id: item.variant.product.id,
        item_name: item.variant.product.title,
        item_brand: item.variant.product.vendor,
        item_variant: item.variant.title,
        item_sku: item.variant.sku,
        price: item.variant.price.amount,
        currency: item.variant.price.currencyCode,
        quantity: item.quantity
      }
    });

    const data = {
      transaction_id: event.data.checkout.order.id,
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      shipping: event.data.checkout.shippingLine.price.amount,
      tax: event.data.checkout.totalTax.amount,
      items: items
    };

    sendEventToGoogleAnalytics4("purchase", data);
    sendEventToGoogleTagManager("checkout_completed", data);
    sendEventToFacebookPixel("Purchase", {
      content_ids: items.map(item => item.item_id),
      content_type: 'product',
      value: data.value,
      currency: data.currency
    });
  }

  if (analyticsTools.logging) {
    log(JSON.stringify(event));
  }
});
