# Chaterz API docs

### * Sign Up :

`/signup/`

Post the key **email** with the user email as value / Post the key**username** with the user name as value / Post the key **password** withe the user password as value.

### * Log in

`/login/`

Post the key **username** with the user name as value / Post the key **password** with the user password as value.

### * Create Enterprise

`/create/enterprise/`

Post the key **name** with the enterprise name as value / Post the key **author** with the user name of the user who wants to create this enterprise as value.

### * Create Channel

`/create/channel/`

Post the key **enterprise** with the enterprise name as value / Post the key **name** with the channel name as value / Post the key **author** with the user name of the user who wants to create this channel as value.

### * Join Channel

`/join/channel`

Post the key **user** with the username of the user who whants to join the channel as value / Post the key **channel** with the channel name as value.

### * Create Post

`/post/message/`

Post the key **user** with the user name of the user who wants to post the message as value / Post the key **content** with the content of the message as value / Post the key **channel** with the channel name as value / Post the key **enterprise** with the enterprise name as value.

### * Get Enterprises

`/get/enterprises/`

Will return the lists of enterprises

### * Get Channels

`/get/channels/:enterprise`

Replace **:enterprise** with the enterprise name

Will return the lists of channels

### * Get Members

`/get/members/:enterprise/:channel`

Replace **:enterprise** with the enterprise name / Replace **:channel** with the channel name