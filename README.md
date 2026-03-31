Maple Good

## 1. Proposed Technologies / Frameworks

- Frontend: React (via Next.js)
- Backend Runtime: Node.js
- Database: MySQL
- AI: ChatGPT (for chatbot features)

Author Robin is currently focusing on designing MySQL table schemas with weak constraints (no foreign keys and no strong database-level constraints), while keeping all relational logic in the ORM/service layer. This follows a typical internet-scale, high-concurrency system design approach to avoid cross-table locks and improve scalability.

## 2. Database (MySQL)

- The canonical schema for this project lives in `maple_goods_optimized.sql`.  
- Tables are designed for **weak constraints**: no foreign keys, only primary keys, unique keys, basic CHECKs, and indexes.  
- **All relational integrity and business rules must be enforced in the ORM/service layer**, not in the database.  
- To initialize a fresh database:
  1. Create an empty MySQL database (e.g. `maplegood`).
  2. Copy `.env.example` to `.env` and fill in the actual connection values.
  3. Run the SQL script against that database, for example on Windows (PowerShell):

     ```bash
     mysql -h $env:MYSQL_HOST -P $env:MYSQL_PORT -u $env:MYSQL_USER -p$env:MYSQL_PASSWORD $env:MYSQL_DATABASE < ./maple_goods_optimized.sql
     ```

This schema is optimized for internet-scale / high-concurrency systems, minimizing cross-table locks and maximizing horizontal scalability.