# StoreSync Inventory management API documentation



#### **Actors**

* Storekeeper
* Manager
* Supplier
* Admin





**MAIN\_URL**:https://storesync-server.onrender.com



NB: *Header tokens are required for accessing most routes*









##### **ADMIN**

POST /admin/

DESCP To register admin

BODY {

&#x20;   "first\_name":"Alaric",

&#x20;   "last\_name":"saltzman",

&#x20;   "email":"saltz@gmail.com",

&#x20;   "contact":"07009909812",

&#x20;   "password":"1234"

}



POST /admin/login

DESCP To login admin

BODY {

&#x20;   "email":"saltz@gmail.com",

&#x20;   "password":"1234"

}







GET /admin/ \[TOKEN REQUIRED]\[AUTHORIZATION- admin]

DESCP To get all staffs



GET /admin/:staff\_id \[TOKEN REQUIRED]\[AUTHORIZATION-admin]

DESCP To get staff by id



PUT /admin/update/:admin\_id \[TOKEN REQUIRED]\[AUTHORIZATION-admin]

DESCP To update admin profile

BODY {

&#x20;   "first\_name":"Alaric",

&#x20;   "last\_name":"saltzman",

&#x20;   "email":"saltz@gmail.com",

&#x20;   "contact":"07009909812",

&#x20;   "password":"1234",

&#x20;   "avatar":"me.png",

&#x20;   "bio": Acknowledge me"

}





DELETE /admin/delete/:staff\_id \[TOKEN REQUIRED]\[AUTHORIZATION-admin]

DESCP To erase a staff by id





PUT /admin/change\_role/:staff\_id \[TOKEN REQUIRED]\[AUTHORIZATION-admin]

DESCP To assign a role to a staff

BODY {

&#x20;   "role":"manager"

}







##### **STAFF**

POST /staff/

DESCP To register staff

BODY {

&#x20;   "first\_name":"Alaric",

&#x20;   "last\_name":"saltzman",

&#x20;   "email":"saltz@gmail.com",

&#x20;   "contact":"07009909812",

&#x20;   "password":"1234"

}



GET /staff/

DESCP To get all staffs





POST /staff/login

DESCP To login staff

BODY {

&#x20;   "email":"saltz@gmail.com",

&#x20;   "password":"1234"

}





GET /staff/employee/:staff\_id \[TOKEN REQUIRED]

DESCP To get a staff by id





PUT /staff/update/:staff\_id \[TOKEN REQUIRED]\[AUTHORIZATION-staff]

DESCP To update profile

BODY {

&#x20;   "first\_name":"Alaric",

&#x20;   "last\_name":"saltzman",

&#x20;   "email":"saltz@gmail.com",

&#x20;   "contact":"07009909812",

&#x20;   "password":"1234",

&#x20;   "avatar":"me.png",

&#x20;   "bio":"i am a staff"

}



GET /staff/delete/:staff\_id \[TOKEN REQUIRED] \[AUTHORIZATION-admin]

DESCP To erase a staff by id













##### **PRODUCT**

GET /products/

DESCP To get all registered products





GET /products/:product\_id

DESCP To get a single product





POST /products/ \[TOKEN REQUIRED]\[AUTHORIZATION-manager]

DESCP To create new products

BODY {

&#x09;"product\_name":"Coke",

&#x09;"unitPrice":"20,000",

&#x09;"reorderThreshold":"4",

&#x09;"category":"12392022",

&#x09;"inStock": true,

&#x09;"quantity":"12"



}







PUT /products/update/:product\_id

DESCP To update details of products

BODY {

&#x09;"product\_name":"coke",

&#x09;"unitPrice":"20,000",

&#x09;"reorderThreshold":"4",

&#x09;"inStock": true,

&#x09;"quantity":"12"

}





PUT /products/update/:product\_id \[TOKEN REQUIRED]\[AUTHORIZATION-manager, admin]

DESCP To upload product image

BODY {

&#x09;"product\_image":"coke.png"

}





PUT /products/update/:product\_id \[TOKEN REQUIRED]\[AUTHORIZATION-manager, admin]

DESCP To updae category to a product

BODY {

&#x09;"category":"12392022"

}





GET /products/:cat\_id/category

DESCP To get all products of a category







DELETE /products/delete/:product\_id \[TOKEN REQUIRED]\[AUTHORIZATION-manager, admin]

DESCP To delete product





##### **CATEGORY**

POST /categories/create \[TOKEN REQUIRED]\[AUTHORIZATION-storekeeper]

DESCP To create new categories

BODY {

&#x20;   "cat\_name": "Institutional Accessories"

}



GET /categories/

DESCP To get all categories







GET /categories/:cat\_id

DESCP To get a single category





PUT /categories/update/:cat\_id \[TOKEN REQUIRED]\[AUTHORIZATION-storekeeper]

DESCP To update category

BODY {

&#x20;   "cat\_name": "Institutional Accessories"

}





PUT /categories/update/:cat\_id \[TOKEN REQUIRED]\[AUTHORIZATION-storekeeper]

DESCP To upload category image

BODY {

&#x20;   "cat\_img": "coke.png"

}





DELETE /categories/delete/:cat\_id \[TOKEN REQUIRED]\[AUTHORIZATION-storekeeper]

DESCP To delete category













##### **SUPPLIER**

POST /suppliers/create \[TOKEN REQUIRED]\[AUTHORIZATION-manager, admin]

DESCP To create new supplier

BODY {

&#x20;   "supplier\_name":"John Doe's eatry",

&#x20;   "supplier\_agent":"Maduka charles",

&#x20;    "agent\_contact":"09085234577",

&#x20;    "supplier\_email":"Doe@gmail.com",

&#x20;    "supplier\_location":"plot5 washinton street garki",

&#x20;    "delivery\_address":"plot 3B evergreen plaza area 1"

}





GET /suppliers/

DESCP To gett all suppliers





GET /suppliers/:sup\_id

DESCP To get a supplier by id





PUT /suppliers/update/:sup\_id \[TOKEN REQUIRED]\[AUTHORIZATION-manager, admin]

DESCP To update  a supplier's details

BODY {

&#x20;   "supplier\_name":"John Doe's eatry",

&#x20;   "supplier\_agent":"Maduka charles",

&#x20;    "agent\_contact":"09085234577",

&#x20;    "supplier\_email":"Doe@gmail.com",

&#x20;    "supplier\_location":"plot5 washinton street garki",

&#x20;    "delivery\_address":"plot 3B evergreen plaza area 1"

&#x20;    "status":\['active', 'inactive', 'suspended']

&#x20;    "website":"Doe@gmail.com"

&#x20;    "business\_type":\["manufacturer", "distributor", "company", "individual"]

&#x20;    "currency\_of\_transaction":"NGN"

&#x20;    "sup\_bank":"Access bank"

&#x20;    "sup\_bank\_account":"1856181303"

}





DELETE /suppliers/delete/:sup\_id \[TOKEN REQUIRED]\[AUTHORIZATION-admin]

DESCP To delete a supplier's details

















##### **WAREHOUSE**

POST /warehouses/create\[TOKEN REQUIRED]\[AUTHORIZATION-manager]

DESCP To create new warehouse

BODY {

&#x20;   "ware\_name":"Nnamdi azikiwe warehouse",

&#x20;   "ware\_address":"Walton street plot7b gwagwalada",

&#x20;   "ware\_city":"FCT",

&#x20;   "ware\_country":"Nigeria"

}





GET /warehouses/

DESCP To retrieve all warehouses





GET /warehouses/:warehouse\_id

DESCP To get a warehouse by id





PUT /warehouses/update/:warehouse\_id \[TOKEN REQUIRED]\[AUTHORIZATION-manager]

DESCP To update a warehouse

BODY {

&#x20;   "name":"Nnamdi azikiwe warehouse",

&#x20;   "address":"Walton street plot7b gwagwalada",

&#x20;   "city":"FCT",

&#x20;   "country":"Nigeria",

&#x20;   "status":\["active", "inactive", "suspended"],

&#x20;  "manager\_id":"6ad97cfa2052a00f29747553"

&#x20;  "ware\_bank":"Fidelity bank"

&#x20;  "ware\_bank\_account":"1056180003"



}





PUT /warehouses/update/:warehouse\_id \[TOKEN REQUIRED]\[AUTHORIZATION-manager]

DESCP To upload a warehouse image

BODY {

&#x20;    "warehouse\_image":"house.avif",

}





DELETE /warehouses/delete/:warehouse\_id \[TOKEN REQUIRED]\[AUTHORIZATION- admin]

DESCP To delete a warehouse











##### **PURCHASE**

POST /purchases/ \[TOKEN REQUIRED]\[AUTHORIZATION-manager]

DESCP To make a purchase

BODY{

&#x20;  "supplier":"6ada06ec3f1c56e245399879",

&#x20;  "items":\[

&#x20;       	{

&#x20;           	  "product":"6ad75d6cead0beded09a488e",

&#x20;           	  "quantity":103,

&#x20;           	  "unit\_purchase\_cost":20

&#x20;       	}

&#x20;  	],

&#x20;  "warehouse":"6ada093231a842d12136b5b5",

&#x20;  "status":\["completed", "failed", "pending"]

}



GET /purchases/ \[TOKEN REQUIRED]

DESCP To get all purchases



GET /purchases/get/:purchase\_id \[TOKEN REQUIRED]

DESCP To get a purchase by id



GET /purchases/:purchase\_id/receive \[TOKEN REQUIRED]\[AUTHORIZATION- admin]

DESCP To recieve a purchase



GET /purchases/get/purchases\_from/:warehouse\_id \[TOKEN REQUIRED]

DESCP To get purchases under a warehouse



DELETE /purchases/delete/:purchase\_id" \[TOKEN REQUIRED]\[AUTHORIZATION-manager]

DESCP To erase a purchase by id









##### **PURCHASE REPORT**

GET /purchase\_report/ \[TOKEN REQUIRED]\[AUTHORIZATION- admin, manager, storekeeper]

DESCP To get purchase reports





##### **SALES REPORT**

GET /sale\_report/ \[TOKEN REQUIRED]\[AUTHORIZATION- admin, manager, storekeeper]

DESCP To get sales reports









##### **STOCK**

POST /stocks/createStock/ \[TOKEN REQUIRED]\[AUTHORIZATION-storekeeper]

DESCP To create a stock

BODY {

&#x20;   "product":"6ad77d8f04091b90e37a597d",

&#x20;   "warehouse":"7ad79d8f04091b90e37a007d",

&#x20;   "category":"6ad77d8fdac91b90e37a597d",

&#x20;   "quantity":10,

}





GET /stocks/getAll/ \[TOKEN REQUIRED]

DESCP To retrieve all stocks





GET /stocks/getAll\_by/:stock\_id \[TOKEN REQUIRED]

DESCP To retrieve a stock





PUT /stocks/stock\_update/:stock\_id \[TOKEN REQUIRED]\[AUTHORIZATION-manager, admin]

DESCP To update a stock (if necessary)

BODY {

&#x20;   "product":"6ad77d8f04091b90e37a597d",

&#x20;   "warehouse":"7ad79d8f04091b90e37a007d",

&#x20;   "category":"6ad77d8fdac91b90e37a597d",

&#x20;   "quantity":10,

}





DELETE /stocks/erase/:stock\_id \[TOKEN REQUIRED]\[AUTHORIZATION- admin]

DESCP To delete a stock (if necessary)





GET /stocks/getFrom/:warehouse\_id \[TOKEN REQUIRED]

DESCP To get stocks under a warehouse





GET /stocks/getBy/:cat\_id/from/:warehouse\_id \[TOKEN REQUIRED]

DESCP To get stocks of a specific category under a warehouse













##### **STOCK MOVEMENT**

POST /stock\_movements/create/ \[TOKEN REQUIRED]\[AUTHORIZATION-storekeeper]

DESCP To create a stock movements that updates the stock's quantity

BODY {

&#x09;"product":"6ad7a2cb76b0d1b075ee2bd2",

&#x20;	"warehouse":"6ad7a2cb76b0d1b075ee2bd2",

&#x20;	"category":"6ad7a2cb76b0d1b075ee2bd2",

&#x20;	"quantity\_affected":7,

&#x20;	"movementType":\["stock-in","stock-out", "adjusted-in", "adjusted-out"],

&#x20;	"reason":"Intitial stock retrieved",

&#x09;"referenceType":\["purchase","sale","adjustment"]

&#x20;}





GET /stock\_movements/getAll/ \[TOKEN REQUIRED]

DESCP To get all stock movements





GET /stock\_movements/getBy/:movement\_id \[TOKEN REQUIRED]

DESCP To get a stock movement by id





GET /stock\_movements/getOf/:product\_id \[TOKEN REQUIRED]

DESCP To get all stock movements of a product





GET /stock\_movements/getFrom/:warehouse\_id \[TOKEN REQUIRED]

DESCP To get all stock movements under a warehouse



POST /stock\_movements/adjust \[TOKEN REQUIRED]\[AUTHORIZATION-storekeeper]

DESCP To adjust adjust a stock

BODY {

&#x20; "product": "6ad7a2cb76b0d1b075ee2bd2",

&#x20; "warehouse": "6ada093231a842d12136b5b5",

&#x20; "category": "6ad77d8f04091b90e37a597d",

&#x20; "actualQuantity": 45,

&#x20; "reason": "Physical stock count correction"

}





##### **STOCK SUMMARY**

GET /stockSummary/summary/  \[TOKEN REQUIRED]\[AUTHORIZATION-admin]

DESCP To get all stock summaries







##### **SALES**



POST /sales/ \[TOKEN REQUIRED]\[AUTHORIZATION-manager]

DESCP To make sales

BODY{

&#x20;   "warehouse":"6ada093231a842d12136b5b5",

&#x20;   "items":\[

&#x20;       {

&#x20;           "product":"6ad7a2cb76b0d1b075ee2bd2",

&#x20;           "quantity":10,

&#x20;           "unit\_selling\_price":20000

&#x20;       }

&#x20;   ]

}





GET /sales/getAll/  \[TOKEN REQUIRED]

DESCP To get all sales





GET /sales/getAll/:sale\_id \[TOKEN REQUIRED]

DESCP To get a sale by id





GET /sales/getFrom/:warehouse\_id \[TOKEN REQUIRED]

DESCP To get sales under a warehouse









##### **Low\_stock\_report**



GET /sales/getAll/  \[TOKEN REQUIRED]

DESCP To get a sale by id

