# Node.js Clean Architecture & Domain-Driven Design Guidelines

> AI / IDE INSTRUCTION
> Tài liệu này là bộ quy tắc kiến trúc và coding standards bắt buộc của dự án.
> Trước khi tạo mới, chỉnh sửa, refactor hoặc review bất kỳ API, module hay chức năng nào, AI Agent phải đọc, phân tích và tuân thủ toàn bộ tài liệu này.

---

# 1. Mục tiêu kiến trúc

Dự án sử dụng kết hợp:

- Clean Architecture.
- Domain-Driven Design, viết tắt là DDD.
- SOLID Principles.
- Dependency Inversion.
- Feature-Based Modular Architecture.
- Explicit Error Handling.
- Testable Business Logic.
- Framework-independent Domain.

Mục tiêu:

1. Business logic không phụ thuộc framework.
2. Có thể thay Express, Fastify, NestJS, database hoặc message broker mà không phải viết lại nghiệp vụ.
3. Code dễ đọc, dễ kiểm thử và dễ mở rộng.
4. Mỗi module có ranh giới nghiệp vụ rõ ràng.
5. Hạn chế code dùng chung không có chủ đích.
6. Không để controller, repository hoặc ORM entity chứa nghiệp vụ.
7. AI Agent phải ưu tiên tính rõ ràng, ổn định và khả năng bảo trì hơn việc viết code ngắn.

---

# 2. Công nghệ mặc định

Trừ khi yêu cầu cụ thể quy định khác, dự án sử dụng:

- Node.js phiên bản LTS.
- TypeScript.
- REST API.
- PostgreSQL hoặc SQL Server.
- ORM có thể là Prisma, TypeORM hoặc Sequelize.
- Dependency Injection.
- Jest hoặc Vitest để kiểm thử.
- ESLint và Prettier.
- OpenAPI hoặc Swagger để mô tả API.

Không được để business logic phụ thuộc trực tiếp vào:

- Express.
- Fastify.
- NestJS.
- Prisma.
- TypeORM.
- Sequelize.
- Redis client.
- Kafka client.
- HTTP client cụ thể.
- SDK của nhà cung cấp bên ngoài.

Các công nghệ trên chỉ được sử dụng ở tầng Infrastructure hoặc Presentation.

---

# 3. Nguyên tắc Dependency Rule

Dependency chỉ được đi từ ngoài vào trong.

```text
Presentation
    ↓
Application
    ↓
Domain

Infrastructure
    ↓
Application / Domain
```

Domain không được import bất kỳ thành phần nào từ:

- Application.
- Infrastructure.
- Presentation.
- Framework.
- ORM.
- Database driver.
- HTTP library.

Application có thể phụ thuộc Domain nhưng không phụ thuộc implementation của Infrastructure.

Infrastructure được phép phụ thuộc Application và Domain để triển khai các interface.

Presentation chỉ làm nhiệm vụ tiếp nhận request, gọi use case và trả response.

## Quy tắc bắt buộc

```text
Domain         → Không phụ thuộc tầng khác.
Application    → Chỉ phụ thuộc Domain.
Infrastructure → Triển khai interface của Domain/Application.
Presentation   → Gọi Application Use Case.
```

Nếu xuất hiện dependency ngược chiều, phải refactor bằng interface, port hoặc abstraction.

---

# 4. Cấu trúc thư mục

Dự án phải tổ chức theo business module hoặc bounded context, không gom toàn bộ controller, service, repository vào các thư mục global.

```text
src/
├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── container/
│   ├── http/
│   └── server.ts
│
├── modules/
│   ├── customer/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   ├── aggregates/
│   │   │   ├── events/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── errors/
│   │   │   └── constants/
│   │   │
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   ├── commands/
│   │   │   ├── queries/
│   │   │   ├── dto/
│   │   │   ├── ports/
│   │   │   ├── mappers/
│   │   │   └── errors/
│   │   │
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   │   ├── repositories/
│   │   │   │   ├── models/
│   │   │   │   └── mappers/
│   │   │   ├── messaging/
│   │   │   ├── integrations/
│   │   │   ├── cache/
│   │   │   └── providers/
│   │   │
│   │   ├── presentation/
│   │   │   ├── http/
│   │   │   │   ├── controllers/
│   │   │   │   ├── routes/
│   │   │   │   ├── requests/
│   │   │   │   ├── responses/
│   │   │   │   └── presenters/
│   │   │   └── consumers/
│   │   │
│   │   └── index.ts
│   │
│   └── loan/
│       └── ...
│
├── shared/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── presentation/
│   └── kernel/
│
├── tests/
│   ├── integration/
│   ├── e2e/
│   ├── fixtures/
│   └── helpers/
│
└── main.ts
```

## Quy tắc tổ chức thư mục

- Mỗi business domain phải nằm trong một module riêng.
- Không tạo thư mục global như `controllers/`, `services/`, `repositories/` chứa mọi chức năng của hệ thống.
- `shared/` chỉ chứa thành phần thực sự dùng chung giữa nhiều module.
- Không đưa business logic riêng của một module vào `shared/`.
- Không tạo `utils/` như một “thùng rác” chứa mọi hàm tiện ích.
- Mỗi file chỉ nên có một trách nhiệm chính.

---

# 5. Domain Layer

Domain là lõi của hệ thống và chứa các quy tắc nghiệp vụ quan trọng nhất.

Domain bao gồm:

- Entity.
- Aggregate Root.
- Value Object.
- Domain Service.
- Domain Event.
- Repository Interface.
- Domain Error.
- Business Rule.

Domain không chứa:

- HTTP request hoặc response.
- ORM model.
- Database query.
- Framework decorator.
- Logging infrastructure.
- Cache client.
- Message broker client.
- Environment variables.
- JSON serialization dành riêng cho API.

---

# 6. Entity

Entity là đối tượng có định danh và vòng đời.

Ví dụ:

```typescript
export interface CustomerProps {
  fullName: string;
  status: CustomerStatus;
  createdAt: Date;
  updatedAt?: Date;
}

export class Customer {
  private constructor(
    private readonly id: CustomerId,
    private props: CustomerProps,
  ) {}

  static create(
    input: {
      id?: CustomerId;
      fullName: string;
    },
    now: Date = new Date(),
  ): Customer {
    const normalizedName = input.fullName.trim();

    if (normalizedName.length < 2) {
      throw new InvalidCustomerNameError();
    }

    return new Customer(input.id ?? CustomerId.generate(), {
      fullName: normalizedName,
      status: CustomerStatus.ACTIVE,
      createdAt: now,
    });
  }

  getId(): CustomerId {
    return this.id;
  }

  getFullName(): string {
    return this.props.fullName;
  }

  getStatus(): CustomerStatus {
    return this.props.status;
  }

  changeName(newName: string): void {
    const normalizedName = newName.trim();

    if (normalizedName.length < 2) {
      throw new InvalidCustomerNameError();
    }

    this.props.fullName = normalizedName;
    this.touch();
  }

  deactivate(): void {
    if (this.props.status === CustomerStatus.INACTIVE) {
      throw new CustomerAlreadyInactiveError(this.id.value);
    }

    this.props.status = CustomerStatus.INACTIVE;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
```

## Quy tắc Entity

- Constructor nên là `private` hoặc `protected`.
- Khởi tạo entity qua factory method như `create`, `restore` hoặc `reconstitute`.
- Entity phải tự bảo vệ invariant của chính nó.
- Không sử dụng public setter tùy ý.
- Không để object bên ngoài thay đổi trực tiếp internal state.
- Hành vi nghiệp vụ phải được thể hiện bằng method có tên rõ nghĩa.
- Không tạo entity ở trạng thái không hợp lệ.
- Không dùng interface dữ liệu thuần để thay thế entity khi đối tượng có hành vi nghiệp vụ.

Không nên:

```typescript
customer.status = 'inactive';
customer.balance = -1000;
```

Nên:

```typescript
customer.deactivate();
account.withdraw(amount);
```

---

# 7. Value Object

Value Object được xác định bởi giá trị, không phải định danh.

Ví dụ:

```typescript
export class Email {
  private constructor(public readonly value: string) {}

  static create(rawValue: string): Email {
    const normalizedValue = rawValue.trim().toLowerCase();

    if (!Email.isValid(normalizedValue)) {
      throw new InvalidEmailError(rawValue);
    }

    return new Email(normalizedValue);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  private static isValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
```

## Quy tắc Value Object

- Phải immutable.
- Validate dữ liệu ngay khi khởi tạo.
- Không để tồn tại Value Object không hợp lệ.
- So sánh Value Object bằng giá trị.
- Dùng Value Object cho các khái niệm nghiệp vụ quan trọng như:

  - Email.
  - Money.
  - PhoneNumber.
  - CustomerId.
  - AccountNumber.
  - InterestRate.
  - DateRange.
  - Currency.
  - IdentityNumber.

Không tạo Value Object cho mọi string nếu không có quy tắc hoặc ý nghĩa nghiệp vụ.

---

# 8. Aggregate và Aggregate Root

Aggregate là một nhóm entity và value object cần đảm bảo tính nhất quán trong cùng một transaction nghiệp vụ.

Aggregate Root là cổng duy nhất để thay đổi dữ liệu bên trong aggregate.

Ví dụ:

```text
LoanApplication
├── Borrower
├── Collateral
├── LoanPurpose
└── ApprovalHistory
```

Nếu `LoanApplication` là Aggregate Root thì code bên ngoài không được cập nhật trực tiếp `Collateral` hoặc `ApprovalHistory`.

## Quy tắc Aggregate

- Chỉ Aggregate Root được repository lưu trữ trực tiếp.
- Không expose mutable collection ra ngoài.
- Không tham chiếu trực tiếp aggregate khác bằng object đầy đủ.
- Aggregate khác chỉ nên được tham chiếu bằng ID.
- Aggregate không nên quá lớn.
- Một transaction chỉ nên thay đổi một aggregate nếu nghiệp vụ cho phép.
- Tính nhất quán giữa nhiều aggregate nên xử lý bằng Domain Event hoặc eventual consistency.

---

# 9. Domain Service

Domain Service chỉ được sử dụng khi logic nghiệp vụ:

- Không thuộc tự nhiên về một Entity hoặc Value Object cụ thể.
- Liên quan nhiều domain object.
- Không phụ thuộc infrastructure.

Ví dụ:

```typescript
export class LoanEligibilityPolicy {
  evaluate(input: {
    monthlyIncome: Money;
    monthlyDebt: Money;
    requestedInstallment: Money;
  }): LoanEligibilityResult {
    const totalDebt = input.monthlyDebt.add(input.requestedInstallment);
    const debtRatio = totalDebt.divideBy(input.monthlyIncome);

    if (debtRatio > 0.5) {
      return LoanEligibilityResult.rejected('DEBT_RATIO_EXCEEDED');
    }

    return LoanEligibilityResult.approved();
  }
}
```

Không đặt logic vào Domain Service nếu logic đó thuộc rõ ràng về một Entity.

---

# 10. Repository Interface

Repository interface phải được khai báo ở Domain hoặc Application, còn implementation nằm ở Infrastructure.

```typescript
export interface CustomerRepository {
  findById(id: CustomerId): Promise<Customer | null>;

  findByEmail(email: Email): Promise<Customer | null>;

  save(customer: Customer): Promise<void>;

  existsByEmail(email: Email): Promise<boolean>;
}
```

## Quy tắc Repository

- Repository hoạt động trên domain object, không trả ORM entity.
- Interface không chứa chi tiết database.
- Không đặt tên method theo công nghệ như:

  - `findByPrisma`.
  - `querySql`.
  - `getMongoDocument`.

- Không trả `any`.
- Không expose ORM transaction object ra Domain.
- Không tạo repository generic quá mức cho toàn hệ thống.
- Mỗi aggregate root có repository riêng nếu cần persistence.
- Query phức tạp phục vụ báo cáo có thể dùng Query Repository hoặc Read Model riêng.

Không nên:

```typescript
interface GenericRepository<T> {
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  findAll(filter: any): Promise<any[]>;
}
```

Generic repository thường làm mất ngôn ngữ nghiệp vụ và dẫn đến abstraction yếu.

Nên:

```typescript
interface LoanApplicationRepository {
  findPendingApplicationByCustomerId(customerId: CustomerId): Promise<LoanApplication | null>;

  save(application: LoanApplication): Promise<void>;
}
```

---

# 11. Application Layer

Application Layer điều phối nghiệp vụ thông qua Use Case.

Application chứa:

- Use Case.
- Command.
- Query.
- DTO.
- Port.
- Transaction abstraction.
- Authorization orchestration.
- Application mapping.
- Application error.

Application không chứa:

- HTTP status code.
- Express Request hoặc Response.
- SQL.
- ORM model.
- Framework decorator bắt buộc.
- Business invariant thuộc Domain.

---

# 12. Use Case

Mỗi Use Case biểu diễn một hành động nghiệp vụ cụ thể.

Tên Use Case nên theo động từ:

- `CreateCustomerUseCase`.
- `ApproveLoanApplicationUseCase`.
- `CancelDisbursementUseCase`.
- `GetCustomerDetailsQuery`.
- `SearchLoanApplicationsQuery`.

Ví dụ:

```typescript
export interface CreateCustomerCommand {
  fullName: string;
  email: string;
}

export interface CreateCustomerResult {
  customerId: string;
}

export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<CreateCustomerResult> {
    const email = Email.create(command.email);

    const emailExists = await this.customerRepository.existsByEmail(email);

    if (emailExists) {
      throw new CustomerEmailAlreadyExistsError(email.value);
    }

    const customer = Customer.create({
      fullName: command.fullName,
      email,
    });

    await this.unitOfWork.execute(async () => {
      await this.customerRepository.save(customer);

      // Domain Event chỉ được publish sau khi transaction lưu dữ liệu thành công.
      // Việc publish trước khi commit có thể khiến consumer nhận sự kiện
      // trong khi dữ liệu tương ứng chưa tồn tại hoặc transaction đã rollback.
      await this.eventPublisher.publishAll(customer.pullDomainEvents());
    });

    return {
      customerId: customer.getId().value,
    };
  }
}
```

## Quy tắc Use Case

- Một Use Case chỉ xử lý một mục tiêu nghiệp vụ chính.
- Method chính sử dụng tên thống nhất là `execute`.
- Input và output phải có type rõ ràng.
- Không nhận trực tiếp HTTP request.
- Không trả trực tiếp HTTP response.
- Không gọi ORM trực tiếp.
- Không chứa code serialize response.
- Không để controller điều phối nhiều repository.
- Không tạo “God Service” chứa hàng chục chức năng.
- Không gọi Use Case khác chỉ để tái sử dụng vài dòng logic.
- Logic dùng chung phải được trích thành Domain Service, Application Service hoặc Port phù hợp.
- Use Case phải dễ unit test mà không cần khởi động server hoặc database thật.

---

# 13. Command và Query

Áp dụng tư duy CQRS ở mức hợp lý.

## Command

Command thay đổi trạng thái hệ thống.

Ví dụ:

```typescript
interface ApproveLoanCommand {
  loanApplicationId: string;
  approvedBy: string;
}
```

Command không nên trả toàn bộ aggregate. Chỉ trả thông tin cần thiết như:

```typescript
interface ApproveLoanResult {
  loanApplicationId: string;
  status: string;
}
```

## Query

Query chỉ đọc dữ liệu và không làm thay đổi trạng thái hệ thống.

Query có thể đọc trực tiếp từ read model hoặc optimized query repository mà không cần khôi phục đầy đủ aggregate.

```typescript
export interface CustomerDetailsReadRepository {
  getById(customerId: string): Promise<CustomerDetailsView | null>;
}
```

Không sử dụng Domain Entity làm DTO trả ra API.

---

# 14. DTO

Phân biệt rõ các loại dữ liệu:

- HTTP Request DTO.
- Application Command.
- Domain Entity.
- Persistence Model.
- HTTP Response DTO.

Không dùng một interface cho tất cả tầng.

Luồng mapping chuẩn:

```text
HTTP Request
    ↓
Request DTO
    ↓
Application Command
    ↓
Domain Object
    ↓
Persistence Model
```

Khi trả dữ liệu:

```text
Database Record
    ↓
Read Model / Domain Object
    ↓
Application Result
    ↓
Response DTO
```

Việc tách DTO giúp API, database và domain có thể thay đổi độc lập.

---

# 15. Infrastructure Layer

Infrastructure triển khai các interface được định nghĩa ở bên trong.

Infrastructure bao gồm:

- Repository implementation.
- ORM model.
- Database connection.
- Cache.
- Message broker.
- File storage.
- Email provider.
- Third-party API client.
- External service adapter.
- Distributed lock.
- Logging provider.

Ví dụ:

```typescript
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: CustomerId): Promise<Customer | null> {
    const record = await this.prisma.customer.findUnique({
      where: {
        id: id.value,
      },
    });

    if (!record) {
      return null;
    }

    return CustomerPersistenceMapper.toDomain(record);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.customer.count({
      where: {
        email: email.value,
      },
    });

    return count > 0;
  }

  async save(customer: Customer): Promise<void> {
    const persistenceData = CustomerPersistenceMapper.toPersistence(customer);

    await this.prisma.customer.upsert({
      where: {
        id: persistenceData.id,
      },
      create: persistenceData,
      update: persistenceData,
    });
  }
}
```

## Quy tắc Infrastructure

- Mọi external dependency phải được bọc qua adapter hoặc port.
- Không để Use Case gọi trực tiếp SDK của bên thứ ba.
- Không để ORM model lan sang Domain hoặc Presentation.
- Phải xử lý timeout cho external API.
- Phải phân loại lỗi retryable và non-retryable.
- Retry chỉ được dùng với thao tác an toàn hoặc có idempotency.
- Không retry vô hạn.
- Không log thông tin bí mật.
- Repository phải mapping rõ ràng giữa persistence model và domain model.

---

# 16. Presentation Layer

Presentation chịu trách nhiệm:

1. Nhận request.
2. Parse input.
3. Validate cấu trúc dữ liệu.
4. Lấy authentication context.
5. Chuyển request thành command hoặc query.
6. Gọi Use Case.
7. Chuyển result thành response.
8. Chuyển error thành HTTP response phù hợp.

Controller phải mỏng.

Ví dụ:

```typescript
export class CreateCustomerController {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const input = CreateCustomerRequestSchema.parse(request.body);

    const result = await this.createCustomerUseCase.execute({
      fullName: input.fullName,
      email: input.email,
    });

    return {
      statusCode: 201,
      body: {
        data: {
          customerId: result.customerId,
        },
      },
    };
  }
}
```

## Controller không được

- Chứa SQL.
- Gọi ORM.
- Chứa business rule.
- Mở transaction.
- Điều phối nhiều bước nghiệp vụ phức tạp.
- Xử lý mapping persistence.
- Bắt mọi lỗi rồi trả HTTP 500.
- Trả raw error object.
- Trả raw ORM record.

Không nên:

```typescript
async create(req: Request, res: Response) {
  const exists = await prisma.customer.findFirst(...);

  if (exists) {
    return res.status(400).send(...);
  }

  const customer = await prisma.customer.create(...);

  await sendEmail(...);

  return res.send(customer);
}
```

---

# 17. Validation

Validation được chia thành hai nhóm.

## 17.1 Structural Validation

Thực hiện ở Presentation:

- Field bắt buộc.
- Kiểu dữ liệu.
- String length.
- Format ngày tháng.
- Format email.
- Enum hợp lệ.
- Request body schema.

Có thể dùng:

- Zod.
- Joi.
- Valibot.
- Class Validator.

## 17.2 Business Validation

Thực hiện ở Domain hoặc Application:

- Khách hàng có đủ điều kiện vay không.
- Hợp đồng đã được duyệt chưa.
- Hồ sơ có được phép hủy không.
- Số tiền giải ngân có vượt hạn mức không.
- Trạng thái hiện tại có cho phép chuyển bước không.

Không đặt business validation chỉ ở frontend hoặc request schema.

---

# 18. Error Handling

Không throw string.

Không sử dụng lỗi chung chung cho mọi trường hợp.

Sai:

```typescript
throw new Error('Invalid data');
```

Đúng:

```typescript
throw new CustomerNotFoundError(customerId);
throw new LoanApplicationAlreadyApprovedError(applicationId);
throw new CreditLimitExceededError(requestedAmount, availableLimit);
```

Base error:

```typescript
export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly category:
    | 'VALIDATION'
    | 'BUSINESS_RULE'
    | 'NOT_FOUND'
    | 'CONFLICT'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'INFRASTRUCTURE';

  protected constructor(
    message: string,
    public readonly metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
```

Ví dụ Domain Error:

```typescript
export class CustomerNotFoundError extends AppError {
  readonly code = 'CUSTOMER_NOT_FOUND';
  readonly category = 'NOT_FOUND' as const;

  constructor(customerId: string) {
    super(`Customer '${customerId}' was not found.`, {
      customerId,
    });
  }
}
```

## HTTP Error Mapping

Việc mapping error sang HTTP status phải nằm ở Presentation.

```text
VALIDATION      → 400
UNAUTHORIZED    → 401
FORBIDDEN       → 403
NOT_FOUND       → 404
CONFLICT        → 409
BUSINESS_RULE   → 422
INFRASTRUCTURE  → 500 hoặc 503
```

Không expose:

- Stack trace.
- SQL query.
- Database hostname.
- Internal file path.
- Secret.
- Access token.
- Raw provider response có thông tin nhạy cảm.

---

# 19. Transaction

Transaction phải được quản lý ở Application hoặc Unit of Work abstraction.

```typescript
export interface UnitOfWork {
  execute<T>(operation: () => Promise<T>): Promise<T>;
}
```

## Quy tắc Transaction

- Transaction phải ngắn nhất có thể.
- Không gọi external API chậm trong database transaction.
- Không gửi email trong database transaction.
- Không publish message không kiểm soát trước khi commit.
- Không mở transaction ở controller.
- Không để repository tự ý tạo transaction riêng cho một Use Case nhiều bước.
- Phải rollback khi xảy ra lỗi.
- Phải đánh giá lock, deadlock và isolation level.
- Khi update dữ liệu quan trọng, phải kiểm tra optimistic concurrency hoặc version.

Ví dụ optimistic locking:

```typescript
interface VersionedEntity {
  version: number;
}
```

Câu update phải bảo đảm:

```sql
UPDATE loan_application
SET status = @newStatus,
    version = version + 1
WHERE id = @id
  AND version = @expectedVersion;
```

Nếu số dòng cập nhật bằng `0`, phải xử lý concurrency conflict.

---

# 20. Outbox Pattern

Khi cần vừa cập nhật database vừa publish event, ưu tiên Transactional Outbox.

```text
Database Transaction
├── Update Aggregate
└── Insert Outbox Message

Background Publisher
├── Read pending Outbox Message
├── Publish to Message Broker
└── Mark message as published
```

Không thực hiện:

```typescript
await repository.save(entity);
await kafka.publish(event);
```

Cách trên có thể gây mất đồng bộ nếu database thành công nhưng Kafka thất bại hoặc ngược lại.

Outbox message nên chứa:

- Event ID.
- Event name.
- Aggregate ID.
- Payload.
- Created time.
- Retry count.
- Published time.
- Correlation ID.
- Trace ID.

---

# 21. Idempotency

Các API quan trọng như:

- Tạo giao dịch.
- Giải ngân.
- Thanh toán.
- Tạo hợp đồng.
- Gửi lệnh sang Core Banking.
- Nhận callback.
- Nhận message từ broker.

Phải xem xét idempotency.

Ví dụ header:

```http
Idempotency-Key: 4d457ad8-22ed-451b-a254-b11f42d577a7
```

Hệ thống phải lưu:

- Idempotency key.
- Request fingerprint.
- Processing status.
- Response.
- Expiration time.

Không được xử lý lại cùng một yêu cầu chỉ vì client retry do timeout.

---

# 22. External Integration

Mọi tích hợp bên ngoài phải đi qua Port.

```typescript
export interface CoreBankingGateway {
  createLoanContract(request: CreateCoreLoanContractRequest): Promise<CreateCoreLoanContractResult>;
}
```

Implementation:

```typescript
export class T24CoreBankingAdapter implements CoreBankingGateway {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly config: CoreBankingConfig,
  ) {}

  async createLoanContract(
    request: CreateCoreLoanContractRequest,
  ): Promise<CreateCoreLoanContractResult> {
    try {
      const response = await this.httpClient.post(
        `${this.config.baseUrl}/loan-contracts`,
        request,
        {
          timeoutMs: this.config.timeoutMs,
        },
      );

      return CoreBankingResponseMapper.toCreateLoanResult(response);
    } catch (error) {
      throw CoreBankingErrorMapper.map(error);
    }
  }
}
```

## Quy tắc Integration

- Có timeout rõ ràng.
- Có correlation ID.
- Có structured logging.
- Có error mapping.
- Có circuit breaker nếu tích hợp thiếu ổn định.
- Có retry policy hợp lý.
- Có idempotency khi cần.
- Không log access token.
- Không log toàn bộ request chứa dữ liệu nhạy cảm.
- Phải validate response từ hệ thống ngoài.
- Không tin tưởng dữ liệu external mặc định là hợp lệ.
- Không truyền raw response của đối tác thẳng về client nội bộ.

---

# 23. Logging

Dùng structured logging.

Đúng:

```typescript
logger.info('Loan application approved', {
  loanApplicationId,
  approvedBy,
  correlationId,
});
```

Không nên:

```typescript
console.log('Approved loan ' + loanApplicationId + ' by ' + approvedBy);
```

## Trường log nên có

- Timestamp.
- Log level.
- Application name.
- Environment.
- Correlation ID.
- Trace ID.
- Request ID.
- User ID hoặc technical client ID.
- Use Case.
- Event name.
- Duration.
- Error code.

## Không được log

- Password.
- OTP.
- Access token.
- Refresh token.
- Private key.
- Connection string.
- Full card number.
- CVV.
- Dữ liệu định danh đầy đủ nếu không cần thiết.
- Toàn bộ request hoặc response chứa dữ liệu nhạy cảm.

Dữ liệu nhạy cảm phải được masking.

```typescript
function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) {
    return '****';
  }

  return `${'*'.repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`;
}
```

---

# 24. Comment

Comment phải giải thích lý do, ràng buộc hoặc rủi ro, không mô tả lại từng dòng code.

Comment tốt:

```typescript
// Không gọi Core Banking bên trong transaction database.
// Core có thể phản hồi chậm và giữ lock lâu, làm tăng nguy cơ blocking.
// Trạng thái PENDING_CORE được commit trước, sau đó worker thực hiện tích hợp.
```

Comment không cần thiết:

```typescript
// Gán tên khách hàng
customer.name = name;

// Tăng biến đếm lên 1
count++;
```

Phải comment khi:

- Có workaround.
- Có business rule khó hiểu.
- Có quyết định liên quan concurrency.
- Có logic idempotency.
- Có logic retry.
- Có xử lý timezone.
- Có đoạn code tối ưu hiệu năng nhưng khó đọc.
- Có giới hạn từ hệ thống bên ngoài.
- Có hành vi dễ bị sửa sai trong tương lai.

Comment phải được cập nhật khi code thay đổi. Comment sai còn nguy hiểm hơn không có comment.

---

# 25. Naming Convention

## File và thư mục

Sử dụng `kebab-case`.

```text
create-customer.use-case.ts
customer.repository.ts
customer.entity.ts
customer-id.value-object.ts
create-customer.controller.ts
```

## Class

Sử dụng `PascalCase`.

```typescript
CreateCustomerUseCase;
CustomerRepository;
CustomerNotFoundError;
```

## Function và variable

Sử dụng `camelCase`.

```typescript
createCustomer;
customerRepository;
requestedAmount;
```

## Constant

Sử dụng `UPPER_SNAKE_CASE`.

```typescript
MAX_RETRY_COUNT;
DEFAULT_PAGE_SIZE;
```

## Boolean

Tên phải thể hiện câu hỏi đúng hoặc sai.

```typescript
isActive;
hasPermission;
canApprove;
shouldRetry;
```

Không nên:

```typescript
active;
permission;
approveFlag;
statusCheck;
```

## Function

Tên function phải thể hiện hành động.

```typescript
calculateInterestRate();
validateApprovalPermission();
mapToDomain();
publishPendingEvents();
```

Tránh tên mơ hồ:

```typescript
handle();
process();
executeData();
doSomething();
commonFunction();
```

Ngoại lệ: `execute()` được chấp nhận là method chuẩn của Use Case vì class đã mô tả đầy đủ hành động.

---

# 26. TypeScript Standards

Bắt buộc bật strict mode.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## Không sử dụng `any`

Sai:

```typescript
function mapResponse(data: any): any {
  return data;
}
```

Đúng:

```typescript
function mapResponse(data: ExternalCustomerResponse): CustomerDetailsResult {
  // ...
}
```

Nếu dữ liệu external chưa xác định, sử dụng `unknown` và validate.

```typescript
function parseExternalResponse(value: unknown): ExternalResponse {
  return ExternalResponseSchema.parse(value);
}
```

## Không lạm dụng type assertion

Tránh:

```typescript
const customer = data as Customer;
```

Type assertion không tạo validation runtime.

## Dùng enum hoặc union có chủ đích

Ưu tiên union khi chỉ cần giới hạn giá trị:

```typescript
type LoanStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
```

Dùng enum hoặc object constant khi cần runtime reference:

```typescript
export const LoanStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];
```

---

# 27. Function Design

Một function nên:

- Có một trách nhiệm chính.
- Có tên rõ nghĩa.
- Có input và output rõ ràng.
- Không thay đổi state ngoài phạm vi một cách bất ngờ.
- Không có quá nhiều tham số.
- Không dùng boolean parameter khó hiểu.
- Không dài quá mức cần thiết.

Không nên:

```typescript
processCustomer(customer, true, false, true);
```

Nên:

```typescript
processCustomer(customer, {
  validateIdentity: true,
  sendNotification: false,
  createAuditLog: true,
});
```

Hoặc tách thành các hành động rõ ràng.

Ưu tiên guard clause để giảm nesting.

Không nên:

```typescript
if (customer) {
  if (customer.isActive()) {
    if (customer.hasPermission()) {
      // xử lý
    }
  }
}
```

Nên:

```typescript
if (!customer) {
  throw new CustomerNotFoundError(customerId);
}

if (!customer.isActive()) {
  throw new CustomerInactiveError(customerId);
}

if (!customer.hasPermission(permission)) {
  throw new PermissionDeniedError(permission);
}

// xử lý
```

---

# 28. Reuse Code

Không tái sử dụng code chỉ bằng cách gom các đoạn tương tự vào một `CommonService`.

Chỉ trích xuất khi:

- Có cùng ý nghĩa nghiệp vụ.
- Có cùng lý do thay đổi.
- Có từ hai nơi sử dụng thực tế.
- Abstraction làm code dễ hiểu hơn.

Không tạo abstraction quá sớm.

Quy tắc:

```text
Duplication nhỏ, rõ ràng
tốt hơn
Abstraction sai, khó hiểu và ràng buộc nhiều module.
```

Các thành phần có thể dùng chung:

- Base error.
- Result type.
- Domain event base class.
- ID generation.
- Clock interface.
- Logger interface.
- Transaction abstraction.
- Pagination type.
- Authentication context.
- HTTP client abstraction.

Không đưa vào shared:

- Customer validation.
- Loan approval policy.
- Disbursement mapper.
- Core-specific business rules của một module.

---

# 29. Date, Time và Timezone

- Lưu timestamp trong database theo UTC.
- API trả ISO 8601.
- Không dùng string ngày tháng không có timezone cho timestamp.
- Không phụ thuộc timezone của server.
- Business date phải được phân biệt với timestamp.

Ví dụ:

```typescript
type BusinessDate = string; // YYYY-MM-DD
```

Timestamp:

```typescript
const createdAt = new Date().toISOString();
```

Với logic quan trọng, inject Clock.

```typescript
export interface Clock {
  now(): Date;
}
```

Điều này giúp unit test ổn định.

```typescript
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
```

---

# 30. Money và Decimal

Không dùng số thực JavaScript để tính tiền hoặc lãi suất quan trọng.

Không nên:

```typescript
const total = 0.1 + 0.2;
```

Nên:

- Lưu minor unit như đồng, cent.
- Hoặc dùng thư viện decimal chính xác.
- Luôn kèm currency.

```typescript
export class Money {
  private constructor(
    public readonly amount: bigint,
    public readonly currency: Currency,
  ) {}

  static create(amount: bigint, currency: Currency): Money {
    if (amount < 0n) {
      throw new InvalidMoneyAmountError(amount);
    }

    return new Money(amount, currency);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);

    return new Money(this.amount + other.amount, this.currency);
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError(this.currency, other.currency);
    }
  }
}
```

Quy tắc làm tròn phải được định nghĩa rõ theo nghiệp vụ.

---

# 31. Pagination

API danh sách phải có giới hạn.

Không cho phép client yêu cầu số lượng không giới hạn.

```typescript
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
```

Ưu tiên cursor pagination cho dữ liệu lớn và thay đổi thường xuyên.

Response:

```typescript
interface PageResult<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}
```

Offset pagination chỉ dùng khi phù hợp với nghiệp vụ và khối lượng dữ liệu.

---

# 32. Database

## Query

- Không dùng `SELECT *`.
- Chỉ lấy các cột cần thiết.
- Tránh N+1 query.
- Phải xem xét index cho field thường xuyên:

  - Filter.
  - Join.
  - Sort.
  - Unique check.

- Query phải parameterized.
- Không nối chuỗi trực tiếp để tạo SQL.
- Phải giới hạn số bản ghi.
- Phải đánh giá execution plan với query quan trọng.

## Write

- Update hoặc delete phải có điều kiện rõ ràng.
- Với thao tác quan trọng, kiểm tra số dòng bị ảnh hưởng.
- Không update toàn bộ record nếu chỉ thay đổi một số field.
- Không dùng `deleteMany` hoặc update hàng loạt nếu chưa có điều kiện bảo vệ.
- Phải cân nhắc soft delete theo nghiệp vụ, không áp dụng máy móc.

## Migration

- Migration phải có thể review.
- Không tự động chạy destructive migration trên production.
- Thay đổi schema lớn phải tương thích ngược trong giai đoạn triển khai.
- Không rename hoặc drop column đang được version cũ sử dụng.
- Dữ liệu backfill lớn phải chạy theo batch.

---

# 33. Cache

Cache là tối ưu hóa, không phải nguồn dữ liệu chính trừ khi kiến trúc quy định rõ.

- Cache key phải có namespace.
- Có TTL.
- Không cache dữ liệu nhạy cảm không mã hóa.
- Phải có chiến lược invalidation.
- Không để business correctness phụ thuộc hoàn toàn vào cache.
- Cache miss không phải error.
- Không dùng cache để che giấu query database chưa tối ưu.

Ví dụ key:

```text
customer:details:v1:{customerId}
```

---

# 34. Security

Mọi API phải xem xét:

- Authentication.
- Authorization.
- Input validation.
- SQL injection.
- NoSQL injection.
- Mass assignment.
- Path traversal.
- SSRF.
- Rate limiting.
- Replay attack.
- Sensitive data exposure.
- Secret management.
- Audit log.
- Dependency vulnerability.

## Authorization

Không chỉ kiểm tra role ở controller.

Use Case phải nhận actor context nếu quyền liên quan trực tiếp đến nghiệp vụ.

```typescript
interface ActorContext {
  actorId: string;
  roles: string[];
  permissions: string[];
}
```

Ví dụ:

```typescript
await approveLoanUseCase.execute({
  actor,
  loanApplicationId,
});
```

## Secret

Secret chỉ lấy từ:

- Environment variable.
- Secret Manager.
- Vault.

Không hard-code secret trong source code.

---

# 35. API Design

## URL

Sử dụng resource-oriented URL.

Nên:

```http
POST /api/v1/customers
GET /api/v1/customers/{customerId}
POST /api/v1/loan-applications/{id}/approval
POST /api/v1/disbursements/{id}/cancellation
```

Không nên:

```http
POST /api/v1/createCustomer
POST /api/v1/approveLoan
GET /api/v1/getCustomerById
```

## Response chuẩn

Thành công:

```json
{
  "data": {
    "customerId": "CUS-001"
  },
  "meta": {
    "requestId": "req-123"
  }
}
```

Lỗi:

```json
{
  "error": {
    "code": "CUSTOMER_NOT_FOUND",
    "message": "Customer was not found.",
    "details": null
  },
  "meta": {
    "requestId": "req-123"
  }
}
```

Không trả HTTP 200 cho mọi trường hợp lỗi.

## Versioning

Ưu tiên:

```http
/api/v1/customers
```

Không đưa version vào giữa business resource nếu không có lý do đặc biệt.

---

# 36. Testing Strategy

Áp dụng Test Pyramid.

```text
Nhiều Unit Test
Một số Integration Test
Ít End-to-End Test
```

## Unit Test

Unit test cho:

- Entity.
- Value Object.
- Domain Service.
- Use Case.
- Mapper quan trọng.
- Error condition.
- State transition.
- Business rule.

Unit test không dùng database thật.

Ví dụ:

```typescript
describe('ApproveLoanApplicationUseCase', () => {
  it('approves a pending loan application', async () => {
    const repository = new InMemoryLoanApplicationRepository();
    const application = LoanApplication.createPending({
      customerId: CustomerId.create('CUS-001'),
    });

    await repository.save(application);

    const useCase = new ApproveLoanApplicationUseCase(
      repository,
      new FakeClock(new Date('2026-01-01T00:00:00.000Z')),
    );

    await useCase.execute({
      loanApplicationId: application.getId().value,
      approvedBy: 'USER-001',
    });

    const updated = await repository.findById(application.getId());

    expect(updated?.getStatus()).toBe('APPROVED');
  });
});
```

## Integration Test

Kiểm tra:

- Repository với database thật hoặc test container.
- Transaction.
- External adapter với mock server.
- Migration.
- Message consumer.
- Outbox publisher.

## End-to-End Test

Kiểm tra luồng API quan trọng từ request đến database.

Không chỉ test happy path.

Phải có test cho:

- Invalid input.
- Unauthorized.
- Forbidden.
- Not found.
- Conflict.
- Business rule violation.
- Database failure.
- External timeout.
- Duplicate request.
- Concurrent update.

---

# 37. Test Naming

Tên test phải mô tả hành vi.

Nên:

```typescript
it('rejects approval when the application is already approved');
```

Không nên:

```typescript
it('test case 1');
it('should work');
```

Cấu trúc test:

```text
Arrange
Act
Assert
```

Chỉ comment ba phần trên khi test dài và cần phân tách rõ.

---

# 38. Dependency Injection

Object phải nhận dependency từ bên ngoài.

Không tự khởi tạo dependency trong Use Case.

Không nên:

```typescript
export class CreateCustomerUseCase {
  private readonly repository = new PrismaCustomerRepository(new PrismaClient());
}
```

Nên:

```typescript
export class CreateCustomerUseCase {
  constructor(private readonly repository: CustomerRepository) {}
}
```

Việc wire dependency nằm ở composition root.

```typescript
const customerRepository = new PrismaCustomerRepository(prisma);

const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

const createCustomerController = new CreateCustomerController(createCustomerUseCase);
```

---

# 39. Domain Event

Domain Event mô tả sự kiện nghiệp vụ đã xảy ra.

Tên event sử dụng thì quá khứ:

- `CustomerCreated`.
- `LoanApplicationApproved`.
- `DisbursementCancelled`.
- `CollateralReleased`.

Không đặt:

- `CreateCustomer`.
- `ApproveLoan`.
- `CancelDisbursement`.

Ví dụ:

```typescript
export class LoanApplicationApproved implements DomainEvent {
  readonly eventName = 'loan-application.approved';
  readonly occurredAt: Date;

  constructor(
    public readonly loanApplicationId: string,
    public readonly approvedBy: string,
    occurredAt?: Date,
  ) {
    this.occurredAt = occurredAt ?? new Date();
  }
}
```

Event payload phải:

- Đủ dữ liệu cho consumer.
- Không chứa object vòng.
- Không chứa secret.
- Có version nếu public qua message broker.

```text
loan-application.approved.v1
```

---

# 40. State Transition

Với nghiệp vụ có trạng thái, phải định nghĩa transition rõ ràng.

Ví dụ:

```text
DRAFT
  ↓ submit
PENDING_APPROVAL
  ├── approve → APPROVED
  └── reject  → REJECTED

APPROVED
  └── cancel → CANCELLED
```

Transition phải được bảo vệ trong Aggregate.

```typescript
approve(approvedBy: UserId, approvedAt: Date): void {
  if (this.status !== LoanStatus.PENDING_APPROVAL) {
    throw new InvalidLoanStatusTransitionError(
      this.status,
      LoanStatus.APPROVED,
    );
  }

  this.status = LoanStatus.APPROVED;
  this.approvedBy = approvedBy;
  this.approvedAt = approvedAt;

  this.addDomainEvent(
    new LoanApplicationApproved(
      this.id.value,
      approvedBy.value,
      approvedAt,
    ),
  );
}
```

Không thay đổi status trực tiếp từ repository hoặc controller.

---

# 41. Audit Log

Các thao tác nghiệp vụ quan trọng phải có audit log:

- Ai thực hiện.
- Thực hiện lúc nào.
- Hành động gì.
- Đối tượng nào.
- Trạng thái trước.
- Trạng thái sau.
- Request ID.
- Correlation ID.
- Nguồn gọi.
- Lý do nếu có.

Audit log không được cho phép chỉnh sửa tùy ý.

Audit log khác application log:

- Application log phục vụ vận hành.
- Audit log phục vụ truy vết nghiệp vụ và kiểm soát.

---

# 42. Performance

Không tối ưu dựa trên phỏng đoán. Phải đo lường.

Các chỉ số cần theo dõi:

- Request latency.
- P95, P99.
- Throughput.
- Error rate.
- Database query duration.
- External API duration.
- Connection pool usage.
- Event lag.
- Memory usage.
- CPU usage.
- Event loop lag.

Khi tối ưu:

1. Xác định bottleneck.
2. Đo baseline.
3. Thay đổi nhỏ, có kiểm soát.
4. Đo lại.
5. Ghi nhận trade-off.

Không hy sinh tính đúng đắn nghiệp vụ để đổi lấy tối ưu chưa được chứng minh.

---

# 43. Resilience

Tích hợp external phải xem xét:

- Timeout.
- Retry.
- Circuit breaker.
- Bulkhead.
- Rate limit.
- Fallback.
- Dead-letter queue.
- Idempotency.

Retry policy ví dụ:

```typescript
interface RetryPolicy {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}
```

Không retry:

- Validation error.
- Authentication error.
- Authorization error.
- Business rejection.
- HTTP 4xx không mang tính tạm thời.

Có thể retry:

- Timeout.
- Connection reset.
- HTTP 502.
- HTTP 503.
- HTTP 504.

Retry phải có exponential backoff và jitter.

---

# 44. Background Job và Message Consumer

Consumer phải:

- Idempotent.
- Có retry giới hạn.
- Có dead-letter handling.
- Có correlation ID.
- Validate message schema.
- Không acknowledge message trước khi xử lý hoàn tất.
- Phân biệt lỗi tạm thời và lỗi vĩnh viễn.
- Có metrics về số message thành công, thất bại và retry.

Không để một message lỗi chặn toàn bộ queue vô thời hạn.

---

# 45. Configuration

Config phải được validate khi ứng dụng khởi động.

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().min(1),
  CORE_BANKING_BASE_URL: z.string().url(),
  CORE_BANKING_TIMEOUT_MS: z.coerce.number().int().positive(),
});
```

Ứng dụng phải fail fast nếu config thiếu hoặc sai.

Không đọc `process.env` rải rác trong business code.

---

# 46. Import Rule

Mỗi module chỉ expose public API qua `index.ts`.

Ví dụ:

```typescript
export {
  CreateCustomerUseCase,
  type CreateCustomerCommand,
  type CreateCustomerResult,
} from './application/use-cases/create-customer.use-case';
```

Module khác không được import sâu vào implementation nội bộ.

Không nên:

```typescript
import { CustomerPersistenceMapper } from '../customer/infrastructure/persistence/mappers/customer.mapper';
```

Cần hạn chế circular dependency.

Nếu hai module phụ thuộc chéo:

- Xem lại bounded context.
- Dùng domain event.
- Dùng application port.
- Tách shared concept phù hợp.
- Không chữa bằng import vòng hoặc service locator.

---

# 47. Code Smells phải tránh

AI Agent phải cảnh báo hoặc refactor khi phát hiện:

- God Class.
- God Service.
- Fat Controller.
- Anemic Domain Model.
- Generic Repository lạm dụng.
- Circular Dependency.
- Business Logic trong ORM hook.
- Business Logic trong Controller.
- Duplicate Business Rule.
- Boolean Parameter khó hiểu.
- Method quá dài.
- Quá nhiều nesting.
- `any`.
- Magic number.
- Magic string.
- Catch error rồi bỏ qua.
- Catch error rồi chỉ `console.log`.
- Return `null` không có quy ước.
- Shared utils không rõ trách nhiệm.
- Mapper trộn validation và business logic.
- Transaction mở quá lâu.
- External call bên trong database transaction.
- Repository trả raw database record.
- Dùng HTTP status code trong Domain.
- Domain import framework decorator.
- Tạo abstraction trước khi có nhu cầu thực tế.

---

# 48. Quy tắc Refactor

Khi refactor:

1. Không thay đổi hành vi nghiệp vụ ngoài phạm vi yêu cầu.
2. Phải giữ hoặc bổ sung test trước khi sửa logic quan trọng.
3. Không vừa refactor lớn vừa thay đổi business requirement trong cùng một bước nếu có thể tách.
4. Không rename public API tùy ý.
5. Không phá backward compatibility mà không nêu rõ.
6. Phải ghi chú migration nếu thay đổi database hoặc contract.
7. Ưu tiên thay đổi nhỏ, có thể review.
8. Không thêm design pattern chỉ để làm code trông “kiến trúc hơn”.

---

# 49. Quy tắc AI Agent khi sinh code

Trước khi viết code, AI Agent phải:

1. Xác định module hoặc bounded context.
2. Xác định Use Case đang được yêu cầu.
3. Xác định business invariant.
4. Xác định Aggregate Root.
5. Xác định transaction boundary.
6. Xác định external dependencies.
7. Xác định input, output và error.
8. Xác định idempotency nếu có.
9. Xác định concurrency risk.
10. Xác định security requirement.
11. Xác định test cần viết.

AI Agent không được:

- Viết controller trước khi hiểu Use Case.
- Gọi ORM trực tiếp từ controller.
- Tạo service chung chung như `CommonService`.
- Dùng `any` để bỏ qua lỗi type.
- Bỏ validation.
- Bỏ error handling.
- Bỏ transaction khi có nhiều thao tác dữ liệu liên quan.
- Tạo abstraction không cần thiết.
- Tự ý thêm dependency mới mà không giải thích.
- Trả raw database entity qua API.
- Để TODO thay cho phần logic cốt lõi được yêu cầu.
- Viết code rút gọn khiến người đọc không hiểu luồng xử lý.
- Dùng pseudo-code khi người dùng yêu cầu code hoàn chỉnh.

---

# 50. Đầu ra bắt buộc khi AI tạo chức năng mới

Khi được yêu cầu tạo API hoặc chức năng, AI Agent phải cung cấp tối thiểu:

## 50.1 Phân tích kiến trúc

- Module.
- Use Case.
- Aggregate hoặc Entity liên quan.
- Dependency.
- Transaction boundary.
- Error case.
- Security.
- Idempotency hoặc concurrency nếu liên quan.

## 50.2 Cây thư mục thay đổi

```text
src/modules/customer/
├── domain/
│   ├── entities/customer.entity.ts
│   └── repositories/customer.repository.ts
├── application/
│   ├── dto/create-customer.dto.ts
│   └── use-cases/create-customer.use-case.ts
├── infrastructure/
│   └── persistence/repositories/prisma-customer.repository.ts
└── presentation/
    └── http/controllers/create-customer.controller.ts
```

## 50.3 Code đầy đủ

- Ghi rõ đường dẫn từng file.
- Không viết tắt phần quan trọng.
- Không dùng dấu `...` thay cho logic.
- Các import phải hợp lý.
- Type đầy đủ.
- Có error handling.
- Có validation.
- Có unit test cho nghiệp vụ chính.

## 50.4 Giải thích quyết định quan trọng

Chỉ giải thích các điểm:

- Tại sao đặt logic ở tầng đó.
- Tại sao cần transaction.
- Tại sao cần event hoặc outbox.
- Tại sao cần Value Object.
- Rủi ro concurrency hoặc integration.
- Trade-off của giải pháp.

---

# 51. Checklist trước khi hoàn thành code

AI Agent phải tự kiểm tra:

## Architecture

- [ ] Domain có độc lập framework không?
- [ ] Dependency có đi đúng chiều không?
- [ ] Controller có đủ mỏng không?
- [ ] Use Case có một trách nhiệm chính không?
- [ ] Repository có trả Domain Object không?
- [ ] ORM model có bị lộ ra ngoài Infrastructure không?

## Domain

- [ ] Entity có bảo vệ invariant không?
- [ ] Có setter tùy ý không?
- [ ] Value Object có immutable không?
- [ ] State transition có được kiểm soát không?
- [ ] Business rule có bị duplicate không?

## Data

- [ ] Query có giới hạn dữ liệu không?
- [ ] Có N+1 query không?
- [ ] Có index phù hợp không?
- [ ] Transaction boundary có đúng không?
- [ ] Có nguy cơ lost update không?
- [ ] Có kiểm tra affected rows không?

## Integration

- [ ] Có timeout không?
- [ ] Có retry đúng trường hợp không?
- [ ] Có idempotency không?
- [ ] Có validate external response không?
- [ ] Có mapping external error không?
- [ ] Có log correlation ID không?

## Security

- [ ] Có authentication không?
- [ ] Có authorization không?
- [ ] Có validate input không?
- [ ] Có lộ dữ liệu nhạy cảm không?
- [ ] Có log secret không?
- [ ] Có nguy cơ injection không?

## Quality

- [ ] Có `any` không?
- [ ] Naming có rõ nghĩa không?
- [ ] Function có quá dài không?
- [ ] Comment có giải thích “tại sao” không?
- [ ] Có magic number hoặc magic string không?
- [ ] Error có mã rõ ràng không?
- [ ] Có test cho happy path và error path không?

---

# 52. Nguyên tắc cuối cùng

Ưu tiên theo thứ tự:

1. Tính đúng đắn nghiệp vụ.
2. An toàn dữ liệu.
3. Khả năng đọc và bảo trì.
4. Khả năng kiểm thử.
5. Khả năng mở rộng.
6. Hiệu năng.
7. Số lượng dòng code.

Code tốt không phải code ngắn nhất.

Code tốt là code thể hiện rõ nghiệp vụ, bảo vệ dữ liệu, kiểm soát lỗi và cho phép thay đổi mà không làm sụp đổ các phần không liên quan.

Khi phải lựa chọn giữa một abstraction phức tạp và một implementation đơn giản, rõ ràng, hãy ưu tiên giải pháp đơn giản cho đến khi có nhu cầu thực tế chứng minh cần abstraction.

Không áp dụng Clean Architecture hoặc DDD một cách máy móc. Chỉ sử dụng pattern khi pattern giải quyết một vấn đề thực tế của hệ thống.

Mọi đoạn code quan trọng phải trả lời được các câu hỏi:

- Nghiệp vụ nào đang được thực hiện?
- Quy tắc nghiệp vụ nằm ở đâu?
- Dữ liệu được bảo vệ như thế nào?
- Khi lỗi xảy ra, hệ thống phản ứng ra sao?
- Khi request được gửi lại, có bị xử lý trùng không?
- Khi nhiều người thao tác đồng thời, dữ liệu có còn đúng không?
- Có thể kiểm thử logic mà không cần framework hoặc database thật không?
- Có thể thay đổi công nghệ bên ngoài mà không viết lại domain không?

Nếu không trả lời được các câu hỏi trên, thiết kế chưa hoàn chỉnh.
