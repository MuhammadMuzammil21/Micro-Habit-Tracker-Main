# Environment Configuration

## JWT Secrets Configured

The JWT secrets have been configured with the following values:

- **JWT_SECRET**: `438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c`
- **JWT_REFRESH_SECRET**: `438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c`

## Setup Instructions

1. **If `.env` file doesn't exist:**
   ```bash
   cp .env.example .env
   ```

2. **The JWT secrets are already configured in `.env.example`**

3. **Verify your `.env` file contains:**
   ```env
   JWT_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c
   JWT_REFRESH_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c
   ```

## Security Note

⚠️ **Important**: The `.env` file is in `.gitignore` and should never be committed to version control. The JWT secrets should remain private.

## Manual Update

If you need to manually update the `.env` file, edit it and set:
- `JWT_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c`
- `JWT_REFRESH_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c`

