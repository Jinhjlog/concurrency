framework: Nestjs
database: mariadb:10.10.2

# 동시성 문제 과제 진행

선착순으로 100명이 특강을 신청했을 때 정상적으로 신청 인원 수가 처리 되도록 구현

### ERD

```mermaid
erDiagram
    USER {
        String id "user_id"
        String name "name"
    }
    LECTURE {
        String id "lecture_id"
        String title "title"
        String description "description"
        Int maxCapacity "max_capacity"
        Int currentCapacity "current_capacity"
        DateTime date "date"
        DateTime updatedAt "updated_at"
    }
    LECTUREAPPLICATION {
        String id "lecture_application_id"
        String userId "user_id"
        String lectureId "lecture_id"
        DateTime applicationDate "application_date"
    }

    USER ||--o{ LECTUREAPPLICATION : "has"
    LECTURE ||--o{ LECTUREAPPLICATION : "has"
```

### 프로젝트 구조

```mermaid
graph TD
    A[Presentation Layer] --> B[Service Layer]
    B --> C[Persistence Layer]

    subgraph Presentation Layer
        D[Controllers]
    end

    subgraph Service Layer
        E[Services]
        F[Domain Logic]
    end

    subgraph Persistence Layer
        G[Repositories]
        H[Database Access]
    end
```

### 예상 실행 순서

```mermaid
sequenceDiagram
    participant R1 as Request-1
    participant DB as Database
    participant R2 as Request-2

    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 0}
    R1->>DB: select * from lecture where id = 1
    DB-->>R1: {id: 1, maxCapacity: 100, currentCapacity: 0}

    R1->>DB: update lecture set currentCapacity = 1 where id = 1
    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 1}

    R2->>DB: select * from lecture where id = 1
    DB-->>R2: {id: 1, maxCapacity: 100, currentCapacity: 1}

    R2->>DB: update lecture set currentCapacity = 2 where id = 1
    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 2}
```

### 실제 실행 순서

```mermaid
sequenceDiagram
    participant R1 as Request-1
    participant DB as Database
    participant R2 as Request-2

    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 0}

    R1->>DB: select * from lecture where id = 1
    DB-->>R1: {id: 1, maxCapacity: 100, currentCapacity: 0}

    R2->>DB: select * from lecture where id = 1
    DB-->>R2: {id: 1, maxCapacity: 100, currentCapacity: 0}

    R1->>DB: update lecture set currentCapacity = 1 where id = 1
    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 1}

    R2->>DB: update lecture set currentCapacity = 1 where id = 1
    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 1}
```

2명이 동시에 신청 했을 경우 조회 시점이 동일하여 currentCapacity의 값이 2가 되지 못함

## 어떻게 해결하지?

비관 락을 사용하여 해당 문제를 해결

### Lock 이란?

데이터베이스의 일관성과 무결성을 유지하기 위해 여러 트랜잭션이 동시에 동일한 데이터를 접근하거나 수정하는 것을 제어하는 메커니즘

### 비관 락?

비관적 락은 실제로 데이터에 락을 걸어서 정합성을 맞추는 방법.<br>
Exclusive lock을 걸게 되면 다른 트랜잭션에서는 락이 해제되기 전에 데이터를 가져갈 수 없게 됨.<br>
그러나 Dead lock이 발생할 수 있는 위험이 있음.

> **Exclusive lock (베타적 잠금)**<br>
> 쓰기 잠금에 해당, 특정 트랜잭션이 데이터를 변경하려고 할 때, 해당 트랜잭션이 완료될 때까지 다른 트랜잭션이 해당 테이블 또는 행을 읽거나 쓰지 못하게 함

> **Dead lock (교착 상태)**<br>
> 두 개 이상의 트랜잭션이 서로의 자원을 기다리며 무한 대기 상태에 빠지는 상황

### 비관 락 예시

```mermaid
sequenceDiagram
    participant R1 as Request-1
    participant DB as Database
    participant R2 as Request-2

    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 0}

    R1->>DB: SELECT * FROM lectures WHERE lecture_id = 1 FOR UPDATE
    DB-->>R1: {id: 1, maxCapacity: 100, currentCapacity: 0}

    R2->>DB: SELECT * FROM lectures WHERE lecture_id = 1 FOR UPDATE
    DB-->>R2: (락 대기 중)

    R1->>DB: UPDATE lectures SET currentCapacity = 1 WHERE lecture_id = 1
    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 1}

    R1->>DB: 커밋
    DB-->>R1: 트랜잭션 커밋됨

    DB-->>R2: {id: 1, maxCapacity: 100, currentCapacity: 1}

    R2->>DB: UPDATE lectures SET currentCapacity = 2 WHERE lecture_id = 1
    Note over DB: {id: 1, maxCapacity: 100, currentCapacity: 2}

    R2->>DB: 커밋
    DB-->>R2: 트랜잭션 커밋됨
```
