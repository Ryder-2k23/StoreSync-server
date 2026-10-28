# StoreSync Inventory management API documentation



#### **Actors**

* Storekeeper
* Manager
* Supplier
* Admin





**MAIN\_URL**:http://localhost:6000/StoreSync



NB: *Header tokens are required for accessing most routes*







##### **PRODUCT**

GET /products/

DESCP To get all registered products





GET /products/:product\_id

DESCP To get a single product





POST /products/

DESCP To create new products

BODY {

&#x09;"product\_name":"Coke",

&#x09;"unitPrice":"20,000",

&#x09;"reorderThreshold":"4",

}







PUT /products/update/:product\_id

DESCP To update details of products

BODY {

&#x09;"product\_name":"coke",

&#x09;"unitPrice":"20,000",

&#x09;"reorderThreshold":"4",

&#x09;"inStock": "true",

&#x09;"quantity":"12"

}





PUT /products/update/:product\_id

DESCP To upload product image

BODY {

&#x09;"product\_image":"coke.png"

}





PUT /products/update/:product\_id

DESCP To assign category to a product

BODY {

&#x09;"category":"12392022"

}





GET /products/:cat\_id/category

DESCP To get all products of a category







DELETE /products/delete/:product\_id

DESCP To delete product





##### **CATEGORY**

POST /categories/create

DESCP To create new categories

BODY {

&#x20;   "cat\_name": "Institutional Accessories"

}



GET /categories/

DESCP To get all categories







GET /categories/:cat\_id

DESCP To get a single category





PUT /categories/update/:cat\_id

DESCP To update category

BODY {

&#x20;   "cat\_name": "Institutional Accessories"

}





PUT /categories/update/:cat\_id

DESCP To upload category image

BODY {

&#x20;   "cat\_img": "coke.png"

}





DELETE /categories/delete/:cat\_id

DESCP To delete category













##### **SUPPLIER**

POST /suppliers/create

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





PUT /suppliers/update/:sup\_id

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

&#x20;    **"**sup\_bank**":"**Access bank"

&#x20;    "sup\_bank\_account":"1856181303"

}





DELETE /suppliers/delete/:sup\_id

DESCP To delete a supplier's details

















##### **WAREHOUSE**

POST /warehouses/create

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





PUT /warehouses/update/:warehouse\_id

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





PUT /warehouses/update/:warehouse\_id

DESCP To upload a warehouse image

BODY {

&#x20;    "warehouse\_image":"house.avif",

}





DELETE /warehouses/delete/:warehouse\_id

DESCP To delete a warehouse











##### **PURCHASE**

POST /purchases/

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



GET /purchases/

DESCP To get all purchases



GET /purchases/get/:purchase\_id

DESCP To get a purchase by id



GET /purchases/:purchase\_id/recieve

DESCP To recieve a purchase



GET /purchases/get/purchases\_from/:warehouse\_id

DESCP To get purchases under a warehouse



DELETE /purchases/delete/:purchase\_id"

DESCP To erase a purchase by id

















##### **STOCK**

POST /stocks/createStock/

DESCP To create a stock

BODY {

&#x20;   "product":"6ad77d8f04091b90e37a597d",

&#x20;   "warehouse":"7ad79d8f04091b90e37a007d",

&#x20;   "category":"6ad77d8fdac91b90e37a597d",

&#x20;   "quantity":10,

}





GET /stocks/getAll/

DESCP To retrieve all stocks





GET /stocks/getAll\_by/:stock\_id

DESCP To retrieve a stock





PUT /stocks/stock\_update/:stock\_id

DESCP To update a stock (if necessary)

BODY {

&#x20;   "product":"6ad77d8f04091b90e37a597d",

&#x20;   "warehouse":"7ad79d8f04091b90e37a007d",

&#x20;   "category":"6ad77d8fdac91b90e37a597d",

&#x20;   "quantity":10,

}





DELETE /stocks/erase/:stock\_id

DESCP To delete a stock (if necessary)





GET /stocks/getFrom/:warehouse\_id

DESCP To get stocks under a warehouse





GET /stocks/getBy/:cat\_id/from/:warehouse\_id

DESCP To get stocks of a specific category under a warehouse













##### **STOCK MOVEMENT**

POST /stock\_movements/create/

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





GET /stock\_movements/getAll/

DESCP To get all stock movements





GET /stock\_movements/getBy/:movement\_id

DESCP To get a stock movement by id





GET /stock\_movements/getOf/:product\_id

DESCP To get all stock movements of a product





GET /stock\_movements/getFrom/:warehouse\_id

DESCP To get all stock movements under a warehouse











##### **SALES**



POST /sales/

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





GET /sales/getAll/

DESCP To get all sales





GET /sales/getAll/:sale\_id

DESCP To get a sale by id





GET /sales/getFrom/:warehouse\_id

DESCP To get sales under a warehouse









##### **Low\_stock\_report**



GET /sales/getAll/

DESCP To get a sale by id



























