const analyticsTools = {
    logging: false,
    ga4: {
        enabled: true,
        debug_mode: false,
        id: 'G-XXXXXXXXXX',
        sendEvent: function (eventName, eventData) {
            // send event to Google Analytics 4
            gtag('event', eventName, eventData);
        },
    },
    gtm: {
        enabled: true,
        id: 'GTM-XXXXXXXXXX',
        sendEvent: function (eventName, eventData) {
            // send event to Google Tag Manager
            dataLayer.push({ event: eventName, ...eventData });
        }
    },
    fbq: {
        enabled: true,
        id: 'XXXXXXXXXX',
        sendEvent: function (eventName, eventData) {
            // send event to Facebook Pixel
            fbq('track', eventName, eventData);
        }
    }
};

function log(message = '') {
    window.console.log(message);
}

window.dataLayer = window.dataLayer || [];

const gtag = function () {
    dataLayer.push(arguments);
};

if (analyticsTools.ga4.enabled) {
  // Initialize Google Analytics 4
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

if (analyticsTools.fbq.enabled) {
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

if (analyticsTools.gtm.enabled) {
  log(`Initializing Google Tag Manager with ID ${analyticsTools.gtm.id}`);
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer', analyticsTools.gtm.id);
}

// Step 2. Subscribe to customer events using the analytics.subscribe() API
analytics.subscribe("collection_viewed", async (event) => {
  if (analyticsTools.ga4.enabled) {
    analyticsTools.ga4.sendEvent("view_item_list", event.data);
  }
  if (analyticsTools.gtm.enabled) {
    analyticsTools.gtm.sendEvent("collection_viewed", event.data);
  }
  if (analyticsTools.fbq.enabled) {
    analyticsTools.fbq.sendEvent("ViewContent", {
      content_ids: [event.data.collection.id],
      content_type: 'product_group',
    });
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});

analytics.subscribe("page_viewed", async (event) => {
  const href = event.context.document.location.href;
  let data = {
    page_location: href,
    page_title: event.context.document.title,
    page_referrer: event.context.document.referrer,
    language: event.context.language,
  }
  if (analyticsTools.ga4.enabled) {
    analyticsTools.ga4.sendEvent("page_view", data);
  }
  if (analyticsTools.gtm.enabled) {
    analyticsTools.gtm.sendEvent("page_viewed", data);
  }
  if (analyticsTools.fbq.enabled) {
    analyticsTools.fbq.sendEvent("PageView");
  }
  if (href.includes("/cart")) {
    analyticsTools.ga4.sendEvent("view_cart", data);
    analyticsTools.gtm.sendEvent("cart_viewed", data);
  }
  if (href.includes("/information")) {
    if (analyticsTools.ga4.enabled) {
      analyticsTools.ga4.sendEvent("add_contact_information", data);
    }
    if (analyticsTools.gtm.enabled) {
      analyticsTools.gtm.sendEvent("contact_step_viewed", data);
    }
  }
  if (href.includes("/shipping")) {
    if (analyticsTools.ga4.enabled) {
      analyticsTools.ga4.sendEvent("add_shipping_info", data);
    }
    if (analyticsTools.gtm.enabled) {
      analyticsTools.gtm.sendEvent("shipping_step_viewed", data);
    }
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});

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
  // Send events to analytics tools
  if (analyticsTools.ga4.enabled) {
    analyticsTools.ga4.sendEvent("view_item", data);
  }
  if (analyticsTools.gtm.enabled) {
    analyticsTools.gtm.sendEvent("product_viewed", data);
  }
  if (analyticsTools.fbq.enabled) {
    analyticsTools.fbq.sendEvent("ViewContent", {
      content_ids: [event.data.productVariant.id],
      content_name: event.data.productVariant.title,
      currency: event.data.productVariant.price.currencyCode,
      value: event.data.productVariant.price.amount,
    });
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});

analytics.subscribe("search_submitted", async (event) => {
  // Send events to analytics tools
  if (analyticsTools.ga4.enabled) {
    analyticsTools.ga4.sendEvent("search", { search_term: event.data.searchResult.query });
  }
  if (analyticsTools.gtm.enabled) {
    analyticsTools.gtm.sendEvent("search_submitted", { search_term: event.data.searchResult.query });
  }
  if (analyticsTools.fbq.enabled) {
    analyticsTools.fbq.sendEvent("Search", {
      search_string: event.searchResult.query
    });
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});

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
    if (analyticsTools.ga4.enabled) {
      analyticsTools.ga4.sendEvent('add_to_cart', data);
    }

    if (analyticsTools.gtm.enabled) {
      analyticsTools.gtm.sendEvent('item_added', data);
    }

    if (analyticsTools.fbq.enabled) {
      analyticsTools.fbq.sendEvent('AddToCart', {
        content_ids: [event.data.cartLine.merchandise.product.id],
        content_name: event.data.cartLine.merchandise.product.title,
        currency: event.data.cartLine.merchandise.price.currencyCode,
        value: event.data.cartLine.merchandise.price.amount,
      });
    }
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});

analytics.subscribe("checkout_started", async (event) => {
  if(event.data.checkout.totalPrice.amount > 0) {
    let items = []
    for (const item of event.data.checkout.lineItems) {
      items.push({
        item_id: item.variant.product.id,
        item_name: item.variant.product.title,
        item_brand: item.variant.product.vendor,
        item_variant: item.variant.title,
        item_sku: item.variant.sku,
        price: item.variant.price.amount,
        currency: item.variant.price.currencyCode,
        quantity: item.quantity
      });
    }
    let data = {
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      items: items,
    }
    analyticsTools.ga4.sendEvent("begin_checkout", data);
    analyticsTools.gtm.sendEvent("checkout", data);
    analyticsTools.fbq.sendEvent('InitiateCheckout', {
      value: event.data.checkout.totalPrice.amount,
      currency: event.data.checkout.currencyCode,
      content_type: 'product',
      content_ids: event.data.checkout.lineItems.map(item => item.variant.product.id),
      contents: event.data.checkout.lineItems.map(item => ({
        id: item.variant.product.id,
        quantity: item.quantity,
        price: item.variant.price.amount,
      })),
    });
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});

analytics.subscribe("payment_info_submitted", async (event) => {
  if(event.data.checkout.totalPrice.amount > 0) {
    let items = []
    for (const item of event.data.checkout.lineItems) {
      items.push({
        item_id: item.variant.product.id,
        item_name: item.variant.product.title,
        item_brand: item.variant.product.vendor,
        item_variant: item.variant.title,
        item_sku: item.variant.sku,
        price: item.variant.price.amount,
        currency: item.variant.price.currencyCode,
        quantity: item.quantity
      });
    }
    let data = {
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      items: items
    }
    analyticsTools.ga4.sendEvent("add_payment_info", data);
    analyticsTools.gtm.sendEvent("payment_step_viewed", data);
    analyticsTools.fbq.sendEvent('AddPaymentInfo', {
      value: event.data.checkout.totalPrice.amount,
      currency: event.data.checkout.currencyCode,
    });
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});

analytics.subscribe("checkout_completed", async (event) => {
  if(event.data.checkout.totalPrice.amount > 0) {
    let items = []
    for (const item of event.data.checkout.lineItems) {
      items.push({
        item_id: item.variant.product.id,
        item_name: item.variant.product.title,
        item_brand: item.variant.product.vendor,
        item_variant: item.variant.title,
        item_sku: item.variant.sku,
        price: item.variant.price.amount,
        currency: item.variant.price.currencyCode,
        quantity: item.quantity
      });
    }
    let data = {
      transaction_id: event.data.checkout.order.id,
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      shipping: event.data.checkout.shippingLine.price.amount,
      tax: event.data.checkout.totalTax.amount,
      items: items
    }
    analyticsTools.ga4.sendEvent("purchase", data);
    analyticsTools.gtm.sendEvent("checkout_completed", data);
    analyticsTools.fbq.sendEvent("Purchase", data);
  }
  if(analyticsTools.logging) log(JSON.stringify(event));
});
