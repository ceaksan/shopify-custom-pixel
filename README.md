# README
This code is used for integrating analytics tools such as Google Analytics 4, Google Tag Manager, and Facebook Pixel to a website. The code sets up event listeners for various events and sends the relevant data to the specified analytics tools.

## Getting Started
To get started with this code, you need to have the analytics tools' IDs and necessary permissions to access them. Once you have the IDs, you can add them to the analyticsTools object as shown in the code. You can also choose which tools to enable by setting the enabled property to true or false.

### Usage
The code sets up event listeners for various events such as collection_viewed, page_viewed, product_viewed, search_submitted, product_added_to_cart, checkout_started, payment_info_submitted, and checkout_completed. When these events occur, the code sends the relevant data to the specified analytics tools using the sendEvent() function defined in the analyticsTools object.

You can subscribe to these events using the analytics.subscribe() API. The sendEvent() function in the analyticsTools object is called with the appropriate event name and data.

Note that the code is written assuming that the analytics object already exists and is a valid object. If you are using a different analytics library, you will need to modify the code to work with your library.

## Configuration
You can configure the analytics tools by modifying the properties in the analyticsTools object. For example, you can enable or disable a tool by setting the enabled property to true or false. You can also change the ID for a tool or enable/disable debug mode.
