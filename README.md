# Multition API

Technical scaffold cho Core API của Multition. Repo này chỉ thiết lập Express,
TypeScript, Zod, PostgreSQL driver, structured logging, security middleware,
migration runner, test framework, Docker và CI. Chưa có feature hoặc business
logic của sản phẩm.

## Chạy local

```bash
cp .env.example .env
npm install
cd ../multition-infra
cp .env.example .env
docker compose -f compose.dev.yaml up -d postgres
cd ../multition-api
npm run db:migrate
npm run dev
```

API chạy mặc định tại `http://localhost:4000`.

```bash
curl http://localhost:4000/health
```

## Kiểm tra

```bash
npm run typecheck
npm test
npm run build
npm run contracts:check
```

## Cấu trúc

```text
src/
├── app.ts        # Express bootstrap and middleware
├── server.ts     # Process lifecycle
├── cli/          # Command-line entrypoints such as migrations
├── config/
├── lib/
└── clients/      # Generated AI service types
migrations/
openapi/          # Source contracts and generated core API types
scripts/          # Contract synchronization
test/
```

`openapi/openapi.yaml` và `openapi/ai-service.yaml` là contract nguồn cho Core
API và AI service. Contracts hiện chỉ mô tả `/health`.

```bash
npm run contracts:check   # Validate OpenAPI và sinh type trong API repo
npm run contracts:sync    # Đồng bộ type sang mobile/web đã clone cạnh API
```

Không sửa generated types bằng tay. Commit contract và generated types trong
API repo; khi payload thay đổi, commit snapshot tương ứng trong client repo.
API có thể được clone, cài dependencies và chạy CI độc lập; lệnh sync bỏ qua
client chưa được clone. Nhóm sẽ thêm feature modules khi bắt đầu nghiệp vụ.

Migration `001_initial.sql` chỉ bật `pgcrypto`, `pgvector` và tạo bảng theo dõi
migration. Nhóm sẽ thiết kế schema nghiệp vụ trong các migration tiếp theo.
