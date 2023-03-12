# README
This code is used for integrating analytics tools such as **Google Analytics 4**, **Google Tag Manager**, and **Facebook Pixel** to a Shopify website. The code sets up event listeners for various events and sends the relevant data to the specified analytics tools.

## Getting Started
To get started with this code, you need to have the analytics tools' IDs and necessary permissions to access them. Once you have the IDs, you can add them to the analyticsTools object as shown in the code. You can also choose which tools to enable by setting the enabled property to true or false.

### Usage
The code sets up event listeners for various events such as `collection_viewed`, `page_viewed`, `product_viewed`, `search_submitted`, `product_added_to_cart`, `checkout_started`, `payment_info_submitted`, and `checkout_completed`. When these events occur, the code sends the relevant data to the specified analytics tools using the sendEvent() function defined in the analyticsTools object.

To use this code, follow these steps:

Go to Shopify > Settings > Customer events > Add custom pixel.
Copy and paste the code into your Shopify theme.

You can subscribe to these events using the `analytics.subscribe()` API. The `sendEvent()` function in the `analyticsTools` object is called with the appropriate event name and data.

Note that the code is written assuming that the analytics object already exists and is a valid object. If you are using a different analytics library, you will need to modify the code to work with your library.

### Additional Information

For more information on how to create a Google Tag Manager custom pixel or custom pixel code, please refer to these links:
- [Google Tag Manager Custom Pixel Tutorial](https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels/gtm-tutorial)
- [Custom Pixel Code](https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels/code)

For a list of available customer events, refer to the Customer [Events Reference](https://shopify.dev/docs/api/pixels/customer-events#standard-events).

## Configuration
You can configure the analytics tools by modifying the properties in the analyticsTools object. For example, you can enable or disable a tool by setting the enabled property to true or false. You can also change the ID for a tool or enable/disable debug mode.
