## Setup

- copy `.env.example` to `.env`
- install Composer dependencies
    ```bash
    composer i
    ```
- generate app key
    ```bash
    php artisan key:generate
    ```
- install NPM dependencies
    ```bash
    npm i
    ```
- migrate DB
    ```bash
    php artisan migrate
    ```
- seed test data
    ```bash
    php artisan db:seed
    ```
- serve the app
    ```bash
    php artisan serve
    ```
- start Vite dev script
    ```bash
    npm run dev
    ```
- Now you can navigate to your `APP_URL` to see the homepage

---
## API Endpoints
### Auth
#### [POST] /login
Authenticates user.
</br>
Params:
- `email` string, required
- `password` string, required

### Category
#### [GET] /categories
Lists categories.

### Product
#### [GET] /products
Lists products.
</br>
Params:
- `search` string, nullable
- `minPrice` numeric, nullable
- `maxPrice` numeric, nullable
- `categories` int[], nullable

### Order
#### [POST] /orders
Place order.
</br>
Params:
- `products` array, required

#### [GET] /orders/{id}
Get order by ID.

---
## Testing
- make sure you have installed the composer dependencies
    ```bash
    composer i
    ```
- run tests
    ```bash
    php artisan test
    ```