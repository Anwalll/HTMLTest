erDiagram
    USER ||--o{ MESSAGE : Creates
    USER ||--o{ COMMENTS : Creates
    POST }|..|{ COMMENTS : Has
    USER ||--o{ VOTE : Casts
    POST ||--o{ VOTE : Receives
    COMMENTS ||--o{ VOTE : Receives
    USER ||--o{ LIKE : Gives
    POST ||--o{ LIKE : Receives
