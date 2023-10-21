## Development:

Created a Real time chat application using web sockets with place order and live chat feature. Intuitive UI with offline and dark mode support.

## App name: MEDICHAT
Developed a screen to place the order with the following fields.
  
    1. Customer Name
    2. Phone Number
    3. Items to be Ordered
    4. Expected Delivery Date
  **Note**: All fields are Required. Validations are added.

## Live chat feature where multiple users will be connected to a single channel. It includes the following features:
```
1. The user name (if provided) along with the message’s sent time will be displayed in the user’s mobile time zone.   
2. The placed orders will be displayed with all the details.  
3. Feature to Filter the messages/orders with multiple filter options.  
4. Feature to Search the messages/orders with any text comparison.  
5. Option to scroll to bottom using the icon provided in live chat modal.  
6. The number of unread messages will be displayed as a badge over the chat icon in the place order screen and when users enter the chat modal it will scroll to the first unread message automatically.  
7. When the user is in the chat modal and a new message has been arrived it will scroll automatically to the latest message sent in the group.  
```

## Implemented a cloud based Web socket server using Node JS which will perform the following:
  ``` 
1. Create a new WebSocket Server.   
2. If the connection is established the WebSocket Server will listen for all the incoming messages to the server from various clients connected to the same server.
3. Once received it will broadcast the message to all the clients connected at that time.
4. Server hosted in cloud: https://admin.evennode.com/a/d/medichat/info
```

## Handled the Offline scenario:
```  
1. When the network connection is lost, a banner will be animated from the top saying “You’re offline!” and stay at the top of the screen until the app is online.
2. Once the network connectivity is available, the banner will be changed to “You’re back online!” and will be animated out.
3. When the app is offline, the place order and message sending will be disabled, you can see the list of existing messages/orders in the chat channel and use Search and Filter options.
4. Also added a wifi off icon in the Chat Modal near the message input to indicate the user that he/she is offline.
5. Added customised app icon and lottie splash screen for the app.
6. A modal will be displayed on app launch to enter the name which will be used for chatting service.
7. Added Error Boundary to handle logging and exceptions with custom UI, so that when the app crashes for some reason, the user will see only the custom UI and the app will not crash.
8. Websocket error state, close state and reconnection are also handled and if the connection is closed for some reason it will be retried every second in the background until the connection is open again to make the connection more stable and for a better user experience.
9. Dark mode is also supported.
```

## Testing approach:
Tested all possible ways the above feature would be used.
```
Step 1: Open the MEDICHAT app.
Step 2: A modal will be displayed to enter the name to use it for the chatting purpose, which is optional. If name is not given, the receiver will see the sender’s name as Anonymous.
Step 3: To place the order, fill up the details and click on the “Place Order” button(all four fields are mandatory).
Step 4: Click on the chat icon at the bottom to send/ check the messages in the chat channel. Also the list of orders will be displayed in the chat channel.
Step 5: Click on the Filter icon to filter the messages/orders in the channel. (Filter options: All, Orders, Messages, My Orders, My Messages)
Step 6: Click on the Search icon to search for the required message/orders in the channel.
Note: Both Filter and Search can be added at the same time.
Step 7: The count of unread messages will be displayed as a badge over the chat icon.
Step 8: Turn off the internet and check whether message or order placement can be done.
```

**Note**: Switch to main branch to access the project files.
